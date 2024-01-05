import React, { useState } from "react";
import "./add_new_video.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, message } from "antd";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { Clipper } from "../../../assets";

const Add_new_video = () => {
  const token = useSelector((state) => state.auth.userToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: "",
    type: "Choose category",
  });

  // const { id } = useParams();
  // console.log(id);

  const [errors, setErrors] = useState({ title: "" });

  const [selectedFile, setSelectedFile] = useState(null);

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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formDataToSend = new FormData();

  //   // Append the form data fields
  //   formDataToSend.append("title", formData.title);
  //   formDataToSend.append("description", formData.description);
  //   // formDataToSend.append("category", formData.category);

  //   // Append the video file
  //   if (selectedFile) {
  //     formDataToSend.append("video", selectedFile);
  //   } else {
  //     formDataToSend.append("video", formData.video);
  //   }

  //   // console.log(selectedFile, "selectedFile");

  //   // validation
  //   const validationErrors = validateForm();

  //   if (Object.keys(validationErrors).length === 0) {
  //     try {
  //       dispatch(setLoader(true));

  //       const res = await ApiCall({
  //         params: formDataToSend,
  //         route: "exercisevideo/add_exercise_video",
  //         verb: "post",
  //         token: token,
  //       });

  //       if (res?.status == "200") {
  //         dispatch(setLoader(false));
  //         // console.log("Form data submitted:", formData);
  //         navigate("/gallery-videos");
  //         message.success(res.response?.message);
  //       } else {
  //         message.error(res.response?.message);
  //         dispatch(setLoader(false));
  //       }
  //     } catch (e) {
  //       console.log("error", e);
  //       message.error(res.response?.message);
  //       dispatch(setLoader(false));
  //     }
  //   } else {
  //     setErrors(validationErrors);
  //     return;
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append the form data fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.type);

    // Append the video file
    if (selectedFile) {
      formDataToSend.append("video", selectedFile);
    } else {
      formDataToSend.append("video", formData.video);
    }

    // validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(setLoader(true));

        const res = await ApiCall({
          params: formDataToSend,
          route: "exercisevideo/add_exercise_video",
          verb: "post",
          token: token,
        });

        if (res?.status == "200") {
          console.log(res?.response);
          dispatch(setLoader(false));
          // console.log("Form data submitted:", formData);
          navigate(`/gallery-videos`);
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

  // validation

  const validateForm = () => {
    const errors = {};
    if (!formData.title) {
      errors.title = "Video title is required";
    }
    if (!formData.description) {
      errors.description = "Video description is required";
    }
    if (!formData.video && !selectedFile) {
      errors.video = "Video is required";
    }
    if (formData.type === "Choose category") {
      errors.type = "Type is required";
    }
    return errors;
  };

  return (
    <>
      <Topbar
        title="Add new exercise video"
        arrow={true}
        titleOne="Exercise Videos"
        titleTwo="Add exercise video"
      />
      <div className="add-new-video">
        <form className="input-groups" onSubmit={handleSubmit}>
          <label> Video title </label>
          <input
            type="text"
            placeholder="Video title"
            name="title"
            value={formData.title}
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
            value={formData.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <span className="error_email">{errors.description}</span>
          )}

          <div className="select_category">
            <Select
              defaultValue="Choose category"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "Abs",
                  label: "Abs",
                },
                {
                  value: "Back",
                  label: "Back",
                },
                {
                  value: "Biceps",
                  label: "Biceps",
                },
                {
                  value: "Calves",
                  label: "Calves",
                },
                {
                  value: "Chest",
                  label: "Chest",
                },
                {
                  value: "Forearms",
                  label: "Forearms",
                },
              ]}
              name="type"
              value={formData.type}
              onChange={(value) =>
                handleInputChange({
                  target: {
                    name: "type",
                    value: value,
                  },
                })
              }
            />
          </div>
          {errors.type && <span className="error_email">{errors.type}</span>}

          <div className="video-link-attach">
            <div className="video-link">
              <label> Video link </label>
              <input
                type="text"
                placeholder="Video link"
                name="video"
                value={formData.video}
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
              Add exercise video
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Add_new_video;
