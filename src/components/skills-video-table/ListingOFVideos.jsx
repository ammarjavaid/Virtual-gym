import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "../../../utils/usePermissionCheck";
import { setLoader } from "../../Redux/actions/GernalActions";

const ListingOFVideos = ({ folderDetail, viewFolder }) => {
  const [currentPage, setCurrentPage] = useState(1);
  //   const [selectedVideo, setSelectedVideo] = useState([]);
  const token = useSelector((state) => state.auth.userToken);
  const { checkSubPermissions } = usePermissionCheck();
  const { id, objId } = useParams();
  console.log(id, objId);

  console.log(folderDetail, "folderDetail");
  //   console.log(selectedVideo?._id, "selectedVideo_id");

  const location = useLocation();
  const receivedData = location.state;
  console.log(receivedData, "receivedData");

  const pageSize = 7;
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteFolder = async (video) => {
    // console.log(video);
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: { childId: objId, objId: video?._id },
        route: `skillVideo/delete_video/${id}`,
        verb: "put",
        token: token,
      });
      console.log(res);
      if (res?.status == 200) {
        console.log(res?.response);
        viewFolder();
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

  console.log(folderDetail, "folderDetail");

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Video",
      dataIndex: "video_thumbnail",
      key: "video_thumbnail",
      render: (item) => (
        <div style={{ width: "150px", height: "120px" }}>
          <img src={item} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("skills-training", "viewVideos")?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(`./child/${record?._id}`, {
                    state: receivedData,
                    record,
                  })
                }
              />
            ) : null}

            {checkSubPermissions("skills-training", "editVideos")?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() =>
                  navigate(
                    // `/skills-training/sub-folders/all-videos/edit-video/${record?._id}`
                    `./edit-video/${record?._id}`,
                    { state: receivedData, record }
                    //   `/all-category-skill-videos/skills-training/edit-video/${record._id}`
                    //   `./edit-my-video/${record?._id}`
                  )
                }
              />
            ) : null}

            {checkSubPermissions("skills-training", "deleteVideos")?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => {
                  // setSelectedVideo(record);
                  deleteFolder(record);
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
  const dataToShow = folderDetail?.slice(startIndex, endIndex);

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

export default ListingOFVideos;
