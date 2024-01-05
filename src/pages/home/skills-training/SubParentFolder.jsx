import React, { useState, useEffect } from "react";
import SubParentFolderTable from "../../../components/skills-video-table/SubParentFolderTable";
import Topbar from "../../../components/topbar/Topbar";
import { Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { Search } from "../../../assets";
import { useLocation, useParams } from "react-router-dom";
import { setLoader } from "../../../Redux/actions/GernalActions";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const SubParentFolder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({ title: "" });
  const [imageToUpload, setImageToUpload] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [formValues, setFormValues] = useState({
    folder_title: "",
    folder_description: "",
    folder_Image: "",
  });

  const { id, childId } = useParams();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const { checkSubPermissions } = usePermissionCheck();

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const location = useLocation();
  const receivedData = location.state;

  console.log(receivedData, "receivedData");

  const dataRecieve = receivedData?.child_folder?.map((el) => {
    return el?._id;
  });
  const dataRecievefOReACH = receivedData?.child_folder?.forEach(
    (el) => el?._id
  );

  console.log(dataRecieve, "dataRecieve");
  console.log(dataRecievefOReACH, "dataRecievefOReACH");

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
    console.log(imageFile, "imageFile");
  };

  console.log(imageToUpload, "imageToUpload");

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setErrors({ ...errors, [name]: "" });
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const getSubFolder = async () => {
    try {
      dispatch(setLoader(true));
      const dataToSend = { childId: dataRecieve };
      const res = await ApiCall({
        params: dataToSend,
        route: `skillVideo/detail_skill_video/${id}`,
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        console.log(res?.response);
        setAllVideos(res?.response?.parent_folder?.child_folder?.reverse());
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

        formData.append("folder_title", formValues?.folder_title);
        formData.append("folder_description", formValues?.folder_description);
        formData.append("folder_Image", imageToUpload);

        formData.append("id", id);

        const res = await ApiCall({
          params: formData,
          route: `skillVideo/add_skill_folder`,
          verb: "post",
          token: token,
        });
        if (res?.status == 200) {
          console.log(res?.response);
          message.success(res?.response?.message);
          setIsModalOpen(false);
          getSubFolder();
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

  const deleteFolder = async (childId) => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: { childId: childId },
        route: `skillVideo/delete_child/${id}`,
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        console.log(res?.response);
        message?.success(res?.response?.message);
        setAllVideos((prevVideos) => {
          return prevVideos.filter((video) => video._id !== id);
        });
        getSubFolder();
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
    getSubFolder();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formValues.folder_title) {
      errors.folder_title = "Folder title is required";
    }
    if (!formValues.folder_description) {
      errors.folder_description = "Description is required";
    }
    if (!formValues.folder_Image) {
      errors.folder_Image = "Image is required";
    }
    return errors;
  };

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  console.log(allVideos, "allVideos");

  const filterData = allVideos.filter((user) =>
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  return (
    <>
      <Topbar title="Skills Training Sub Folders" arrow={true} />
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

        {checkSubPermissions("skills-training", "addSubFolder")?.status ? (
          <div className="video-head-right">
            <button
              className="add-client"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Add Sub-Folder
            </button>
          </div>
        ) : null}
      </div>

      <div className="video-gallery-table">
        <SubParentFolderTable
          data={filterData}
          deleteFolder={deleteFolder}
          receivedData={receivedData}
          getSubFolder={getSubFolder}
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
                placeholder="Folder description"
                onChange={handleInputChange}
                value={formValues?.folder_description}
              />
              {errors.folder_description && (
                <span className="error_email">{errors.folder_description}</span>
              )}
            </div>

            <div className="single-image-upload-item">
              {!formValues?.folder_Image ? (
                <label htmlFor="folder_Image" className={`id-placeholder-box`}>
                  Click to upload folder image
                </label>
              ) : (
                <div className="id-image-container">
                  <img src={formValues?.folder_Image} />
                  <label
                    htmlFor="folder_Image"
                    className="upload-icon-container"
                  >
                    ↥
                  </label>
                </div>
              )}
              <input
                id="folder_Image"
                className="image-input"
                name="folder_Image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            {errors?.folder_Image && !formValues?.folder_Image && (
              <span className="error_email" style={{ textAlign: "center" }}>
                {errors?.folder_Image}
              </span>
            )}

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

export default SubParentFolder;
