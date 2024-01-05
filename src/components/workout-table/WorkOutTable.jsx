import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Delete, Edit_Icon, Eye, Msg } from "../../assets";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const WorkOutTable = ({ data, deleteSingleProgram }) => {
  const navigate = useNavigate();
  const { checkSubPermissions } = usePermissionCheck();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Program title",
      dataIndex: "title",
      key: "title",
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
          <a>{text}</a>
        </div>
      ),
    },
    {
      title: "Description",
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
      title: "Program duration",
      dataIndex: "no_of_days",
      key: "no_of_days",
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
          {text} Days
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("workout-program", "viewWorkoutPrograms")
              ?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() => navigate(`/workout-program/${record?._id}`)}
              />
            ) : null}{" "}
            {checkSubPermissions("workout-program", "deleteWorkoutPrograms")
              ?.status ? (
              <img
                onClick={() => deleteSingleProgram(record?._id)}
                src={Delete}
                alt=""
              />
            ) : null}
          </div>
        </Space>
      ),
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

export default WorkOutTable;
