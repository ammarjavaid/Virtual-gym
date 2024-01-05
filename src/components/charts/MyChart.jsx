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
import { useSelector } from "react-redux";
import { ConfigProvider, Spin } from "antd";

const MyChart = () => {
  const [userActivity, setUserActivity] = useState([]);
  const token = useSelector((state) => state.auth.userToken);
  // const [loading, setLoading] = useState(false);
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
        setLoading(false);
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
            style={{ height: "200px", width: "30vw" }}
            className="spinnerContainer"
          >
            <Spin size="small" />
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
    <div className="charts">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
  );
};

export default MyChart;
