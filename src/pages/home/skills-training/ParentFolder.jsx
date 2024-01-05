import React, { useEffect, useState } from "react";
import { Search } from "../../../assets";
import Topbar from "../../../components/topbar/Topbar";
import ParentFolderTable from "../../../components/skills-video-table/ParentFolderTable";
import { Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const ParentFolder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState();
  const [imageToUpload, setImageToUpload] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [formValues, setFormValues] = useState({
    parent_title: "",
    parent_description: "",
    parent_Image: "",
  });

  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();
  const { checkSubPermissions } = usePermissionCheck();

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setErrors({ ...errors, [name]: "" });
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    const name = e.target.name;
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues({
          ...formValues,
          [name]: event.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
      setImageToUpload(imageFile);
    }
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

  const handleSubmit = async () => {
    // validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(setLoader(true));
        const formData = new FormData();

        formData.append("parent_title", formValues?.parent_title);
        formData.append("parent_description", formValues?.parent_description);
        formData.append("parent_Image", imageToUpload);

        const res = await ApiCall({
          params: formData,
          route: "skillVideo/add_parent_folder",
          verb: "post",
          token: token,
        });
        if (res?.status == 200) {
          //   console.log(res?.response);
          message.success(res?.response?.message);
          setIsModalOpen(false);
          getAllParentFolders();
          dispatch(setLoader(false));
          setFormValues({
            parent_title: "",
            parent_description: "",
          });
        } else {
          message.destroy(res?.response?.message);
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
        route: `skillVideo/delete_Skill/${id}`,
        verb: "delete",
        token: token,
      });
      if (res?.status == 200) {
        // console.log(res?.response);
        message?.success(res?.response?.message);
        // setAllVideos((prevVideos) => {
        //   return prevVideos.filter((video) => video._id !== id);
        // });
        getAllParentFolders();
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

  useEffect(() => {
    getAllParentFolders();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formValues.parent_title) {
      errors.parent_title = "Folder title is required";
    }
    if (!formValues.parent_description) {
      errors.parent_description = "Description is required";
    }
    if (!formValues.parent_Image) {
      errors.parent_Image = "Image is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = allVideos.filter((user) =>
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  //   console.log(allVideos, "allVideos");

  return (
    <>
      <Topbar title="Skills Training Folders" />
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
        <ParentFolderTable
          allVideos={filterData}
          deleteFolder={deleteFolder}
          getAllParentFolders={getAllParentFolders}
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
                name="parent_title"
                placeholder="Folder title"
                onChange={handleInputChange}
                value={formValues?.parent_title}
              />
              {errors?.parent_title && (
                <span className="error_email">{errors?.parent_title}</span>
              )}
            </div>

            <div className="input-group">
              <label> Folder description </label>
              <textarea
                type="text"
                name="parent_description"
                placeholder="Folder description"
                onChange={handleInputChange}
                value={formValues?.parent_description}
              />
              {errors?.parent_description && (
                <span className="error_email">
                  {errors?.parent_description}
                </span>
              )}
            </div>

            <div className="single-image-upload-item">
              {!formValues?.parent_Image ? (
                <label htmlFor="parent_Image" className={`id-placeholder-box`}>
                  Click to upload folder image
                </label>
              ) : (
                <div className="id-image-container">
                  <img src={formValues?.parent_Image} />
                  <label
                    htmlFor="parent_Image"
                    className="upload-icon-container"
                  >
                    ↥
                  </label>
                </div>
              )}
              <input
                id="parent_Image"
                className="image-input"
                name="parent_Image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            {errors?.parent_Image && !formValues?.parent_Image && (
              <span className="error_email" style={{ textAlign: "center" }}>
                {errors?.parent_Image}
              </span>
            )}

            <div className="buttons">
              <p className="cancel" onClick={handleCancel}>
                Cancel
              </p>
              <p className="add-category" type="submit" onClick={handleSubmit}>
                Create Parent Folder
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ParentFolder;
