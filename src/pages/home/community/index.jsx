import React, { useEffect, useState } from "react";
import "./community.scss";
import ClientTable from "../../../components/client-table/ClientTable";
import Topbar from "../../../components/topbar/Topbar";
import {
  ChatProfileIcon,
  Clipper,
  GroupUsers,
  PaperPlane,
  Participants,
  Profile,
  Search,
} from "../../../assets";
import { CloseOutlined } from "@ant-design/icons";
import { Col, Drawer, Input, Row } from "antd";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { ApiCall } from "../../../Services/Apis";
import ParticipantsTable from "../../../components/community-participants-table/ParticipantsTable";
import { IoIosArrowBack } from "react-icons/io";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const Community = () => {
  const navigate = useNavigate();
  const { checkSubPermissions } = usePermissionCheck();

  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [groupChat, setGroupChat] = useState(null);
  const [adminsChat, setAdminsChat] = useState(null);

  const [selectedChat, setSelectedChat] = useState(null);

  const [isMessagesHidden, setIsMessagesHidden] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  // const [filteredClients, setFilteredClients] = useState([]);
  const isLaptop = useMediaQuery({ query: "(max-width: 540)" });
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();

  const getUser = async () => {
    dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: "",
        route: `admin/admin_detail`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        // console.log(res?.response);
        setData(res?.response?.admin);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting client detail -- ", e.toString());
    }
  };

  const getAllChatUsers = async () => {
    try {
      setIsLoading(true);
      const res = await ApiCall({
        params: "",
        route: `chat/all_chatrooms_admin`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setIsLoading(false);
        // console.log(res?.response, "alll users");
        setChatUsers(res.response?.chatrooms);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
    }
  };

  const getGroupChatDetails = async (chatId) => {
    dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: "",
        route: `groupChat/group_chat_detail/${chatId}`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        setGroupChat(res?.response?.chat);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting client detail -- ", e.toString());
    }
  };

  const getAdminsGroupChatDetail = async (chatId) => {
    dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: "",
        route: `groupChat/group_chat_detail/${chatId}`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        setAdminsChat(res?.response?.chat);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting client detail -- ", e.toString());
    }
  };

  const showDefaultDrawer = () => {
    setSize("default");
    setOpen(true);
  };
  const showLargeDrawer = () => {
    // if (isMobile) {
    navigate("/messages/participants");
    // } else {
    //   setSize("large");
    //   setOpen(true);
    // }
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUser();
    getAllChatUsers();
  }, []);

  useEffect(() => {
    if (data) {
      // getGroupChatDetails(data?.groupChatId);
      setSelectedChat(data?.groupChatId);
      // getAdminsGroupChatDetail(data?.adminChatId);
    }
  }, [data?.groupChatId]);

  return (
    <>
      <Topbar title="Community Participants" />
      <div className="community">
        <IoIosArrowBack
          className="icon"
          onClick={() => setIsMessagesHidden(true)}
        />
        <div className="community-content">
          <div className="input-community">
            <img src={Search} alt="" />
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          {selectedChat === data?.groupChatId && (
            <div className="add-participants" onClick={showLargeDrawer}>
              <img src={Participants} alt="" />
              <p> Participants </p>
            </div>
          )}
        </div>
        <hr className="line" />
        <div className="main-chat-container">
          {isMobile ? (
            <>
              {isMessagesHidden ||
              checkSubPermissions("messages", "communityMessages")?.status ? (
                <>
                  <div className="all-chat-users-main-container all-chat-users-main-container-mobile">
                    <div
                      className={`single-user-chat-container `}
                      onClick={() => {
                        setSelectedChat(data?.groupChatId);
                        setIsMessagesHidden(false);
                      }}
                    >
                      <div className="single-user-left">
                        <img src={GroupUsers} />
                      </div>
                      <div className="single-user-right">
                        <div className="inner-chat-detail">
                          <h4>App Community</h4>
                          {/* <span>
                            {new Date(
                              groupChat?.messages[
                                groupChat?.messages?.length - 1
                              ]?.date
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span> */}
                        </div>
                        {/* <p>
                          {
                            groupChat?.messages[groupChat?.messages?.length - 1]
                              ?.message
                          }
                        </p> */}
                      </div>
                    </div>

                    <div
                      className={`single-user-chat-container `}
                      onClick={() => {
                        setSelectedChat(data?.adminChatId);
                        setIsMessagesHidden(false);
                      }}
                    >
                      <div className="single-user-left">
                        <img src={GroupUsers} />
                      </div>
                      <div className="single-user-right">
                        <div className="inner-chat-detail">
                          <h4>Coach Community</h4>
                          {/* <span>
                            {new Date(
                              adminsChat?.messages[
                                adminsChat?.messages?.length - 1
                              ]?.date
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span> */}
                        </div>
                        {/* <p>
                          {
                            adminsChat?.messages[
                              adminsChat?.messages?.length - 1
                            ]?.message
                          }
                        </p> */}
                      </div>
                    </div>

                    {chatUsers?.length > 0 &&
                      chatUsers?.map((chat) => {
                        return (
                          <div
                            className={`single-user-chat-container `}
                            onClick={() => {
                              setSelectedChat(chat?._id);
                              setIsMessagesHidden(false);
                            }}
                          >
                            <div className="single-user-left">
                              <img
                                src={
                                  chat?.customer?.profile_image?.trim() !== ""
                                    ? chat?.customer?.profile_image
                                    : ChatProfileIcon
                                }
                              />
                            </div>
                            <div className="single-user-right">
                              <div className="inner-chat-detail">
                                <h4>{chat?.customer?.full_name}</h4>
                                <span>
                                  {new Date(
                                    chat?.messages[
                                      chat?.messages?.length - 1
                                    ]?.date
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                              <p>
                                {
                                  chat?.messages[chat?.messages?.length - 1]
                                    ?.message
                                }
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : (
                <>
                  <div className="message-container">
                    <Message
                      searchText={searchText}
                      chatId={selectedChat}
                      isGroupChat={
                        data?.groupChatId == selectedChat ||
                        data?.adminChatId == selectedChat
                      }
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="all-chat-users-main-container">
                {" "}
                {checkSubPermissions("messages", "communityMessages")
                  ?.status ? (
                  <div
                    className={`single-user-chat-container ${
                      data?.groupChatId === selectedChat ? "active-chat" : ""
                    }`}
                    onClick={() => setSelectedChat(data?.groupChatId)}
                  >
                    <div className="single-user-left">
                      <img src={GroupUsers} />
                    </div>

                    <div className="single-user-right">
                      <div className="inner-chat-detail">
                        <h4>App Community</h4>
                        {/* <span>
                        {new Date(
                          groupChat?.messages[
                            groupChat?.messages?.length - 1
                          ]?.date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span> */}
                      </div>
                      {/* <p>
                      {
                        groupChat?.messages[groupChat?.messages?.length - 1]
                          ?.message
                      }
                    </p> */}
                    </div>
                  </div>
                ) : null}
                {checkSubPermissions("messages", "communityMessages")
                  ?.status ? (
                  <div
                    className={`single-user-chat-container ${
                      data?.adminChatId === selectedChat ? "active-chat" : ""
                    }`}
                    onClick={() => setSelectedChat(data?.adminChatId)}
                  >
                    <div className="single-user-left">
                      <img src={GroupUsers} />
                    </div>
                    <div className="single-user-right">
                      <div className="inner-chat-detail">
                        <h4>Coach Community</h4>
                        {/* <span>
                        {new Date(
                          adminsChat?.messages[
                            adminsChat?.messages?.length - 1
                          ]?.date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span> */}
                      </div>
                      {/* <p>
                      {
                        adminsChat?.messages[adminsChat?.messages?.length - 1]
                          ?.message
                      }
                    </p> */}
                    </div>
                  </div>
                ) : null}
                {checkSubPermissions(
                  "messages",
                  "customCoachingClientsMessages"
                )?.status ? (
                  <>
                    <div className="custom-coaching-client-heading-in-messages">
                      <p>Custom Coaching Clients</p>
                    </div>
                    {chatUsers?.length > 0 &&
                      chatUsers?.map((chat) => {
                        return (
                          <div
                            className={`single-user-chat-container ${
                              chat?._id === selectedChat ? "active-chat" : ""
                            }`}
                            onClick={() => setSelectedChat(chat?._id)}
                          >
                            <div className="single-user-left">
                              <img
                                src={
                                  chat?.customer?.profile_image?.trim() !== ""
                                    ? chat?.customer?.profile_image
                                    : ChatProfileIcon
                                }
                              />
                            </div>
                            <div className="single-user-right">
                              <div className="inner-chat-detail">
                                <h4>{chat?.customer?.full_name}</h4>
                                <span>
                                  {new Date(
                                    chat?.messages[
                                      chat?.messages?.length - 1
                                    ]?.date
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                              <p>
                                {
                                  chat?.messages[chat?.messages?.length - 1]
                                    ?.message
                                }
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </>
                ) : null}
              </div>
              {checkSubPermissions("messages", "customCoachingClientsMessages")
                ?.status ||
              checkSubPermissions("messages", "communityMessages")?.status ? (
                <div className="message-container">
                  <Message
                    searchText={searchText}
                    chatId={selectedChat}
                    isGroupChat={
                      data?.groupChatId == selectedChat ||
                      data?.adminChatId == selectedChat
                    }
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* show drawer*/}
      {/* <div className="all-participants"> */}
      <Drawer
        placement="left"
        size={size}
        onClose={onClose}
        open={open}
        className="participants-drawer"
      >
        <div className="community-participants">
          <div className="community-participants-input">
            <img src={Search} alt="" />
            <input type="text" placeholder="Search" />
          </div>
          <div className="community-table">
            <ParticipantsTable />
          </div>
        </div>
      </Drawer>
      {/* </div> */}
    </>
  );
};

export default Community;
