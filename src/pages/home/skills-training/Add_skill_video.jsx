import React, { useEffect, useState } from "react";
import "./add_skill_video.scss";
import { Clipper } from "../../../assets";
import Topbar from "../../../components/topbar/Topbar";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const Add_skill_video = () => {
  const [addVideo, setAddVideo] = useState({
    title: "",
    description: "",
    video: "",
  });

  const { id, childId } = useParams();
  console.log(id, childId);

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.userToken);

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({ title: "" });

  const [selectedFile, setSelectedFile] = useState(null);
  const [allVideos, setAllVideos] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

    setAddVideo({
      ...addVideo,
      [name]: value,
    });
  };

  const getAllParentFolders = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "skillvideo/all_skill_videos",
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        // console.log(res?.response);
        setAllVideos(res?.response?.folder_list);
        dispatch(setLoader(false));
      } else {
        console.log(res?.response);
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  console.log(allVideos);

  // const myData = allVideos?.map((el) => el?._id);
  // console.log(myData);

  useEffect(() => {
    getAllParentFolders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append the form data fields
    formDataToSend.append("title", addVideo.title);
    formDataToSend.append("description", addVideo.description);

    // Append the video file
    if (selectedFile) {
      formDataToSend.append("video", selectedFile);
    } else {
      formDataToSend.append("video", addVideo.video);
    }

    // Append the folder ID
    formDataToSend.append("id", id);
    formDataToSend.append("objId", childId);

    console.log(formDataToSend, "formDataToSend");

    console.log(selectedFile, "selectedFile");

    // validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // console.log("inside api");
      try {
        dispatch(setLoader(true));
        const res = await ApiCall({
          params: formDataToSend,
          route: "skillvideo/add_skill_video",
          verb: "post",
          token: token,
        });

        console.log(res, "res");
        if (res?.status == "200") {
          dispatch(setLoader(false));
          // console.log("Form data submitted:", addVideo);
          navigate(
            `/skills-training/sub-folders/all-videos/${id}/videos/${childId}`
          );
          message.success(res.response?.message);
        } else {
          message.error(res.response?.message);
          dispatch(setLoader(false));
        }
      } catch (e) {
        console.log("error", e);
        message.error(res.response?.message);
        dispatch(setLoader(false));
      }
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  console.log(addVideo);

  // validation

  const validateForm = () => {
    const errors = {};
    if (!addVideo.title) {
      errors.title = "Video Title is required";
    }
    if (!addVideo.description) {
      errors.description = "Video Description is required";
    }
    if (!addVideo.video && !selectedFile) {
      errors.video = "Video is required";
    }
    return errors;
  };

  return (
    <>
      <Topbar
        title="Add Video"
        titleOne="Skills Videos"
        titleTwo="Add skill video"
        arrow={true}
      />
      <div className="add-skill-video">
        <form className="input-groups" onSubmit={handleSubmit}>
          <label> Video title </label>
          <input
            type="text"
            placeholder="Video title"
            name="title"
            value={addVideo.title}
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
            value={addVideo.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <span className="error_email">{errors.description}</span>
          )}
          <div className="video-link-attach">
            <div className="video-link">
              <label> Video link </label>
              <input
                type="text"
                placeholder="Video link"
                name="video"
                value={addVideo.video}
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
              Add skill video
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Add_skill_video;
