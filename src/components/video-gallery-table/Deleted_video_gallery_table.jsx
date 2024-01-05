import React, { useState } from "react";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { Pagination, Space, Table } from "antd";
import { useNavigate } from "react-router";

const Deleted_video_gallery_table = ({
  allGalleryVideos,
  deletePermanently,
  updateVideosGalleryStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const naviagte = useNavigate();

  const columns = [
    {
      title: "Video title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description / Details",
      dataIndex: "description",
      key: "description",
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
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            <p
              className="deleted"
              onClick={() => deletePermanently(record._id)}
            >
              Delete permanently
            </p>
            <p
              className="restore"
              onClick={() => updateVideosGalleryStatus(record._id, false)}
            >
              Restore
            </p>
          </div>
        </Space>
      ),
    },
  ];

  //   const dataSource = [
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //     {
  //       key: "1",
  //       Video_title: "Mike",
  //       Description_Details: "example@gmail.com",
  //       Category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //     },
  //   ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = allGalleryVideos.slice(startIndex, endIndex);
  return (
    <>
      <Table
        columns={columns}
        dataSource={dataToShow}
        className="antd-table"
        scroll={{ x: true }}
      />

      <Pagination
        total={allGalleryVideos.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default Deleted_video_gallery_table;
