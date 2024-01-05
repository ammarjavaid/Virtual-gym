import { Pagination, Space, Table } from "antd";
import React, { useState } from "react";
import { Delete, Eye } from "../../assets";
import { useNavigate } from "react-router";
import usePermissionCheck from "../../../utils/usePermissionCheck";

const Contact_Request_table = ({ allContactListData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const { checkSubPermissions } = usePermissionCheck();

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const naviagte = useNavigate();

  const columns = [
    {
      title: "Full name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div className="action-type">
            {checkSubPermissions("contact-request", "viewRequest")?.status ? (
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  naviagte(
                    `/contact-request/contact-request-details/${record._id}`
                  )
                }
              />
            ) : null}
          </div>
        </Space>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = allContactListData.slice(startIndex, endIndex);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataToShow}
        className="antd-table"
        scroll={{ x: true }}
      />

      <Pagination
        total={allContactListData.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default Contact_Request_table;
