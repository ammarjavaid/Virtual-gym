import React, { useEffect, useState } from "react";
import Topbar from "../../../components/topbar/Topbar";
import VideoIframe from "../../../common/VideoIframe";
import { ApiCall } from "../../../Services/Apis";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "./gallery-videos-details.scss";
import { setLoader } from "../../../Redux/actions/GernalActions";

const Gallery_videos_details = () => {
  const [detailVideo, setDetailVideo] = useState([]);

  // const { id } = useParams();
  const { id } = useParams();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.userToken);
  const [videoDetail, setVideoDetail] = useState();

  // const getSingleVideo = async () => {
  //   try {
  //     dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: "",
  //       route: `exercisevideo/detail_exercise_video/${id}`,
  //       verb: "get",
  //       token: token,
  //     });

  //     if (res?.status == "200") {
  //       dispatch(setLoader(false));
  //       const video = res?.response?.video;
  //       setDetailVideo(video);
  //       // setFormData({
  //       //   title: video?.title,
  //       //   description: video?.description,
  //       //   video: video?.video,
  //       //   category: video?.category,
  //       // });
  //     } else {
  //       console.log("error", res.response);
  //       dispatch(setLoader(false));
  //       message.error(res.response?.message);
  //     }
  //   } catch (e) {
  //     dispatch(setLoader(false));
  //     console.log("error -- ", e.toString());
  //   }
  // };

  // console.log(detailVideo);

  // useEffect(() => {
  //   if (id) {
  //     getSingleVideo();
  //   }
  // }, [id]);

  const getSingleVideo = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `exercisevideo/detail_exercise_video/${id}`,
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        console.log(res?.response);
        setVideoDetail(res?.response?.parent_folder);
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
    getSingleVideo();
  }, []);

  console.log(videoDetail);

  return (
    <>
      <Topbar
        title="Exercise Video detail"
        titleOne="Exercise Videos"
        titleTwo="Exercise video detail"
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
          <div className="gallery-video-name">
            <p className="gallery-video-name-left"> Category </p>
            <p className="gallery-video-name-right"> {videoDetail?.type} </p>
          </div>
          {/* <div className="gallery-videos-category">
            <p className="gallery-video-name-left"> Category </p>
            <p className="gallery-video-name-right">{detailVideo?.category}</p>
          </div> */}
          <div className="gallery-videos-description">
            <p className="gallery-video-name-left"> Description </p>
            <p className="gallery-video-name-right">
              {videoDetail?.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery_videos_details;
