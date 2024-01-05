import { Modal, Pagination, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "../../../utils/usePermissionCheck";
import { setLoader } from "../../Redux/actions/GernalActions";

const AllCategoryVideosTable = ({
  // setIsEditModalOpen,
  allFolders,
  deleteFolder,
  getAllFolders,
}) => {
  const token = useSelector((state) => state.auth.userToken);
  const { id } = useParams();
  const [selectedFolder, setSelectedFolder] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    folder_title: "",
    folder_description: "",
  });
  const pageSize = 7;
  const { checkSubPermissions } = usePermissionCheck();
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  console.log(selectedValues, "selectedValues");

  const naviagte = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOkEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    const formDataToSend = new FormData();

    // Append the form data fields
    formDataToSend.append("folder_title", formValues.folder_title);
    formDataToSend.append("folder_description", formValues.folder_description);

    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: formDataToSend,
        route: `exercisevideo/edit_exercise/${selectedValues?._id}`,
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        dispatch(setLoader(false));
        message.success(res?.response?.message);
        // setIsEditModalOpen(false);
        getAllFolders();
        setIsEditModalOpen(false);
        // console.log(res?.response);
      } else {
        dispatch(setLoader(false));
        console.log(res?.response);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const viewFolder = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `exercisevideo/detail_exercise_video/${selectedValues?._id}`,
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        dispatch(setLoader(false));
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          folder_title: res?.response?.folder?.folder_title,
          folder_description: res?.response?.folder?.folder_description,
        }));
      } else {
        dispatch(setLoader(false));
        console.log(res?.response);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedValues?._id) {
      viewFolder();
    }
  }, [selectedValues]);

  // console.log(selectedFolder, "selectedFolder");

  const columns = [
    {
      title: "Folder title",
      dataIndex: "folder_title",
      key: "folder_title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Folder Description",
      dataIndex: "folder_description",
      key: "folder_description",
    },
    {
      title: "No. of videos",
      dataIndex: "videos",
      key: "videos",
      render: (data) => <div>{data?.length}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("gallery-videos", "viewFolder")?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  naviagte(`/gallery-videos/single-folder-page/${record?._id}`)
                }
              />
            ) : null}

            {checkSubPermissions("gallery-videos", "editFolder")?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() => {
                  setSelectedValues(record);
                  setIsEditModalOpen(true);
                }}
              />
            ) : null}

            {checkSubPermissions("gallery-videos", "deleteFolder")?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => {
                  setSelectedFolder(record);
                  deleteFolder(record?._id);
                }}
              />
            ) : null}
          </div>
        </Space>
      ),
    },
  ];

  console.log(allFolders, "allFolders");

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = allFolders?.slice(startIndex, endIndex);

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
                name="folder_title"
                placeholder="Folder title"
                onChange={handleInputChange}
                value={formValues?.folder_title}
              />
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
        total={allFolders?.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default AllCategoryVideosTable;
