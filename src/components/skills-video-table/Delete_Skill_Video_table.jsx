import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Delete_Skill_Video_table = () => {
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
            <p className="deleted">Delete permanently</p>
            <p className="restore">Restore</p>
          </div>
        </Space>
      ),
    },
  ];

  const myDelData = [
    {
      key: "1",
      title: "Mike",
      description: "example@gmail.com",
      category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
    },
    {
      key: "1",
      title: "Mike",
      description: "example@gmail.com",
      category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
    },
    {
      key: "1",
      title: "Mike",
      description: "example@gmail.com",
      category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
    },
    {
      key: "1",
      title: "Mike",
      description: "example@gmail.com",
      category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
    },
    {
      key: "1",
      title: "Mike",
      description: "example@gmail.com",
      category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
    },
    {
      key: "1",
      title: "Mike",
      description: "example@gmail.com",
      category: "Lorem ipsum dolor sit amet consteur amet dilger am...",
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = myDelData.slice(startIndex, endIndex);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataToShow}
        className="antd-table"
        scroll={{ x: true }}
      />

      <Pagination
        total={myDelData.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default Delete_Skill_Video_table;
