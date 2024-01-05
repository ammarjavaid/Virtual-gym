import { Modal, Pagination, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { setLoader } from "../../Redux/actions/GernalActions";
import { ApiCall } from "../../Services/Apis";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const SubParentFolderTable = ({
  data,
  deleteFolder,
  receivedData,
  getSubFolder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [imageToUpload, setImageToUpload] = useState(null);
  const { checkSubPermissions } = usePermissionCheck();
  const [formValues, setFormValues] = useState({
    folder_title: "",
    folder_description: "",
    folder_Image: "",
    videos: [],
  });

  console.log(data, "data");

  const { id } = useParams();
  // console.log(id);
  const pageSize = 7;
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const token = useSelector((state) => state.auth.userToken);
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

  // const handleImageUpload = (e) => {
  //   const imageFile = e.target.files[0];
  //   const name = e.target.name;

  //   if (imageFile) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setFormValues({
  //         ...formValues,
  //         [name]: imageFile, // Set the actual image file, not the data URL
  //       });
  //     };
  //     reader.readAsDataURL(imageFile);
  //     setImageToUpload(imageFile);
  //   }
  // };

  // const dataRecieve = receivedData?.child_folder?.map((el) => el?._id);
  // console.log(selectedValues?._id, "selectedValues");

  const handleEditSubmit = async () => {
    const formDataToSend = new FormData();

    // Append the form data fields
    formDataToSend.append("folder_title", formValues.folder_title);
    formDataToSend.append("folder_description", formValues.folder_description);
    formDataToSend.append("folder_Image", formValues.folder_Image);

    formDataToSend.append("childId", selectedValues?._id);
    formDataToSend.append("videos", JSON.stringify(formValues.videos));

    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: formDataToSend,
        route: `skillvideo/edit_child/${id}`,
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        // console.log(res?.response);
        message.success(res?.response?.message);
        setIsEditModalOpen(false);
        getSubFolder();
        dispatch(setLoader(false));
        // console.log(res?.response);
      } else {
        console.log(res?.response);
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  const getSingleSubFolder = async () => {
    try {
      dispatch(setLoader(true));
      const dataToSend = { childId: selectedValues?._id };
      const res = await ApiCall({
        params: dataToSend,
        route: `skillVideo/detail_child/${id}`,
        verb: "post",
        token: token,
      });
      // console.log(res?.response?child_folder);
      if (res?.status == 200) {
        // console.log(res?.response?.child_folder?.videos);
        dispatch(setLoader(false));
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          folder_title: res?.response?.child_folder?.folder_title,
          folder_description: res?.response?.child_folder?.folder_description,
          folder_Image: res?.response?.child_folder?.folder_Image || null,
          videos: res?.response?.child_folder?.videos || null,
        }));
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
    if (selectedValues?._id) {
      getSingleSubFolder();
    }
  }, [selectedValues]);

  // console.log(receivedData?._id, "receivedData");
  // console.log(data, "data");

  const columns = [
    {
      title: "Folder Image",
      dataIndex: "folder_Image",
      key: "folder_Image",
      render: (item) => (
        <div style={{ width: "50px" }}>
          <img src={item} alt="" style={{ width: "100%" }} />
        </div>
      ),
    },
    {
      title: "Folder title",
      dataIndex: "folder_title",
      key: "folder_title",
    },
    {
      title: "Folder Description",
      dataIndex: "folder_description",
      key: "folder_description",
    },
    {
      title: "No. of Videos",
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
            {checkSubPermissions("skills-training", "viewSubFolder")?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(
                    `/skills-training/sub-folders/all-videos/${id}/videos/${record?._id}`,
                    {
                      state: record,
                    }
                  )
                }
              />
            ) : null}

            {checkSubPermissions("skills-training", "editSubFolder")?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() => {
                  setSelectedValues(record);
                  setIsEditModalOpen(true);
                }}
              />
            ) : null}

            {checkSubPermissions("skills-training", "deleteSubFolder")
              ?.status ? (
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

  // const MyData = [
  //   {
  //     key: "1",
  //     title: "Title",
  //     description: "description",
  //   },
  // ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = data.slice(startIndex, endIndex);

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
                placeholder="Folder description"
                onChange={handleInputChange}
                value={formValues?.folder_description}
              />
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

            <div className="buttons">
              <p className="cancel" onClick={handleCancelEdit}>
                Cancel
              </p>
              <p className="add-category" onClick={handleEditSubmit}>
                Update Sub-Folder
              </p>
            </div>
          </form>
        </div>
      </Modal>

      <Pagination
        total={data.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default SubParentFolderTable;
