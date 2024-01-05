import { Pagination, Space, Table, message } from "antd";
import React, { useState } from "react";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "../../../utils/usePermissionCheck";
import { setLoader } from "../../Redux/actions/GernalActions";

const ListingOfExerciseVideos = ({ folderDetail, viewFolderVideos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  //   const [selectedVideo, setSelectedVideo] = useState([]);
  const { checkSubPermissions } = usePermissionCheck();
  const token = useSelector((state) => state.auth.userToken);
  const { id } = useParams();
  const dispatch = useDispatch();

  const deleteExerciseVideo = async (id) => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `exercisevideo/delete_exercise_video/${id}`,
        verb: "delete",
        token: token,
      });
      console.log(res);
      if (res?.status == 200) {
        dispatch(setLoader(false));
        console.log(res?.response);
        message.success(res?.response?.message);
        viewFolderVideos();
      } else {
        dispatch(setLoader(false));
        console.log(res?.response);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const pageSize = 7;
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const handleDelete = (id) => {
    setSelectedVideo(record);
    deleteExerciseVideo(id);
  };
  console.log(folderDetail, "folderDetail");
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      //   render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("gallery-videos", "viewVideos")?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(`/gallery-videos/detail-video/${record?._id}`)
                }
              />
            ) : null}

            {checkSubPermissions("gallery-videos", "editVideos")?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() =>
                  navigate(`/gallery-videos/edit-video/${record?._id}`)
                }
              />
            ) : null}

            {checkSubPermissions("gallery-videos", "deleteVideos")?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => {
                  // setSelectedVideo(record);
                  deleteExerciseVideo(record?._id);
                }}
              />
            ) : null}
          </div>
        </Space>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = folderDetail.slice(startIndex, endIndex);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataToShow}
        className="antd-table"
        scroll={{ x: true }}
      />

      <Pagination
        total={folderDetail.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default ListingOfExerciseVideos;
