import React, { useState } from "react";
import { Delete, Edit_Icon, Eye } from "../../assets";
import { Pagination, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const AddNewCoachTable = ({ allAdmin, deletePermanently }) => {
  const navigate = useNavigate();
  const { checkSubPermissions } = usePermissionCheck();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Team member",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Role",
      dataIndex: "permissionRole",
      key: "permissionRole",
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "password",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions(
              "coaches-team-member",
              "viewCoachesAndTeamMembers"
            )?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(
                    `/coaches-team-member/member-details/${record.user_id}`
                  )
                }
              />
            ) : null}{" "}
            {checkSubPermissions(
              "coaches-team-member",
              "editCoachesAndTeamMembers"
            )?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() =>
                  navigate(`/coaches-team-member/member-edit/${record.user_id}`)
                }
              />
            ) : null}{" "}
            {checkSubPermissions(
              "coaches-team-member",
              "deleteCoachesAndTeamMembers"
            )?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => deletePermanently(record.user_id)}
              />
            ) : null}
          </div>
        </Space>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = allAdmin.slice(startIndex, endIndex);

  return (
    <>
      <Table columns={columns} dataSource={dataToShow} />
      <Pagination
        total={allAdmin.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default AddNewCoachTable;
