import React, { useState } from "react";
import "./change-password.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Form, Input, message } from "antd";
import Button from "../../../common/button";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { ApiCall } from "../../../Services/Apis";
import { useNavigate } from "react-router-dom";

const Change_Password = () => {
  const token = useSelector((state) => state.auth.userToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await ApiCall({
        params: formData,
        route: "auth/change_password",
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        // console.log(formData);
        navigate("/dashboard");
        message.success("Password has been updated");
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));

        alert(res?.response?.message, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (e) {
      console.log("login error -- ", e.toString());
    }
  };
  return (
    <>
      <Topbar
        title="Change Password"
        arrow={true}
        titleOne="My account"
        titleTwo="Change Password"
      />
      <div className="change-password">
        <div className="inputs__cahnge-password">
          <Form layout="vertical">
            <Form.Item
              autoComplete={false}
              name="old_password"
              rules={[
                {
                  required: true,
                  message: "Please enter valid old password",
                },
              ]}
            >
              <Input.Password
                autoComplete="off"
                className="ant-input-affix-wrapper"
                placeholder="Old password"
                name="old_password"
                type="password"
                value={formData.old_password}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              autoComplete={false}
              name="new_password"
              rules={[{ required: true, message: "Please enter new password" }]}
            >
              <Input.Password
                className="ant-input-affix-wrapper"
                placeholder="New password"
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              autoComplete={false}
              name="confirm_password"
              rules={[
                { required: true, message: "Please enter confirm password" },
              ]}
            >
              <Input.Password
                className="ant-input-affix-wrapper"
                placeholder="Confirm password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
              />
            </Form.Item>

            <div className="buttons">
              <p onClick={() => navigate(-1)}>Cancel</p>
              <Button className="update" onClick={handleSubmit}>
                {" "}
                Update{" "}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Change_Password;
