import React, { useEffect, useState } from "react";
import Topbar from "../../../components/topbar/Topbar";
import "./member-details.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";

const MemberDetails = () => {
  const navigate = useNavigate();

  const dispath = useDispatch();
  const { id } = useParams();

  const token = useSelector((state) => state.auth.userToken);

  const [singleMember, setSingleMember] = useState();

  const memberDetail = async () => {
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `roles/view-subAdmin/${id}`,
        verb: "get",
        token: token,
      });
      if (res?.status === 200) {
        dispath(setLoader(false));
        setSingleMember(res?.response?.subAdmin);
      } else {
        dispath(setLoader(false));
        console.log("error", res.response);
      }
    } catch (error) {
      dispath(setLoader(false));
      console.log(error);
    }
  };

  useEffect(() => {
    memberDetail();
  }, []);

  return (
    <>
      <Topbar
        title="Team member details"
        titleOne="Add new coach or team member"
        titleTwo="Team member details"
        arrow={true}
      />

      <div className="team-member-details">
        <div className="team-member-details-name">
          <p className="team-member-details-name-left"> Member name </p>
          <p className="team-member-details-name-right">
            {singleMember?.full_name}
          </p>
        </div>
        <div className="team-member-details-email">
          <p className="team-member-details-name-left"> Email address </p>
          <p className="team-member-details-name-right">
            {singleMember?.email}
          </p>
        </div>
        {/* <div className="team-member-details-password">
          <p className="team-member-details-name-left"> Password </p>
          <p className="team-member-details-name-right">723672</p>
        </div> */}
        <div className="team-member-details-description">
          <p className="team-member-details-name-left">Description / Details</p>
          <p className="team-member-details-name-right">
            {singleMember?.description}
          </p>
        </div>
        <div className="team-member-details-role">
          <p className="team-member-details-name-left"> Role </p>
          <p className="team-member-details-name-right">
            {singleMember?.permissionRole[0]?.title}
          </p>
        </div>
        <div className="team-member-details-btn" onClick={() => navigate(-1)}>
          <p className="contact-back-btn"> Back </p>
        </div>
      </div>
    </>
  );
};

export default MemberDetails;
