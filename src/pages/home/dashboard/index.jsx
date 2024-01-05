import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import Topbar from "../../../components/topbar/Topbar";
import {
  ArrowGreen,
  ArrowRed,
  Caret,
  Check,
  Chevron_Down,
  Dashboard_profile,
  Required,
} from "../../../assets";
import { ActiveClients, TableData } from "./constant";
import { ConfigProvider, Spin, message } from "antd";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import DashboardChart from "../../../components/charts/DashboardChart";
import DashboardClientsCharts from "../../../components/charts/DashboardClientsCharts";
import DashboardClientTable from "../../../components/dashboardClientTable/DashboardClientTable";
import { useNavigate } from "react-router-dom";
import Loader from "../../../common/Loader/Loader";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.userToken);
  const { checkSubPermissions } = usePermissionCheck();
  const userActivity = checkSubPermissions("dashboard", "userActivity");
  const dashboardOverview = checkSubPermissions(
    "dashboard",
    "dashboardOverview"
  );
  const dashboardClients = checkSubPermissions("dashboard", "dashboardClients");

  const naviagte = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [activeInactive, setActiveInactive] = useState([]);
  const [clientGraph, setClientGraph] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      // dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "assignProgram/update_feed",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        // dispatch(setLoader(false));
        setData(res?.response?.Feed);
      } else {
        console.log("error", res.response);
        // dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      // dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };
  const dashboardActiveInactiveClients = async () => {
    try {
      // dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "user/dashobaord-counts",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        // dispatch(setLoader(false));
        setActiveInactive(res?.response);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      // dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };
  const dashboardClientsGraph = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: "user/user-counts-graph",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setClientGraph(res?.response);
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
    getDashboardData();
    dashboardClientsGraph();
    dashboardActiveInactiveClients();
  }, []);

  const [activeTab, setActiveTab] = useState("all");
  const handleActive = (type) => {
    setActiveTab(type);
  };

  const [alertMessageByAdmin, setAlertMessageByAdmin] = useState();
  const [formData, setFormData] = useState({
    alert: "",
    isAlertModified: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      isAlertModified: true,
    });
  };

  const alertMessage = async () => {
    const formDatatoSend = new FormData();

    formDatatoSend.append("alert", formData.alert);

    try {
      const res = await ApiCall({
        params: formDatatoSend,
        route: "admin/edit_alert",
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        getAlertMessage();
        setFormData((prevData) => ({ ...prevData, isAlertModified: false }));
        message?.success(res?.response?.message);
      } else {
        console.log(res?.response);
      }
    } catch (error) {
      console.log(first);
    }
  };
  const getAlertMessage = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: "admin/get_alert",
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        setAlertMessageByAdmin(res?.response?.admin);
        setFormData((prevData) => ({
          ...prevData,
          alert: res?.response?.admin,
          isAlertModified: false,
        }));
      } else {
        console.log(res?.response);
      }
    } catch (error) {
      console.log(first);
    }
  };

  useEffect(() => {
    getAlertMessage();
  }, []);

  // console.log(alertMessageByAdmin, "alertMessageByAdmin");

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="dashboard">
        {dashboardOverview?.status ? (
          <div className="dashboard-overview">
            <h3> Overview </h3>
            <div className="overview">
              <div className="overview-left">
                <h1>
                  {activeInactive?.counts?.activeInCurrentMonth}
                  <img src={ArrowGreen} alt="" />
                </h1>
                <p> New members this month </p>
              </div>
              <div className="overview-center">
                <h1>
                  {activeInactive?.counts?.inactiveInLastMonth}
                  <img src={ArrowRed} alt="" />
                </h1>
                <p> Members lost this month </p>
              </div>
              <div className="overview-right">
                <h1>
                  {activeInactive?.counts?.totalactive}
                  <img src={ArrowRed} alt="" />
                </h1>
                <p> Active custom coaching clients </p>
              </div>
            </div>
          </div>
        ) : null}
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter"
            name="alert"
            value={
              formData.isAlertModified ? formData.alert : alertMessageByAdmin
            }
            onChange={handleChange}
          />
          <button onClick={alertMessage}> Update </button>
        </div>
        {userActivity?.status ? (
          <div className="dashboard-activity">
            <h3> User activity </h3>
            <div className="chart">
              <DashboardChart />
            </div>
          </div>
        ) : null}
        {dashboardClients?.status ? (
          <div className="dashboard-clients">
            <div className="dashboard-clients-left">
              <div className="head">
                <h3 className="clients"> Clients </h3>
                {clientGraph?.Stats && clientGraph.Stats.length > 0 && (
                  <div className="acitive-inactive">
                    <h3 className="active">
                      Active - {clientGraph.Stats[0]?.totalactive}%
                    </h3>
                    <h3 className="inactive">
                      Inactive - {clientGraph.Stats[0]?.totalinactive}%
                    </h3>
                  </div>
                )}
              </div>
              <div className="chart">
                <DashboardClientsCharts
                  clientGraph={clientGraph?.Stats}
                  loading={loading}
                />
              </div>
            </div>
            <div className="dashboard-clients-right">
              <div className="buttons-desktop-view">
                <div className="buttons-mobile">
                  <button
                    className={
                      activeTab === "all"
                        ? "table-head-btn activeTab"
                        : "table-head-btn"
                    }
                    onClick={() => handleActive("all")}
                  >
                    All
                  </button>
                  <button
                    className={
                      activeTab === "active"
                        ? "table-head-btn activeTab"
                        : "table-head-btn"
                    }
                    onClick={() => handleActive("active")}
                  >
                    Active
                  </button>
                  <button
                    className={
                      activeTab === "inactive"
                        ? "table-head-btn activeTab"
                        : "table-head-btn"
                    }
                    onClick={() => handleActive("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
              <div className="table">
                <DashboardClientTable activeTab={activeTab} />
                <p className="see-all" onClick={() => naviagte("/client")}>
                  See all
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
