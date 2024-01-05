import React, { useEffect, useState } from "react";
import "./skill_video_detail.scss";
import Topbar from "../../../components/topbar/Topbar";
import VideoIframe from "../../../common/VideoIframe";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";

const Skill_video_detail = () => {
  const { id, objId, objIds } = useParams();
  console.log(id, objId, objIds);
  const token = useSelector((state) => state.auth.userToken);
  const [videoDetail, setVideoDetail] = useState();

  const dispatch = useDispatch();

  const location = useLocation();
  const receivedData = location.state;

  console.log(receivedData, "receivedData");

  // const getSingleSkillVideo = async () => {
  //   try {
  //     dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: "",
  //       route: `skillvideo/detail_skill_video/${id}`,
  //       verb: "get",
  //       token: token,
  //     });
  //     if (res?.status == 200) {
  //       dispatch(setLoader(false));
  //       // console.log(res?.response);
  //       setVideoDetail(res?.response?.video);
  //     } else {
  //       dispatch(setLoader(false));
  //       console.log(res?.response?.message);
  //     }
  //   } catch (error) {
  //     dispatch(setLoader(false));
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (id) {
  //     getSingleSkillVideo();
  //   }
  // }, []);

  // console.log(videoDetail);

  const getSingleSkillVideo = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: {
          childId: objIds,
          objId: objId,
        },
        route: `skillVideo/detail_video/${id}`,
        verb: "post",
        token: token,
      });
      if (res?.status == 200) {
        setVideoDetail(res?.response.video);
        dispatch(setLoader(false));
      } else {
        console.log(res?.response?.message);
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    if (id) {
      getSingleSkillVideo();
    }
  }, []);

  // console.log(videoDetail, "videoDetail");

  return (
    <>
      <Topbar
        title="Skills Video detail"
        titleOne="Skills Videos"
        titleTwo="Skills video detail"
        arrow={true}
      />
      <div className="gallery-videos-details">
        <VideoIframe
          className="exercise-video-iframe"
          style={{ backgroundColor: "red" }}
          height={"300px"}
          url={videoDetail?.video}
        />
        <div className="gallery-videos-details-content">
          <div className="gallery-video-name">
            <p className="gallery-video-name-left"> Video name </p>
            <p className="gallery-video-name-right"> {videoDetail?.title} </p>
          </div>
          {/* <div className="gallery-videos-category">
            <p className="gallery-video-name-left"> Category </p>
            <p className="gallery-video-name-right">{detailVideo?.category}</p>
          </div> */}
          <div className="gallery-videos-description">
            <p className="gallery-video-name-left"> Description </p>
            <p className="gallery-video-name-right">
              {" "}
              {videoDetail?.description}{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skill_video_detail;
