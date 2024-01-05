import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { Delete, Edit_Icon, Eye, Msg } from "../../assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const ExerciseTable = ({ data, deletePermanently }) => {
  const navigate = useNavigate();
  const { checkSubPermissions } = usePermissionCheck();

  // const loader = useSelector((state) => state?.gernal?.loader);
  const editExercises = checkSubPermissions("library", "editExercises");
  const viewExercises = checkSubPermissions("library", "viewExercises");
  const deleteExercises = checkSubPermissions("library", "deleteExercises");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Exercise name",
      dataIndex: "exercise_name",
      key: "exercise_name",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   key: "category",
    // },
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {viewExercises?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(`/library/exercise-details/${record?._id}`)
                }
              />
            ) : null}

            {editExercises?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() =>
                  navigate(`/library/edit-exercise/${record?._id}`)
                }
              />
            ) : null}
            {deleteExercises?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => deletePermanently(record._id)}
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
        // loading={loader}
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

export default ExerciseTable;
