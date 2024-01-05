import { ConfigProvider, Pagination, Space, Switch, Table } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, Msg } from "../../assets";
import { ApiCall } from "../../Services/Apis";

const AppMemberTable = ({ filteredClients, isLoading, getAllClients }) => {
  const token = useSelector((state) => state.auth.userToken);
  const loader = useSelector((state) => state?.gernal?.loader);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const updateClientStatus = async (checked, id) => {
    try {
      // dispatch(setLoader(true));

      const res = await ApiCall({
        params: "",
        route: `admin/update_status_by_userId/${id}&${checked} `,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        getAllClients();
      } else {
        console.log("error", res.response);
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "emailaddress",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <div className="action-type">
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(
                    `/app-members/member-details/${record?.user_id}?tab=PersonalInfo`
                  )
                }
              />
              <Switch
                size="small"
                defaultChecked={record?.status}
                checked={record?.status}
                onChange={(checked) =>
                  updateClientStatus(checked, record?.user_id)
                }
              />
              <img
                src={Msg}
                alt=""
                onClick={() =>
                  navigate(
                    `/client/client-details/${record?.user_id}?tab=Message`
                  )
                }
              />
            </div>
          </Space>
        );
      },
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = filteredClients?.slice(startIndex, endIndex);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f79300",
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={dataToShow}
          className="antd-table"
          scroll={{ x: true }}
          loading={isLoading}
        />
      </ConfigProvider>

      <Pagination
        total={filteredClients?.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default AppMemberTable;
