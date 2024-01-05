import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import Sticky from "react-stickynode";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/actions/AuthActions";
import usePermissionCheck from "../../../utils/usePermissionCheck";
import { message } from "antd";
import Swal from "sweetalert2";
import { ApiCall } from "../../Services/Apis";
// import Swal from "sweetalert2/dist/sweetalert2.js";
// import "sweetalert2/src/sweetalert2.scss";

const Sidebar = ({ setAuth }) => {
  // const currentURL = window.location.href;
  // const [activeTab, setActiveTab] = useState("Dashboard");
  const location = useLocation();
  const { checkPermission } = usePermissionCheck();

  const path = location.pathname;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f79300",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("run");
        localStorage.removeItem("token");
        dispatch(logout());
        message.success("Logout!");
      }
    });
  };

  return (
    <>
      <Sticky top={21} bottomBoundary="#content">
        <div className="Sidebar">
          <div className="sidebar__content">
            <div className="top">
              <h1> DaruStrong </h1>
              <ul>
                {checkPermission("dashboard").status && (
                  <NavLink to="/dashboard">
                    <li>Dashboard</li>
                  </NavLink>
                )}
                {checkPermission("client").status && (
                  <NavLink to="/client">
                    <li>Custom Coaching Clients</li>
                  </NavLink>
                )}
                {checkPermission("library").status && (
                  <NavLink to="/library">
                    <li>Library</li>
                  </NavLink>
                )}
                {checkPermission("gallery-videos").status && (
                  <NavLink to="/gallery-videos">
                    <li>Exercise Videos</li>
                  </NavLink>
                )}
                {checkPermission("workout-program").status && (
                  <NavLink to="/workout-program">
                    <li>Workout Programs</li>
                  </NavLink>
                )}
                {checkPermission("messages").status && (
                  <NavLink to="/messages">
                    <li>Messages</li>
                  </NavLink>
                )}
                {checkPermission("app-members").status && (
                  <NavLink to="/app-members">
                    <li>App Members</li>
                  </NavLink>
                )}
                {checkPermission("contact-request").status && (
                  <NavLink to="/contact-request">
                    <li>Contact Request</li>
                  </NavLink>
                )}
                {checkPermission("skills-training").status && (
                  <NavLink to="/skills-training">
                    <li>Skills Training</li>
                  </NavLink>
                )}
                {checkPermission("role-permission").status && (
                  <NavLink to="/role-permission">
                    <li>Roles & Permissions</li>
                  </NavLink>
                )}
                {checkPermission("coaches-team-member").status && (
                  <NavLink to="/coaches-team-member">
                    <li>Coaches or Team Member</li>
                  </NavLink>
                )}
              </ul>
            </div>
            <div onClick={handleLogoutClick} className="logout">
              Logout
            </div>
          </div>
        </div>
      </Sticky>
    </>
  );
};

export default Sidebar;
