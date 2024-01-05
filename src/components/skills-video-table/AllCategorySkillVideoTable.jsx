import { Modal, Pagination, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "../../../utils/usePermissionCheck";
import { setLoader } from "../../Redux/actions/GernalActions";

const AllCategorySkillVideoTable = ({
  deleteFolder,
  allVideos,
  editFolder,
  //   setIsEditModalOpen,
  getAllFolders,
}) => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  //   const [allVideos, setAllVideos] = useState([]);
  const [formValues, setFormValues] = useState({
    folder_title: "",
    folder_description: "",
  });
  const [folderDetail, setFolderDetail] = useState();
  const { checkSubPermissions } = usePermissionCheck();
  const dispatch = useDispatch();

  //   console.log(selectedValues, "selectedValues");
  //   console.log(formValues, "selectedValues");
  const pageSize = 7;
  // const { checkSubPermissions } = usePermissionCheck();
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const naviagte = useNavigate();
  const token = useSelector((state) => state.auth.userToken);

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
        route: `skillvideo/edit_video/${selectedValues?._id}`,
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        message.success(res?.response?.message);
        getAllFolders();
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

  const viewFolder = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: `skillVideo/detail_skill_video/${selectedValues?._id}`,
        verb: "get",
        token: token,
      });
      console.log(res);
      if (res?.status == 200) {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          folder_title: res?.response?.video?.folder_title,
          folder_description: res?.response?.video?.folder_description,
        }));
      } else {
        console.log(res?.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedValues?._id) {
      viewFolder();
    }
  }, [selectedValues]);

  //   console.log(selectedValues, "selectedValues");
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
      render: (text) => (
        <div
          style={{
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: '"Ubuntu", sans-serif',
          }}
        >
          {text}
        </div>
      ),
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
            {/* {checkSubPermissions("skills-training", "viewFolder")?.status ? ( */}
            <img
              src={Eye}
              alt=""
              // onClick={() =>
              //   naviagte(
              //     `/skills-training/single-category-page/${record?._id}`
              //   )
              // }
            />
            {/* ) : null} */}

            {/* {checkSubPermissions("skills-training", "editFolder")?.status ? ( */}
            <img
              src={Edit_Icon}
              alt=""
              // onClick={() => {
              //   setSelectedValues(record);
              //   setIsEditModalOpen(true);
              // }}
            />
            {/* ) : null} */}

            {/* {checkSubPermissions("skills-training", "deleteFolder")?.status ? ( */}
            <img
              src={Delete}
              alt=""
              // onClick={() => deleteFolder(record?._id)}
            />
            {/* ) : null} */}
          </div>
        </Space>
      ),
    },
  ];

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
        total={allVideos.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default AllCategorySkillVideoTable;
