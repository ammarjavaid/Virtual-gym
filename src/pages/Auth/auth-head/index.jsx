import React from "react";
import "./auth-head.scss";
import { useNavigate } from "react-router-dom";

const Auth_Head = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="auth-head">
        <h1 onClick={() => navigate("/")}> DaruStrong </h1>
      </div>
    </>
  );
};

export default Auth_Head;
