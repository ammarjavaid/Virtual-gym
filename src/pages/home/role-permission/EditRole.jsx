import React, { useEffect, useState } from "react";
import "./addRole.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Form, Input, Switch, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { subAdminPermissions } from "../../../../utils/Permissions";
import { Chevron_Down } from "../../../assets";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setSingleUser } from "../../../Redux/actions/AuthActions";

const { TextArea } = Input;

const EditRole = () => {
  const token = useSelector((state) => state.auth.userToken);
  const { id } = useParams();

  const dispatch = useDispatch();

  // console.log(id);

  const rolePermissions = {
    primary: subAdminPermissions,
  };
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    permissions: rolePermissions["primary"],
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const [index, subIndex] = name.split("-").map(Number);

      if (name.split("-")[1] === "showSub") {
        setFormState((prevState) => ({
          ...prevState,
          permissions: formState.permissions.map((p, i) => {
            if (i === index) {
              return { ...p, showSub: checked };
            } else {
              return p;
            }
          }),
        }));
      }

      if (name.split("-")[1] !== "showSub") {
        if (subIndex === undefined) {
          // Main permission checkbox
          const updatedPermissions = [...formState.permissions];
          updatedPermissions[index] = {
            ...updatedPermissions[index],
            isGranted: checked,
            showSub: true,
            sub_permissions: checked
              ? updatedPermissions[index].sub_permissions.map((subPerm) => ({
                  ...subPerm,
                  isGranted: true,
                }))
              : updatedPermissions[index].sub_permissions.map((subPerm) => ({
                  ...subPerm,
                  isGranted: false,
                })),
          };
          setFormState((prevState) => ({
            ...prevState,
            permissions: updatedPermissions,
          }));
        } else {
          // Sub-permission checkbox
          const updatedPermissions = [...formState.permissions];
          updatedPermissions[index].sub_permissions[subIndex] = {
            ...updatedPermissions[index].sub_permissions[subIndex],
            isGranted: checked,
          };
          setFormState((prevState) => ({
            ...prevState,
            permissions: updatedPermissions,
          }));
        }
      }
    } else {
      if (name.split("-")[1] !== "showSub") {
        setFormState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      description: "",
    };

    const validateField = (fieldName, errorMessage) => {
      if (formState[fieldName].trim() === "") {
        newErrors[fieldName] = errorMessage;
        valid = false;
      }
    };
    validateField("name", "Name is required");
    validateField("description", "Description is required");
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const permissions = formState.permissions.map((permission) => {
        const { showSub, ...rest } = permission;
        return rest;
      });

      try {
        const res = await ApiCall({
          params: {
            title: formState.name,
            description: formState.description,
            permissions,
          },
          route: `roles/edit_role/${id}`,
          verb: "put",
          token: token,
        });

        if (res?.status == "200") {
          message.success(res?.response?.message);
          setFormState({});
          // console.log(res?.response);
          setErrors({});
          navigate("/role-permission");
          // dispatch(get(res?.response?.data?.permissions));
        } else {
          console.log("error", res.response);
        }
      } catch (e) {
        console.log("error -- ", e.toString());
      }
    } else {
      console.log(errors);
    }
  };

  // console.log(formState);

  const renderError = (fieldName) => {
    return (
      errors[fieldName] && <span className="error">{errors[fieldName]}</span>
    );
  };
  const fetchData = async () => {
    try {
      const res = await ApiCall({
        params: {},
        route: `roles/detail_role/${id}`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setFormState({
          name: res?.response?.detail?.title,
          description: res?.response?.detail?.description,
          permissions: res?.response?.detail?.permissions,
        });
        setErrors({});
        // dispatch(setSingleUser());
      } else {
        console.log("error", res.response);
      }
    } catch (e) {
      console.log("error -- ", e.toString());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log(formState, " form state");

  return (
    <>
      <Topbar
        title="Update a role"
        titleOne="Roles & permissions"
        titleTwo="Update a role"
        arrow={true}
      />

      <div className="add-role-form">
        <form>
          <div className="input-group">
            {/* <Form.Item name="name"> */}
            <label> Role name </label>
            <input
              type="text"
              placeholder="Role name"
              name="name"
              value={formState?.name}
              onChange={handleInputChange}
            />
            {/* </Form.Item> */}
            {renderError("name")}
          </div>
          <div className="input-group">
            {/* <Form.Item name="description"> */}
            <label> Description / Details </label>
            <textarea
              rows={4}
              type="text"
              name="description"
              value={formState?.description}
              placeholder="Description / Details"
              onChange={handleInputChange}
            />
            {/* </Form.Item> */}
            {renderError("description")}
          </div>

          <p className="permission"> Permissions </p>
          <div className="all-checkboxes-container">
            <p>Allow a permission by checking a box</p>
            {formState.permissions?.map((perm, index) => (
              <div className="single-roles-and-permission-form-item">
                <div key={index} className="single-checkbox-container">
                  <div className="label">
                    <span>{perm.name}</span>
                    <div className="label-right">
                      <Switch
                        size="small"
                        defaultChecked={perm.isGranted}
                        checked={perm.isGranted}
                        onChange={(v) =>
                          handleInputChange({
                            target: {
                              checked: v,
                              name: `${index}`,
                              type: "checkbox",
                            },
                          })
                        }
                      />
                      {perm?.sub_permissions?.length ? (
                        <img
                          className={perm.showSub ? "show-arrow-up" : ""}
                          src={Chevron_Down}
                          onClick={() =>
                            handleInputChange({
                              target: {
                                checked: !perm.showSub,
                                name: `${index}-${"showSub"}`,
                                type: "checkbox",
                              },
                            })
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                {perm.showSub && perm?.sub_permissions && (
                  <div className="all-checkboxes-container">
                    {perm?.sub_permissions?.map((subPerm, subIndex) => (
                      <div key={subIndex} className="single-checkbox-container">
                        <label className="sub-label">
                          <input
                            className="checkbox-input"
                            name={`${index}-${subIndex}`}
                            type="checkbox"
                            checked={subPerm.isGranted}
                            onChange={handleInputChange}
                          />
                          <span>{subPerm.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="add-team-cancel-btns">
            <p className="cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>
            <p className="add-exercise" onClick={handleSubmit}>
              Update role
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRole;
