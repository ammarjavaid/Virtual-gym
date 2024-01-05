import React, { useEffect, useState } from "react";
import "./add_new_video.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, message } from "antd";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useDispatch, useSelector } from "react-redux";
import { Clipper } from "../../../assets";

const Edit_Video = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, ObjId } = useParams();
  // console.log(ObjId, id);

  const token = useSelector((state) => state.auth.userToken);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: "",
    type: "",
  });

  const [errors, setErrors] = useState({ title: "" });

  const handleInputChange = (e) => {
    // console.log(e, "haldeselect");
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = async (e) => {
  //   // console.log("working");
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

  //   // console.log("53");

  //   // validation
  //   const validationErrors = validateForm();
  //   console.log("validationErrors", validationErrors);
  //   if (Object.keys(validationErrors).length === 0) {
  //     // console.log("58");
  //     try {
  //       dispatch(setLoader(true));

  //       const res = await ApiCall({
  //         params: formDataToSend,
  //         route: `exercisevideo/edit_exercise_video/${id}`,
  //         verb: "put",
  //         token: token,
  //       });

  //       console.log(res, "res");

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

  //     // console.log("Form submitted:", formData);
  //   } else {
  //     setErrors(validationErrors);
  //     return;
  //   }
  // };

  // validation

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
    console.log("validationErrors", validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(setLoader(true));

        const res = await ApiCall({
          params: formDataToSend,
          route: `exercisevideo/edit_exercise_video/${id}`,
          verb: "put",
          token: token,
        });

        console.log(res, "res");
        if (res?.status == "200") {
          console.log(res?.response, "res");
          dispatch(setLoader(false));
          // naviagte(
          //   `/all-category-skill-videos/skills-training/single-category-page/${id}`
          // );
          navigate(`/gallery-videos`);
          message.success(res.response?.message);
        } else {
          message.error(res.response?.message);
          dispatch(setLoader(false));
        }
      } catch (e) {
        console.log("error", e);
        // message.error(res.response?.message);
        dispatch(setLoader(false));
      }

      console.log("Form submitted:");
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) {
      errors.title = "Video Title is required";
    }
    if (!formData.description) {
      errors.description = "Video Description is required";
    }
    if (!formData.video && !selectedFile) {
      errors.video = "Video Link is required";
    }
    return errors;
  };

  const getSingleVideo = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `exercisevideo/detail_exercise_video/${id}`,
        verb: "get",
        token: token,
      });

      console.log(res);
      if (res?.status == "200") {
        dispatch(setLoader(false));
        // const video = res?.response?.video;
        // console.log(res?.response?.parent_folder);
        setFormData({
          title: res?.response?.parent_folder?.title,
          description: res?.response?.parent_folder?.description,
          video: res?.response?.parent_folder?.video_thumbnail,
          type: res?.response?.parent_folder?.type,
        });
        // console.log(formData);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };

  useEffect(() => {
    if (id) {
      getSingleVideo();
    }
  }, [id]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <>
      <Topbar
        title="Edit exercise video"
        arrow={true}
        titleOne="Exercise videos"
        titleTwo="Edit exercise video"
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
          {errors.video && (
            <span className="error_email">{errors.description}</span>
          )}

          <div className="select_category">
            <Select
              defaultValue="Choose category"
              style={{
                width: 120,
              }}
              // multiple={true}
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

          {/* <div className="input-group">
            <Select
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "skill",
                  label: "Skill",
                },
                {
                  value: "exercise",
                  label: "Exercise",
                },
              ]}
              name="category"
              value={formData.category}
              onChange={(value) =>
                handleInputChange({
                  target: {
                    name: "category",
                    value: value,
                  },
                })
              }
            />
            {errors.category && (
              <span className="error_email">{errors.category}</span>
            )}
          </div> */}

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

export default Edit_Video;
