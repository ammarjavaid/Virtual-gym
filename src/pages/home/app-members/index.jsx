import React, { useEffect, useState } from "react";
import "./app-member.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Filter, Search } from "../../../assets";
import ClientTable from "../../../components/client-table/ClientTable";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppMemberTable from "../../../components/app-member-table/AppMemberTable";
import { ApiCall } from "../../../Services/Apis";

const AppMembers = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.userToken);

  const handleActive = (type) => {
    setActiveTab(type);
  };

  const navigate = useNavigate();

  const [showBtn, setShowBtn] = useState(false);

  const filterbtnClick = () => {
    setShowBtn(!showBtn);
  };

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
        route: `admin/all_assign_clients`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        // console.log(res?.response);
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

  const handleChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    let clients = [];
    if (activeTab) {
      if (activeTab === "active") {
        clients = allClients.filter((el) => el.status === true);
      } else if (activeTab === "inactive") {
        clients = allClients.filter((el) => el.status === false);
      } else if (activeTab === "all") {
        clients = allClients;
      }
    }
    if (searchQuery === "") {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter((el) =>
          JSON.stringify(el)?.toString()?.toLowerCase()?.includes(searchQuery)
        )
      );
    }
  };

  return (
    <>
      <Topbar title="App Members" />
      <div className="app-member">
        <div className="table-head">
          <div className="table-head-left">
            {/* for desktop view  */}

            <div className="input">
              <img src={Search} alt="" />
              <input type="text" placeholder="Search" onChange={handleChange} />
            </div>
            <div className="buttons-desktop-view">
              <div className="buttons-mobile">
                <img
                  src={Filter}
                  alt=""
                  onClick={filterbtnClick}
                  className={showBtn ? "show" : ""}
                />
                <div
                  className={
                    showBtn ? "filter-button show" : "filter-button hide"
                  }
                >
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
            </div>

            {/* for mobile view  */}

            <div className="input-mobile">
              <img src={Search} alt="" />
              <input type="text" placeholder="Search" onChange={handleChange} />
            </div>

            <div className="buttons-mobile-view">
              <div className="buttons-mobile">
                <img
                  src={Filter}
                  alt=""
                  onClick={filterbtnClick}
                  className={showBtn ? "show" : ""}
                />
                <div
                  className={
                    showBtn ? "filter-button show" : "filter-button hide"
                  }
                >
                  <button
                    className={
                      activeTab === "all"
                        ? "table-head-btn activeTab"
                        : "table-head-btn"
                    }
                    onClick={() => {
                      handleActive("all");
                      setShowBtn(!showBtn);
                    }}
                  >
                    All
                  </button>
                  <button
                    className={
                      activeTab === "active"
                        ? "table-head-btn activeTab"
                        : "table-head-btn"
                    }
                    onClick={() => {
                      handleActive("active");
                      setShowBtn(!showBtn);
                    }}
                  >
                    Active
                  </button>
                  <button
                    className={
                      activeTab === "inactive"
                        ? "table-head-btn activeTab"
                        : "table-head-btn"
                    }
                    onClick={() => {
                      handleActive("inactive");
                      setShowBtn(!showBtn);
                    }}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="table-head-right">
            {/* <button
              className="add-client"
              onClick={() => navigate("/client/add-new-client")}
            >
              Add client
            </button> */}
          </div>
        </div>

        <div className="table">
          <AppMemberTable
            activeTab={activeTab}
            filteredClients={filteredClients}
            isLoading={isLoading}
            getAllClients={getAllClients}
          />
        </div>
      </div>
    </>
  );
};

export default AppMembers;
