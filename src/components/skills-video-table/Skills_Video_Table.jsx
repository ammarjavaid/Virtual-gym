import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { ApiCall } from "../../Services/Apis";
import { useSelector } from "react-redux";

const Skills_Video_Table = ({ skillvideo, deletePermanently }) => {
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
    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   key: "category",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            <img
              src={Eye}
              alt=""
              onClick={() =>
                naviagte(
                  `/all-category-skill-videos/skills-training/skill-video-detail/${record._id}`
                )
              }
            />
            <img
              src={Edit_Icon}
              alt=""
              onClick={() =>
                naviagte(
                  `/all-category-skill-videos/skills-training/edit-video/${record._id}`
                )
              }
            />
            <img
              src={Delete}
              alt=""
              onClick={() => deletePermanently(record._id)}
            />
          </div>
        </Space>
      ),
    },
  ];

  // const myData = [
  //   {
  //     key: "1",
  //     title: "Mike",
  //     description: "example@gmail.com",
  //     category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     title: "Mike",
  //     description: "example@gmail.com",
  //     category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     title: "Mike",
  //     description: "example@gmail.com",
  //     category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     title: "Mike",
  //     description: "example@gmail.com",
  //     category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     title: "Mike",
  //     description: "example@gmail.com",
  //     category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  // ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = skillvideo?.slice(startIndex, endIndex);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataToShow}
        className="antd-table"
        scroll={{ x: true }}
      />

      <Pagination
        total={skillvideo?.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default Skills_Video_Table;
