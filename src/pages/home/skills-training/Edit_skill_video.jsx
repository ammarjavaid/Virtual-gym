import React, { useEffect, useState } from "react";
import "./edit_skill_video.scss";
import Topbar from "../../../components/topbar/Topbar";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { Clipper } from "../../../assets";
import { ApiCall } from "../../../Services/Apis";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Edit_skill_video = () => {
  const dispatch = useDispatch();

  const { id, objId, objIds } = useParams();
  console.log(objId, id, objIds);

  const location = useLocation();
  const receivedData = location.state;

  console.log(receivedData, "receivedData");

  const naviagte = useNavigate();

  const [editSkillVideo, setEditSkillVideo] = useState({
    title: "",
    description: "",
    video: "",
    video_thumbnail: "",
  });

  const token = useSelector((state) => state.auth.userToken);

  const [errors, setErrors] = useState({ title: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    console.log(e, "haldeselect");
    const { name, value } = e.target;
    setEditSkillVideo({
      ...editSkillVideo,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append the form data fields
    formDataToSend.append("title", editSkillVideo.title);
    formDataToSend.append("description", editSkillVideo.description);
    formDataToSend.append("video_thumbnail", editSkillVideo.video_thumbnail);

    // Append the folder ID
    formDataToSend.append("objId", objId);
    formDataToSend.append("childId", objIds);

    // Append the video file
    if (selectedFile) {
      formDataToSend.append("video", selectedFile);
    } else {
      formDataToSend.append("video", editSkillVideo.video);
    }

    // validation
    const validationErrors = validateForm();
    console.log("validationErrors", validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        // dispatch(setLoader(true));

        const res = await ApiCall({
          params: formDataToSend,
          route: `skillvideo/edit_skill_video/${id}`,
          verb: "put",
          token: token,
        });

        console.log(res, "res");
        if (res?.status == "200") {
          console.log(res?.response, "res");
          dispatch(setLoader(false));
          message.success(res.response?.message);
          // naviagte(`/skills-training/sub-folders/all-videos/${id}`);
          naviagte(
            `/skills-training/sub-folders/all-videos/${id}/videos/${objIds}`
          );
        } else {
          message.error(res.response?.message);
          // dispatch(setLoader(false));
        }
      } catch (e) {
        console.log("error", e);
        // message.error(res.response?.message);
        // dispatch(setLoader(false));
      }

      console.log("Form submitted:");
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  // const getSinglevideo = async () => {
  //   try {
  //     dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: "",
  //       route: `skillvideo/detail_skill_video/${id}`,
  //       verb: "get",
  //       token: token,
  //     });
  //     console.log(res, "res");
  //     if (res?.status == 200) {
  //       dispatch(setLoader(false));
  //       // const video = res?.response?.video;
  //       // setEditSkillVideo({
  //       //   title: video?.title,
  //       //   description: video?.description,
  //       //   video: video?.video,
  //       // });
  //     } else {
  //       dispatch(setLoader(false));
  //       console.log(res?.response?.message);
  //     }
  //   } catch (error) {
  //     dispatch(setLoader(false));
  //     console.log(error);
  //   }
  // };

  const getSinglevideo = async () => {
    try {
      // dispatch(setLoader(true));
      const res = await ApiCall({
        params: { childId: objIds, objId: objId },
        route: `skillVideo/detail_video/${id}`,
        verb: "post",
        token: token,
      });
      console.log(res, "res");
      if (res?.status == 200) {
        // dispatch(setLoader(false));
        const video = res?.response?.video;
        setEditSkillVideo({
          title: video?.title,
          description: video?.description,
          video: video?.video,
          video_thumbnail: video?.video_thumbnail,
        });
      } else {
        // dispatch(setLoader(false));
        console.log(res?.response?.message);
      }
    } catch (error) {
      // dispatch(setLoader(false));
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getSinglevideo();
    }
  }, []);

  console.log(editSkillVideo, "editSkillVideo");

  // validation

  const validateForm = () => {
    const errors = {};
    if (!editSkillVideo.title) {
      errors.title = "Video Title is required";
    }
    if (!editSkillVideo.description) {
      errors.description = "Video Description is required";
    }
    if (!editSkillVideo.video && !selectedFile) {
      errors.video = "Video Link is required";
    }
    return errors;
  };

  return (
    <>
      <Topbar
        // title="Edit skill video"/
        title="Edit Video"
        arrow={true}
        // titleOne="Skills videos"
        // titleTwo="Edit skill video"
      />
      <div className="edit-skill-video">
        <form className="input-groups" onSubmit={handleSubmit}>
          <label> Video title </label>
          <input
            type="text"
            placeholder="Video title"
            name="title"
            value={editSkillVideo.title}
            onChange={handleInputChange}
          />
          {errors.title && <span className="error_email">{errors.title}</span>}
          <label> Video description </label>
          <textarea
            rows={7}
            cols={8}
            type="text"
            placeholder="Video description"
            name="description"
            value={editSkillVideo.description}
            onChange={handleInputChange}
          />
          {errors.video && (
            <span className="error_email">{errors.description}</span>
          )}

          <div className="video-link-attach">
            <div className="video-link">
              <label> Video link </label>
              <input
                type="text"
                placeholder="Video link"
                name="video"
                value={editSkillVideo.video}
                onChange={handleInputChange}
              />
              {errors.video && (
                <span className="error_email">{errors.video}</span>
              )}
            </div>
            <p className="or"> Or </p>
            <div className="video-attach">
              <label> Attach video </label>
              <div className="file_input">
                <label htmlFor="fileInput" className="label">
                  <img src={Clipper} alt="" className="img_gal" />
                  {selectedFile ? (
                    <p>{selectedFile?.name}</p>
                  ) : (
                    <p> Attach video </p>
                  )}
                </label>
                <input
                  type="file"
                  accept="video/mp4"
                  id="fileInput"
                  placeholder="Akmkas"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="buttons">
            <p className="cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>
            <button className="add-client" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Edit_skill_video;
