import React, { useEffect, useState } from "react";
import "./add-new-coach.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import AddNewCoachTable from "../../../components/AddCoachTable/AddNewCoachTable";
import { useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { setLoader } from "../../../Redux/actions/GernalActions";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const Add_new_Coach = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userToken);
  const [allAdmin, setAllAdmin] = useState([]);
  const dispath = useDispatch();
  const { checkSubPermissions } = usePermissionCheck();

  const deletePermanently = async (id) => {
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `roles/delete-subAdmin/${id} `,
        verb: "delete",
        token: token,
      });
      if (res?.status == 200) {
        dispath(setLoader(false));
        message.success(res?.response?.message);
        getAllCoachesandTeam();
      } else {
        dispath(setLoader(false));
        console.log("error", res.response);
      }
    } catch (error) {
      dispath(setLoader(false));
      console.log(error);
    }
  };

  const getAllCoachesandTeam = async () => {
    try {
      dispath(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "roles/all-subAdmin",
        verb: "get",
        token: token,
      });
      if (res?.status === 200) {
        dispath(setLoader(false));
        setAllAdmin(res?.response?.subAdmins);
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
    getAllCoachesandTeam();
  }, []);

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = allAdmin?.filter((user) =>
    // user.full_name.toLowerCase().includes(search)
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  return (
    <>
      <Topbar title="Coaches or Team Member" />

      <div className="team-member-head">
        <div className="team-member-input-workout">
          <img src={Search} alt="" />
          <input type="text" placeholder="Search" onChange={handleChange} />
        </div>
        {checkSubPermissions("coaches-team-member", "addCoachesAndTeamMembers")
          ?.status ? (
          <div
            className="btn"
            onClick={() => navigate("/coaches-team-member/add-team-member")}
          >
            Add team member
          </div>
        ) : null}
      </div>

      <div className="add-new-coach-table">
        <AddNewCoachTable
          allAdmin={filterData}
          deletePermanently={deletePermanently}
        />
      </div>
    </>
  );
};

export default Add_new_Coach;
