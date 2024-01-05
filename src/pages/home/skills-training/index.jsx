import React, { useEffect, useState } from "react";
// import "./skills-training.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Filter, Search } from "../../../assets";
import Video_gallery_table from "../../../components/video-gallery-table/Video_gallery_table";
import Deleted_video_gallery_table from "../../../components/video-gallery-table/Deleted_video_gallery_table";
import Skills_Video_Table from "../../../components/skills-video-table/Skills_Video_Table";
import Delete_Skill_Video_table from "../../../components/skills-video-table/Delete_Skill_Video_table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { ApiCall } from "../../../Services/Apis";
import { message } from "antd";

const Skills_Training = () => {
  const [skillvideo, setSkillVideo] = useState();
  const [activeTab, setActiveTab] = useState("all");
  // const [showBtn, setShowBtn] = useState(false);
  // const handleActive = (type) => {
  //   setActiveTab(type);
  // };

  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.userToken);

  const naviagte = useNavigate();

  // const filterbtnClick = () => {
  //   setShowBtn(!showBtn);
  // };

  const getAllSkillsVideo = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "skillvideo/all_skill_videos",
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        dispatch(setLoader(false));
        // console.log(res?.response);
        setSkillVideo(res?.response?.video_list);
      } else {
        message.error(res.response?.message);
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const deletePermanently = async (id) => {
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: "",
        route: `skillvideo/delete_Skill_video/${id} `,
        verb: "delete",
        token: token,
      });

      if (res?.status == "200") {
        console.log(res?.response);
        message.success(res?.response?.message);
        getAllSkillsVideo();
        dispatch(setLoader(false));
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error editing category -- ", e.toString());
    }
  };

  useEffect(() => {
    getAllSkillsVideo();
  }, []);

  // console.log(skillvideo, "skillvideo");

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = skillvideo?.filter((user) =>
    // user.title.toLowerCase().includes(search)
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  return (
    <>
      <Topbar title="Skills training videos" arrow={true} />

      <div className="video-head">
        <div className="video-head-left">
          {/* for desktop  */}

          <div className="input">
            <img src={Search} alt="" />
            <input type="text" placeholder="Search" onChange={handleChange} />
          </div>
          {/* <div className="buttons">
            <img
              src={Filter}
              alt=""
              // onClick={filterbtnClick}
              className={showBtn ? "show" : ""}
            />
            <div
              className={showBtn ? "filter-button show" : "filter-button hide"}
            >
              <button
                className={
                  activeTab === "all"
                    ? "video-head-btn activeTab"
                    : "video-head-btn"
                }
                onClick={() => handleActive("all")}
              >
                All
              </button>
              <button
                className={
                  activeTab === "deleted"
                    ? "video-head-btn activeTab"
                    : "video-head-btn"
                }
                onClick={() => handleActive("deleted")}
              >
                Deleted
              </button>
            </div>
          </div> */}

          {/* for mobile  */}
        </div>
        <div className="video-head-right">
          <button
            className="add-client"
            onClick={() =>
              naviagte(
                "/all-category-skill-videos/skills-training/add-skill-video"
              )
            }
          >
            Add skills video
          </button>
        </div>
      </div>

      <div className="video-gallery-table">
        <Skills_Video_Table
          skillvideo={filterData}
          deletePermanently={deletePermanently}
        />
      </div>

      {/* {activeTab === "all" && (
        <>
          <div className="video-gallery-table">
            <Skills_Video_Table skillvideo={skillvideo?.video_list} />
          </div>
        </>
      )}

      {activeTab === "deleted" && (
        <>
          <div className="video-gallery-table">
            <Delete_Skill_Video_table />
          </div>
        </>
      )} */}
    </>
  );
};

export default Skills_Training;
