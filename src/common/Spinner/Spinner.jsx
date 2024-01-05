import { ConfigProvider, Spin } from "antd";
import React from "react";
import "./spinner.scss";

const Spinner = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f79300",
          },
        }}
      >
        <div className="messages-box-spinner">
          <Spin />
        </div>
      </ConfigProvider>
    </>
  );
};

export default Spinner;
