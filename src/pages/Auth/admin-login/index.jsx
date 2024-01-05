import React, { useState } from "react";
import "./admin-login.scss";
import Auth_Head from "../auth-head";
import { Form, Input } from "antd";
import Button from "../../../common/button";
import { useNavigate } from "react-router-dom";
import { setLoader } from "../../../Redux/actions/GernalActions";
import validator from "../../../../utils/validation/validator";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../../Redux/actions/AuthActions";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  });

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleLoginClick = async () => {
    const { email, password } = state;
    const emailError = await validator("email", email);
    const passwordError = await validator("password", password);
    if (!emailError && !passwordError) {
      dispatch(setLoader(true));
      dispatch(
        loginRequest({
          email: email,
          password: password,
          role: "admin",
        })
      );
    } else {
      dispatch(setLoader(false));
      setState({ ...state, emailError, passwordError });
    }
  };

  return (
    <>
      <div className="adminLogin">
        <Auth_Head />

        <div className="form">
          <h3> Admin login </h3>
          <Form layout="vertical">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter valid email",
                },
              ]}
            >
              <Input
                autoComplete="off"
                className="ant-input-affix-wrapper"
                placeholder="Admin email"
                name="email"
                value={state.email}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              autoComplete={false}
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                className="ant-input-affix-wrapper"
                placeholder="Password"
                name="password"
                value={state.password}
                onChange={handleInputChange}
              />
            </Form.Item>
            <p onClick={() => navigate("/reset-password")}>Forgot password?</p>

            <Button className="login" onClick={handleLoginClick}>
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
