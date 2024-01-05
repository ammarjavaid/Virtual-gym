import React from "react";
import AdminLogin from "../../pages/Auth/admin-login";
import { Routes, Route, Navigate } from "react-router-dom";
import ResetPassword from "../../pages/Auth/reset-password";
import New_Password from "../../pages/Auth/new-password";
import Otp from "../../pages/Auth/otp/Otp";

const AuthRoutes = () => {
  return (
    <>
      <Routes>
        <Route path={"*"} element={<Navigate to="/" replace />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<New_Password />} />
      </Routes>
    </>
  );
};

export default AuthRoutes;
