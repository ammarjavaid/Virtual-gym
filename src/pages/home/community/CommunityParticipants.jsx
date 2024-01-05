import React from "react";
import "./communityParticipants.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import ParticipantsTable from "../../../components/community-participants-table/ParticipantsTable";

const CommunityParticipants = () => {
  return (
    <>
      <Topbar
        title="Community participants"
        titleOne="Community"
        titleTwo="Participants"
        arrow={true}
      />
      <div className="community-participants">
        <div className="community-participants-input">
          <img src={Search} alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="community-table">
          <ParticipantsTable hideActions={true} />
        </div>
      </div>
    </>
  );
};

export default CommunityParticipants;
