import React from "react";
import Sidebar from "../sidebar/sidebar";
import "./layout.scss";

const Layout = ({ children, setAuth }) => {
  return (
    <>
      <div className="layout">
        <div className="sidebar_layout">
          <Sidebar setAuth={setAuth} />
        </div>
        <div className="content">{children}</div>
      </div>
    </>
  );
};

export default Layout;
