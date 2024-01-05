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

const ParticipantsTable = ({ hideActions }) => {
  const [allClients, setAllClients] = useState([]);

  const token = useSelector((state) => state.auth.userToken);
  const loader = useSelector((state) => state?.gernal?.loader);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getAllClients();
  }, []);

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
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: "",
        route: `admin/update_status_by_userId/${id}&${checked} `,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        getAllClients();
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
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
                    `/client/client-details/${record?.user_id}?tab=PersonalInfo`
                  )
                }
              />
              {!hideActions && (
                <Switch
                  size="small"
                  defaultChecked={record?.status}
                  checked={record?.status}
                  onChange={(checked) =>
                    updateClientStatus(checked, record?.user_id)
                  }
                />
              )}
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
  const dataToShow = allClients?.slice(startIndex, endIndex);

  // console.log(dataToShow);

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
        total={allClients?.length}
        defaultPageSize={pageSize}
        current={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default ParticipantsTable;
