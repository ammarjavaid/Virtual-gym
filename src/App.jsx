import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./routes/auth";
import HomeRoutes from "./routes/home/HomeRoutes";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./common/Loader/Loader";
import { getSingleUser } from "./Redux/actions/AuthActions";

const App = () => {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state?.gernal?.loader);
  const token = useSelector((state) => state?.auth?.userToken);

  useEffect(() => {
    if (token) {
      dispatch(getSingleUser(token));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        {loader ? <Loader /> : null}
        {token == null ? <AuthRoutes /> : <HomeRoutes />}
      </BrowserRouter>
    </>
  );
};

export default App;
