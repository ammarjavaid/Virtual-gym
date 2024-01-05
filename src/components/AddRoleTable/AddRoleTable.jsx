import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Delete, Edit_Icon, Eye } from "../../assets";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const AddRoleTable = ({ allRoles, deletePermanently }) => {
  const navigate = useNavigate();
  const { checkSubPermissions } = usePermissionCheck();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "Permissions",
    //   dataIndex: "Permissions",
    //   key: "Permissions",
    // },
    {
      title: "Description / Details",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("role-permission", "viewRoleAndPermissions")
              ?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(`/role-permission/role-details/${record?._id}`)
                }
              />
            ) : null}{" "}
            {checkSubPermissions("role-permission", "editRoleAndPermissions")
              ?.status ? (
              <img
                src={Edit_Icon}
                alt=""
                onClick={() =>
                  navigate(`/role-permission/edit-role/${record?._id}`)
                }
              />
            ) : null}{" "}
            {checkSubPermissions("role-permission", "deleteRoleAndPermissions")
              ?.status ? (
              <img
                src={Delete}
                alt=""
                onClick={() => deletePermanently(record?._id)}
              />
            ) : null}{" "}
          </div>
        </Space>
      ),
    },
  ];
  // const data = [
  //   {
  //     key: "1",
  //     role_name: "Subadmin",
  //     Permissions: "Lorem, Ipsum",
  //     Description_Details:
  //       "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     role_name: "Subadmin",
  //     Permissions: "Lorem, Ipsum",
  //     Description_Details:
  //       "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     role_name: "Subadmin",
  //     Permissions: "Lorem, Ipsum",
  //     Description_Details:
  //       "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     role_name: "Subadmin",
  //     Permissions: "Lorem, Ipsum",
  //     Description_Details:
  //       "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     role_name: "Subadmin",
  //     Permissions: "Lorem, Ipsum",
  //     Description_Details:
  //       "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  //   {
  //     key: "1",
  //     role_name: "Subadmin",
  //     Permissions: "Lorem, Ipsum",
  //     Description_Details:
  //       "Lorem ipsum dolor sit amet consteur amet dilger am...",
  //   },
  // ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = allRoles.slice(startIndex, endIndex);

  return (
    <>
      <Table columns={columns} dataSource={dataToShow} />
      <Pagination
        total={allRoles.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default AddRoleTable;
