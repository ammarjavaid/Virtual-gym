import React, { useEffect, useState } from "react";
import "./role_details.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";

const RoleDetails = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userToken);
  const { id } = useParams();
  const dispath = useDispatch();
  const [singleRole, setSingleRole] = useState();

  const getSingleRoleDetail = async () => {
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `roles/detail_role/${id}`,
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        dispath(setLoader(false));
        setSingleRole(res?.response?.detail);
      }
    } catch (error) {
      dispath(setLoader(false));
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleRoleDetail();
    }
  }, []);

  console.log(singleRole);

  return (
    <>
      <Topbar
        title="Role details"
        titleOne="Roles & permissions"
        titleTwo="Role details"
        arrow={true}
      />

      <div className="add-role-details">
        <div className="add-role-details-name">
          <p className="add-role-details-name-left"> Role name </p>
          <p className="add-role-details-name-right">{singleRole?.title}</p>
        </div>
        <div className="add-role-details-description">
          <p className="add-role-details-name-left">Description / Details</p>
          <p className="add-role-details-name-right">
            {singleRole?.description}
          </p>
        </div>

        <p className="permission"> Permission </p>

        {singleRole?.permissions.map((item) => (
          <div className="main">
            <div className="add-role-details-assigned">
              <p className="add-role-details-assigned-head-left">
                {item?.name}
              </p>
              <p className="add-role-details-assigned-head-right">
                {item?.isGranted ? "Assigned" : "Not Assigned"}
              </p>
            </div>
            {item?.sub_permissions.map((subItem) => (
              <>
                <div className="add-role-details-assigned">
                  <p className="add-role-details-assigned-left">
                    {subItem?.name}
                  </p>
                  <p className="add-role-details-assigned-right">
                    {subItem?.isGranted ? "Assigned" : "Not Assigned"}
                  </p>
                </div>
              </>
            ))}
          </div>
        ))}

        <div className="add-role-details-btn" onClick={() => navigate(-1)}>
          <p className="contact-back-btn"> Back </p>
        </div>
      </div>
    </>
  );
};

export default RoleDetails;
