import React, { useEffect, useState } from "react";
import "./edit_team_member.scss";
import { Form, Input, Select, message } from "antd";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";

// const { TextArea } = Input;

const Edit_team_member = () => {
  const naviagte = useNavigate();

  const dispath = useDispatch();
  const { id } = useParams();

  const token = useSelector((state) => state.auth.userToken);

  const [form] = Form.useForm();
  const [editMember, setEditMember] = useState({
    full_name: "",
    email: "",
    description: "",
    permissionRole: "",
  });

  const [rolesData, setRolesData] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditMember({
      ...editMember,
      [name]: value,
    });
  };

  const handleRoleChange = (value) => {
    setEditMember({
      ...editMember,
      permissionRole: value,
    });
  };

  // console.log(
  //   rolesData?.map((item) => ({
  //     value: item?._id,
  //     label: item?.title,
  //   })),
  //   "roles memeber"
  // );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: editMember,
        route: `roles/update-subAdmin/${id}`,
        verb: "put",
        token: token,
      });

      if (res?.status === 200) {
        dispath(setLoader(false));
        naviagte("/coaches-team-member");
        message.success(res?.response?.message);
      } else {
        dispath(setLoader(false));
        console.log("error", res.response);
      }
    } catch (e) {
      dispath(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };

  const memberDetail = async () => {
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `roles/view-subAdmin/${id}`,
        verb: "get",
        token: token,
      });
      if (res?.status === 200) {
        dispath(setLoader(false));
        const data = res?.response?.subAdmin;
        setEditMember({
          full_name: data?.full_name,
          description: data?.description,
          email: data?.email,
          permissionRole: data.permissionRole[0]?._id,
        });
        form.setFieldsValue({
          full_name: data.full_name,
          email: data.email,
          description: data.description,
          permissionRole: data.permissionRole[0]?._id,
        });
      } else {
        dispath(setLoader(false));
        console.log("error", res.response);
      }
    } catch (error) {
      dispath(setLoader(false));
      console.log(error);
    }
  };

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
        memberDetail();
      } else {
        dispath(setLoader(false));
        console.log("error", res.response);
      }
    } catch (err) {
      dispath(setLoader(false));
      console.log(err, "error");
    }
  };

  // useEffect(() => {

  // }, [editMember]);

  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <>
      <Topbar
        title="Edit team member"
        titleOne="Coaches or team member"
        titleTwo="Edit team member"
        arrow={true}
      />

      <div className="edit-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            {/* <Form.Item name="full_name"> */}
            <label> Member name </label>
            <input
              type="text"
              placeholder="Member name"
              name="full_name"
              onChange={handleChange}
              value={editMember.full_name}
            />
            {/* </Form.Item> */}
          </div>
          <div className="input-group">
            {/* <Form.Item name="email"> */}
            <label> Email </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="disable-email"
              disabled
              autoComplete="off"
              onChange={handleChange}
              value={editMember.email}
            />
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
              onChange={handleChange}
              value={editMember.description}
            />
            {/* </Form.Item> */}
          </div>
          <div className="input-group">
            {/* <Form.Item name="permissionRole"> */}
            <label> Assign a role </label>
            <Select
              defaultValue="admin"
              placeholder="Assign a role"
              name="permissionRole"
              value={editMember.permissionRole}
              onChange={handleRoleChange}
              style={{
                width: 120,
              }}
              options={rolesData?.map((item) => ({
                value: item?._id,
                label: item?.title,
              }))}
            />
            {/* </Form.Item> */}
          </div>
          <div className="add-team-cancel-btns">
            <p className="cancel" onClick={() => naviagte(-1)}>
              Cancel
            </p>
            <button className="add-exercise" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Edit_team_member;
