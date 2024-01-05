import { ConfigProvider, Spin } from "antd";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardClientsCharts = ({ clientGraph, loading }) => {
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
            style={{ height: "300px", width: "30vw" }}
            className="spinnerContainer"
          >
            <Spin size="small" />
          </div>
        </ConfigProvider>
      </>
    );
  }

  if (!Array.isArray(clientGraph)) {
    return null;
  }

  const data = clientGraph.map((item) => ({
    name: `Month ${item.month}`,
    Active: parseFloat(item.activeGraph),
    Inactive: parseFloat(item.inactiveGraph),
  }));

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={800}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: -15,
            bottom: 0,
          }}
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
          <Area
            type="monotone"
            dataKey="Active"
            stroke="#8884d8"
            fill="#EA4237"
          />
          <Area
            type="monotone"
            dataKey="Inactive"
            stroke="#82ca9d"
            fill="#16CC66"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default DashboardClientsCharts;
