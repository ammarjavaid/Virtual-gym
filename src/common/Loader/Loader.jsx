import React from "react";
import "./Loader.scss";
import { ConfigProvider, Modal, Spin } from "antd";

const Loader = ({ height = "300px", width }) => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f79300",
          },
        }}
      >
        <Modal
          className="loader-modal"
          width={"100vw"}
          centered
          open={true}
          maskClosable={true}
          closable={false}
        >
          <div style={{ height, width }} className="spinnerContainer">
            <Spin size="large" />
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default Loader;
