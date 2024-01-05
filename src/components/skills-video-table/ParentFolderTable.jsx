import React, { useEffect, useState } from "react";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { Modal, Pagination, Space, Table, message } from "antd";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../Redux/actions/GernalActions";
import { useNavigate } from "react-router-dom";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const ParentFolderTable = ({
  allVideos,
  deleteFolder,
  getAllParentFolders,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [formValues, setFormValues] = useState({
    parent_title: "",
    parent_description: "",
    parent_Image: "",
    child_folder: [],
  });

  const pageSize = 7;
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const token = useSelector((state) => state.auth.userToken);
  const { checkSubPermissions } = usePermissionCheck();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOkEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const imageFile = formValues.parent_Image;
  console.log(imageFile, "imageFile");
  const handleImageUpload = (e) => {
    console.log(e, "e");
    const imageFile = e.target.files[0];
    console.log(imageFile, "imageFile");
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

  const handleEditSubmit = async () => {
    const formDataToSend = new FormData();

    // Append the form data fields
    formDataToSend.append("parent_title", formValues.parent_title);
    formDataToSend.append("parent_description", formValues.parent_description);
    formDataToSend.append("parent_Image", formValues.parent_Image);

    formDataToSend.append(
      "child_folder",
      JSON.stringify(formValues.child_folder)
    );

    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: formDataToSend,
        route: `skillvideo/edit_video/${selectedValues?._id}`,
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        console.log(res?.response);
        message.success(res?.response?.message);
        getAllParentFolders();
        setIsEditModalOpen(false);
        dispatch(setLoader(false));
        console.log(res?.response);
      } else {
        console.log(res?.response);
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  const viewParentFolder = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: `skillVideo/detail_skill_video/${selectedValues?._id}`,
        verb: "get",
        token: token,
      });
      console.log(res, "res");
      if (res?.status == 200) {
        console.log(res?.response);
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          parent_title: res?.response?.parent_folder?.parent_title,
          parent_description: res?.response?.parent_folder?.parent_description,
          parent_Image: res?.response?.parent_folder?.parent_Image,
          child_folder: res?.response?.parent_folder?.child_folder || [],
        }));
        handleImageUpload(res?.response?.parent_folder?.parent_Image);
      } else {
        console.log(res?.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedValues?._id) {
      viewParentFolder();
    }
  }, [selectedValues]);

  // const dataToSend = { key: allVideos };
  // console.log(allVideos, "allVideos");

  const columns = [
    {
      title: "Folder Image",
      dataIndex: "parent_Image",
      key: "parent_Image",
      render: (item) => (
        <div style={{ width: "30px", height: "30px" }}>
          <img src={item} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      ),
    },
    {
      title: "Folder title",
      dataIndex: "parent_title",
      key: "parent_title",
    },
    {
      title: "Folder Description",
      dataIndex: "parent_description",
      key: "parent_description",
    },
    {
      title: "No. of folders",
      dataIndex: "child_folder",
      key: "child_folder",
      render: (data) => <div>{data?.length}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("skills-training", "viewFolder")?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(`/skills-training/sub-folders/${record?._id}`, {
                    state: record,
                  })
                }
              />
            ) : null}

            {checkSubPermissions("skills-training", "editFolder")?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() => {
                  setSelectedValues(record);
                  setIsEditModalOpen(true);
                }}
              />
            ) : null}

            {checkSubPermissions("skills-training", "deleteFolder")?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => deleteFolder(record?._id)}
              />
            ) : null}
          </div>
        </Space>
      ),
    },
  ];

  // console.log(allVideos, "allVideos");

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = allVideos.slice(startIndex, endIndex);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataToShow}
        className="antd-table"
        scroll={{ x: true }}
      />

      <Modal
        centered
        open={isEditModalOpen}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
      >
        <div className="modal">
          <h2> Edit Folder </h2>
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

            <div className="buttons">
              <p className="cancel" onClick={handleCancelEdit}>
                Cancel
              </p>
              <p className="add-category" onClick={handleEditSubmit}>
                Update Folder
              </p>
            </div>
          </form>
        </div>
      </Modal>

      <Pagination
        total={allVideos.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default ParentFolderTable;
