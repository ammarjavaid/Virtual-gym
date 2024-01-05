import React, { useEffect, useState } from "react";
import "./allCategorySkillVideo.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import { Modal, message } from "antd";
import AllCategorySkillVideoTable from "../../../components/skills-video-table/AllCategorySkillVideoTable";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import { setLoader } from "../../../Redux/actions/GernalActions";

const AllCategorySkillVideo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({ title: "" });
  const [allVideos, setAllVideos] = useState([]);
  const [formValues, setFormValues] = useState({
    folder_title: "",
    folder_description: "",
  });
  const { id } = useParams();
  const { checkSubPermissions } = usePermissionCheck();
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setErrors({ ...errors, [name]: "" });
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getAllFolders = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "skillvideo/all_skill_videos",
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        setAllVideos(res?.response?.video_list);
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

  useEffect(() => {
    getAllFolders();
  }, []);

  const handleSubmit = async () => {
    // validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(setLoader(true));
        const res = await ApiCall({
          params: formValues,
          route: "skillvideo/add_skill_folder",
          verb: "post",
          token: token,
        });
        if (res?.status == 200) {
          console.log(res?.response);
          message.success(res?.response?.message);
          getAllFolders();
          setIsModalOpen(false);
          setFormValues({
            folder_title: "",
            folder_description: "",
          });
          dispatch(setLoader(false));
        } else {
          message.destroy(res?.response?.message);
          //   console.log(res?.response);
          dispatch(setLoader(false));
        }
      } catch (error) {
        console.log(error);
        dispatch(setLoader(false));
      }
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  const deleteFolder = async (id) => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `skillvideo/delete_Skill/${id}`,
        verb: "delete",
        token: token,
      });
      if (res?.status == 200) {
        message?.success(res?.response?.message);
        setAllVideos((prevVideos) => {
          return prevVideos.filter((video) => video._id !== id);
        });
        getAllFolders();
        dispatch(setLoader(false));
      } else {
        message?.destroy(res?.response?.message, "else");
        console.log(res?.response);
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.folder_title) {
      errors.folder_title = "Folder title is required";
    }
    if (!formValues.folder_description) {
      errors.folder_description = "Description is required";
    }
    return errors;
  };

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = allVideos.filter((user) =>
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  return (
    <>
      <Topbar title="Skills Training" />
      <div className="video-head">
        <div className="video-head-left">
          {/* for desktop  */}

          <div className="input">
            <img src={Search} alt="" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleChange}
            />
          </div>

          {/* for mobile  */}
        </div>
        {checkSubPermissions("skills-training", "addFolder")?.status ? (
          <div className="video-head-right">
            <button
              className="add-client"
              // onClick={() => navigate("/gallery-videos/add-new-video")}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Add Folder
            </button>
          </div>
        ) : null}
      </div>

      <div className="video-gallery-table">
        <AllCategorySkillVideoTable
          deleteFolder={deleteFolder}
          allVideos={filterData}
          getAllFolders={getAllFolders}
        />
      </div>

      <Modal
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="modal">
          <h2> Create Folder </h2>
          <form className="create-workout-form">
            <div className="input-group">
              <label> Folder title </label>
              <input
                type="text"
                name="folder_title"
                placeholder="Folder title"
                onChange={handleInputChange}
                value={formValues?.folder_title}
              />
              {errors.folder_title && (
                <span className="error_email">{errors.folder_title}</span>
              )}
            </div>

            <div className="input-group">
              <label> Folder description </label>
              <textarea
                type="text"
                name="folder_description"
                placeholder="Program description"
                onChange={handleInputChange}
                value={formValues?.folder_description}
              />
              {errors.folder_description && (
                <span className="error_email">{errors.folder_description}</span>
              )}
            </div>

            <div className="buttons">
              <p className="cancel" onClick={handleCancel}>
                Cancel
              </p>
              <p className="add-category" type="submit" onClick={handleSubmit}>
                Create Folder
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AllCategorySkillVideo;
