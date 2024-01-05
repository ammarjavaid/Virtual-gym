import React, { useEffect, useState } from "react";
import "./allCategoryVideos.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import AllCategoryVideosTable from "../../../components/video-gallery-table/AllCategoryVideosTable";
import { Modal, Select, message } from "antd";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import { setLoader } from "../../../Redux/actions/GernalActions";

const AllCategoryVideos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allFolders, setAllFolders] = useState([]);
  const [errors, setErrors] = useState({ title: "" });
  const [formValues, setFormValues] = useState({
    folder_title: "",
    folder_description: "",
  });
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

  //   for edit
  const handleOkEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const getAllFolders = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "exercisevideo/all_exercise_videos",
        verb: "get",
        token: token,
      });
      // console.log(res);
      if (res?.status == 200) {
        setAllFolders(res?.response?.video_list);
        dispatch(setLoader(false));
        // message.success(res?.response?.message);
        // setIsModalOpen(false);
      } else {
        // message.destroy(res?.response?.message);
        dispatch(setLoader(false));
        //   console.log(res?.response);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFolders();
  }, []);

  const handleSubmit = async () => {
    // validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      console.log("res");
      try {
        dispatch(setLoader(true));
        const res = await ApiCall({
          params: formValues,
          route: "exercisevideo/add_exercise_folder",
          verb: "post",
          token: token,
        });
        console.log(res);
        if (res?.status == 200) {
          dispatch(setLoader(false));
          console.log(res?.response);
          message.success(res?.response?.message);
          getAllFolders();
          setIsModalOpen(false);
        } else {
          dispatch(setLoader(false));
          message.destroy(res?.response?.message);
          //   console.log(res?.response);
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
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
        route: `exercisevideo/delete_exercise_video/${id}`,
        verb: "delete",
        token: token,
      });
      if (res?.status == 200) {
        dispatch(setLoader(false));
        message?.success(res?.response?.message);
        getAllFolders();
      } else {
        dispatch(setLoader(false));
        message?.destroy(res?.response?.message, "else");
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  // console.log(allFolders, "allFolders");

  // validation

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

  const filterData = allFolders?.filter((user) =>
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  return (
    <>
      <Topbar title="Exercise Videos" />
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
        {checkSubPermissions("gallery-videos", "addFolder")?.status ? (
          <div className="video-head-right">
            <button
              className="add-client"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Add category Videos
            </button>
          </div>
        ) : null}
      </div>

      <div className="video-gallery-table">
        <AllCategoryVideosTable
          setIsEditModalOpen={setIsEditModalOpen}
          allFolders={filterData}
          deleteFolder={deleteFolder}
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
              <p className="add-category" onClick={handleSubmit}>
                Create Folder
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AllCategoryVideos;
