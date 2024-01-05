import React, { useState } from "react";
import "./reset-password.scss";
import Auth_Head from "../auth-head";
import { Form, Input, message } from "antd";
import Button from "../../../common/button";
import { Link, useNavigate } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useSelector } from "react-redux";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const token = useSelector((state) => state.auth.userToken);

  const verifyEmail = async () => {
    try {
      const res = await ApiCall({
        params: { email },
        route: "auth/email_verification_admin",
        verb: "put",
        token: token,
      });
      // console.log("auth verification.", res?.response);
      if (res?.status === 200) {
        console.log(res?.response);
        message.success(res?.response?.message);
        navigate(`/otp?email=${encodeURIComponent(email)}`);
      } else {
        // navigate("/reset-password");
        message.warning(res?.response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    // navigate("/otp");
    verifyEmail();
  };

  return (
    <>
      <div className="reset-password">
        <Auth_Head />

        <div className="form">
          <h3> Reset your password </h3>
          <p className="reset-password-text">
            We will send you an email containing a code to complete this process
            and reset your password.
          </p>
          <Form layout="vertical">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "please enter valid email",
                },
              ]}
            >
              <Input
                className="ant-input-affix-wrapper"
                placeholder="Email"
                value={email.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Button className="reset-button" onClick={handleClick}>
              Reset password
            </Button>

            <Link to="/"> Return to login </Link>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
