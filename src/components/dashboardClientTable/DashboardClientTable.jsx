import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  Empty,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import { Eye, Msg } from "../../assets";
import { useNavigate, useParams } from "react-router-dom";
import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../Services/Apis";
import { setLoader } from "../../Redux/actions/GernalActions";
const DashboardClientTable = ({ activeTab }) => {
  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth.userToken);
  const loader = useSelector((state) => state?.gernal?.loader);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllClients();
  }, []);

  useEffect(() => {
    if (activeTab) {
      if (activeTab === "active") {
        setFilteredClients(allClients.filter((el) => el.status === true));
      } else if (activeTab === "inactive") {
        setFilteredClients(allClients.filter((el) => el.status === false));
      } else if (activeTab === "all") {
        setFilteredClients(allClients);
      }
    }
  }, [activeTab]);

  const getAllClients = async () => {
    try {
      setIsLoading(true);
      const res = await ApiCall({
        params: "",
        route: `admin/all_clients`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setIsLoading(false);
        setAllClients(res.response?.clients);
        if (activeTab === "active") {
          setFilteredClients(
            res.response?.clients.filter((el) => el.status === true)
          );
        } else if (activeTab === "inactive") {
          setFilteredClients(
            res.response?.clients.filter((el) => el.status === false)
          );
        } else {
          setFilteredClients(res.response?.clients);
        }
        // setFilteredClients(res.response?.clients);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
    }
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
        // dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
    }
  };

  const columns = [
    {
      title: "Name",
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
      title: "Action",
      key: "action",
      render: (_, record) => {
        // console.log(record);
        return (
          <Space size="middle">
            <div className="action-type">
              <img
                src={Eye}
                alt=""
                onClick={() =>
                  navigate(
                    `/client/client-details/${record?.user_id}?tab=PersonalInfo`
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
          dataSource={filteredClients.slice(0, 5)}
          className="antd-table"
          scroll={{ x: true }}
          loading={isLoading}
          pagination={{ pageSize: 4 }}
        />
      </ConfigProvider>
    </>
  );
};

export default DashboardClientTable;
