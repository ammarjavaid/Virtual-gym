import React, { useState } from "react";
import "./otp.scss";
import Auth_Head from "../auth-head";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import { useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";

const Otp = () => {
  const [verification_code, setVerification_code] = useState("");

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.userToken);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailFromURL = queryParams.get("email");
  // console.log(emailFromURL);

  const verifyOTP = async () => {
    // console.log("inside");
    try {
      const res = await ApiCall({
        params: { verification_code, email: emailFromURL },
        route: "auth/code_verification",
        verb: "post",
        token: token,
      });
      // console.log("run");
      if (res?.status == "200") {
        console.log(res?.response);
        message.success(res?.response?.message);
        navigate(`/new-password?email=${encodeURIComponent(emailFromURL)}`);
      } else {
        console.log(res?.response?.message);
        message.warning(res?.response?.message);
      }
    } catch (error) {
      console.log(error);
      message.warning(res?.response?.message);
    }
  };

  const handleClick = () => {
    verifyOTP();
  };

  return (
    <>
      <div className="reset-password">
        <Auth_Head />

        <div className="form">
          <h3> Please enter your Otp </h3>
          <Form layout="vertical">
            <Form.Item
              name="number"
              rules={
                [
                  // {
                  // required: true,
                  // type: "number",
                  // message: "please enter valid otp",
                  // },
                ]
              }
            >
              <Input
                className="ant-input-affix-wrapper"
                placeholder="Otp"
                type="number"
                value={verification_code.verification_code}
                onChange={(e) => setVerification_code(e.target.value)}
                inputMode="numeric"
              />
            </Form.Item>

            <Button className="reset-button" onClick={handleClick}>
              Verify
            </Button>

            <Link to="/"> Return to login </Link>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Otp;
