import React, { useEffect, useState } from "react";
import "./add_team_member.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const { TextArea } = Input;

const AddTeamMember = () => {
  const navigate = useNavigate();

  const dispath = useDispatch();

  const token = useSelector((state) => state.auth.userToken);

  const [addMember, setAddMember] = useState({
    full_name: "",
    email: "",
    description: "",
    permissionRole: "",
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    description: "",
    permissionRole: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

    setAddMember({
      ...addMember,
      [name]: value,
    });
  };

  const handleRoleChange = (value) => {
    setAddMember({
      ...addMember,
      permissionRole: value,
    });

    // Clear the error when the user makes a selection
    setErrors((prevErrors) => ({
      ...prevErrors,
      permissionRole: "",
    }));
  };

  const [rolesData, setRolesData] = useState();

  const getAllRoles = async () => {
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "roles/all_roles",
        verb: "get",
        token: token,
      });
      if (res?.status === 200) {
        dispath(setLoader(false));
        setRolesData(res?.response?.list);
      } else {
        dispath(setLoader(false));
        console.log("error", res.response);
      }
    } catch (err) {
      dispath(setLoader(false));
      console.log(err, "error");
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // console.log("addMember", addMember);

      try {
        const res = await ApiCall({
          params: addMember,
          route: "roles/add-subAdmin",
          verb: "post",
          token: token,
        });

        if (res?.status == "200") {
          message.success(res?.response?.message);
          navigate("/coaches-team-member");
        } else {
          message.error(res.response.message);
        }
      } catch (e) {
        console.log("error -- ", e.toString());
      }
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  console.log(addMember.permissionRole, "addMember.permissionRole");

  const validateForm = () => {
    const errors = {};
    if (!addMember.full_name) {
      errors.full_name = "Member name is required";
    }
    if (!addMember.email) {
      errors.email = "Email is required";
    } else if (!isEmailValid(addMember.email)) {
      errors.email = "Invalid email address";
    }
    if (!addMember.description) {
      errors.description = "Description is required";
    }
    if (!addMember.permissionRole) {
      errors.permissionRole = "Role is required";
    }
    return errors;
  };

  return (
    <>
      <Topbar
        title="Add team member"
        titleOne="Coaches or team member"
        titleTwo="Add team member"
        arrow={true}
      />

      <div className="add-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            {/* <Form.Item name="full_name"> */}
            <label> Member name </label>
            <input
              type="text"
              placeholder="Member name"
              name="full_name"
              value={addMember.full_name}
              onChange={handleChange}
            />
            {errors.full_name && (
              <span className="error_email">{errors.full_name}</span>
            )}
            {/* </Form.Item> */}
          </div>
          <div className="input-group">
            {/* <Form.Item name="email"> */}
            <label> Email </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={addMember.email}
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error_email">{errors.email}</span>
            )}
            {/* </Form.Item> */}
          </div>
          <div className="input-group">
            {/* <Form.Item name="description"> */}
            <label> Description / Details </label>
            <textarea
              rows={4}
              type="text"
              placeholder="Description / Details"
              name="description"
              value={addMember.description}
              onChange={handleChange}
            />
            {errors.description && (
              <span className="error_email">{errors.description}</span>
            )}
            {/* </Form.Item> */}
          </div>
          <div className="input-group">
            <label> Assigned a role </label>
            <Select
              // defaultValue="Assigned a role"
              placeholder="Assigned a role"
              // value={addMember.permissionRole}
              name="permissionRole"
              onChange={handleRoleChange}
              style={{
                width: 120,
              }}
              options={rolesData?.map((item) => ({
                value: item?._id,
                label: item?.title,
              }))}
            />
            {errors.permissionRole && (
              <span className="error_email">{errors.permissionRole}</span>
            )}
          </div>
          <div className="add-team-cancel-btns">
            <p className="cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>

            <button className="add-exercise" type="submit">
              Add team member
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTeamMember;
