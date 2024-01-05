import React from "react";
import { Pagination, Space, Table } from "antd";
import { useState } from "react";
import { Delete, Edit_Icon, Eye, Msg } from "../../assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LibraryWorkoutTable = () => {
  const loader = useSelector((state) => state?.gernal?.loader);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Workout name",
      dataIndex: "Workout",
      key: "Workout",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Exercises",
      dataIndex: "Exercises",
      key: "Exercises",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            <img
              src={Eye}
              alt=""
              onClick={() => navigate(`/workout-details`)}
            />
            <img
              src={Edit_Icon}
              alt=""
              onClick={() => navigate(`/edit-workout`)}
            />
            <img src={Delete} alt="" />
          </div>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
    {
      key: "1",
      Workout: "Lorem ipsum dolor",
      Exercises: "Bench press, Chest stretch...",
      description: "Lorem ipsum dolor sit amet co...",
    },
  ];

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
        loading={loader}
      />

      <Pagination
        total={data.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default LibraryWorkoutTable;
