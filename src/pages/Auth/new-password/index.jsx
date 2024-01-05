import React, { useState } from "react";
import "./new-password.scss";
import Auth_Head from "../auth-head";
import { Form, Input, message } from "antd";
import Button from "../../../common/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";

const New_Password = () => {
  // const [passwords, setPasswords] = useState({
  //   password: "",
  //   confirm_password: "",
  // });

  const [password, setPassword] = useState();
  const [confirm_password, setConfirm_Password] = useState();

  // console.log(passwords);

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.userToken);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromURL = queryParams.get("email");
  // console.log(emailFromURL);

  const createNewPassword = async () => {
    try {
      const res = await ApiCall({
        params: { password, confirm_password, email: emailFromURL },
        route: "auth/reset_password",
        verb: "put",
        token: token,
      });
      if (res?.status == "200") {
        console.log(res?.response);
        message.success(res?.response?.message);
        navigate("/");
      } else {
        message.warning(res?.response?.message);
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="new-password">
        <Auth_Head />

        <div className="form">
          <h3> Provide new password </h3>
          <p className="new-password-text">
            Enter your new password here to reset your old password.
          </p>
          <Form layout="vertical">
            <Form.Item
              name="password"
              rules={[{ required: true, message: "please enter password" }]}
            >
              <Input.Password
                className="ant-input-affix-wrapper"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="confirm password"
              rules={[
                { required: true, message: "please enter confirm password" },
              ]}
            >
              <Input.Password
                className="ant-input-affix-wrapper"
                placeholder="Confirm new password"
                value={confirm_password}
                onChange={(e) => setConfirm_Password(e.target.value)}
              />
            </Form.Item>

            <Button
              className="reset-button"
              onClick={() => createNewPassword()}
            >
              {" "}
              Reset & return to login{" "}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default New_Password;
