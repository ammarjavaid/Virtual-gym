import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../Redux/actions/GernalActions";
import Loader from "../../common/Loader/Loader";
import { ConfigProvider, Spin } from "antd";

const DashboardChart = () => {
  const [userActivity, setUserActivity] = useState([]);
  const token = useSelector((state) => state.auth.userToken);
  const loader = useSelector((state) => state?.gernal?.loader);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const dashboardClientsGraph = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: "admin/dashboard_progress",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setUserActivity(res?.response);
        setLoading(false);
      } else {
        console.log("error", res.response);
        message.error(res.response?.message);
      }
    } catch (e) {
      console.log("error -- ", e.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    dashboardClientsGraph();
  }, []);

  if (loading) {
    return (
      <>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#f79300",
            },
          }}
        >
          <div
            style={{ height: "300px", width: "60vw" }}
            className="spinnerContainer"
          >
            <Spin size="medium" />
          </div>
        </ConfigProvider>
      </>
    );
  }

  if (!Array.isArray(userActivity?.progressData)) {
    return null;
  }

  const data = userActivity?.progressData.map((item) => ({
    name: item?.day?.substring(0, 3),
    Activity: item?.progressPercentage,
  }));

  return (
    <>
      <div className="dashboard-charts">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 35, right: 30, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{
                fill: "white",
                fontSize: "10px",
                fontFamily: '"Ubuntu", sans-serif',
              }}
            />
            <YAxis
              tick={{
                fill: "white",
                fontSize: "10px",
                fontFamily: '"Ubuntu", sans-serif',
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="Activity" stroke="#E0E0E0" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashboardChart;
