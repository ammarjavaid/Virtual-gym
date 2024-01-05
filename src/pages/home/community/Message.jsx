import React, { useEffect, useRef, useState } from "react";
import { Clipper, PaperPlane, Profile, Search } from "../../../assets";
import { Col, Row, Input, message, Button, Spin } from "antd";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { ApiCall } from "../../../Services/Apis";
import { useNavigate } from "react-router-dom";
import socket from "../../../../socket";
import Spinner from "../../../common/Spinner/Spinner";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import { IMAGE_URL } from "../../../Services/Constants";

const Message = ({ chatId, searchText, isGroupChat }) => {
  // console.log(chatId, "chat id");
  const navigate = useNavigate();
  const inboxRef = useRef();
  const isLaptop = useMediaQuery({ query: "(max-width: 1280px)" });
  const token = useSelector((state) => state.auth.userToken);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [fileToSend, setFileToSend] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [usersOfChat, setUsersOfChat] = useState([]);

  const user = useSelector((state) => state.auth.userData);
  // console.log(user, 'user in messages');
  const { checkSubPermissions } = usePermissionCheck();
  const sendButtonRef = useRef(null);

  // console.log(sendButtonRef, "sendButtonRef");

  const dispatch = useDispatch();

  const getChatDetails = async () => {
    // dispatch(setLoader(true));
    setIsMessagesLoading(true);
    try {
      const res = await ApiCall({
        params: "",
        route: isGroupChat
          ? `groupChat/group_chat_detail/${chatId}`
          : `chat/chat_detail/${chatId}`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        setIsMessagesLoading(false);
        // dispatch(setLoader(false));#
        const receivedChat = res?.response?.chat;
        // console.log(receivedChat);
        setChat(receivedChat);
        setFilteredMessages(receivedChat?.messages);
        setMessages(receivedChat?.messages);
        setUsersOfChat([
          ...receivedChat?.users,
          ...receivedChat?.subadmins,
          receivedChat?.admin,
        ]);
      } else {
        setIsMessagesLoading(false);
        console.log("error", res.response);
        setMessages([]);
        setFilteredMessages([]);
        // dispatch(setLoader(false));
      }
    } catch (e) {
      setIsMessagesLoading(false);
      console.log("Error getting client detail -- ", e.toString());
    }
  };

  // console.log(chat, 'chat in community');

  useEffect(() => {
    if (chatId) {
      getChatDetails();
      socket.emit("join", { chatroomId: chatId });

      const handleChatMessage = (message) => {
        // console.log(message, "incoming message");
        setMessages((prev) => [...prev, message]);
        setFilteredMessages((prev) => [...prev, message]);
      };

      socket.on(isGroupChat ? "group-chat" : "chat", handleChatMessage);

      return () => {
        socket.off(isGroupChat ? "group-chat" : "chat", handleChatMessage);
      };
    }
  }, [chatId]);

  useEffect(() => {
    if (inboxRef.current) {
      inboxRef.current.scrollTop = inboxRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  const sendMessage = (text) => {
    socket.emit(isGroupChat ? "group-chat" : "chat", {
      ...(isGroupChat ? { groupChatId: chatId } : { chatroomId: chatId }),
      senderId: isGroupChat ? user?._id : chat?.admin?._id,
      date: new Date(),
      text,
    });
  };

  const sendFile = (text) => {
    // console.log(fileToSend);
    socket.emit(
      isGroupChat ? "group-upload" : "upload",
      fileToSend,
      fileToSend?.name,
      fileToSend.type,
      isGroupChat ? user?._id : chat?.admin?._id,
      chatId,
      (status) => {
        if (status?.message === "failure") {
          // console.log("failure");
          // message.error("Couldn't send.");
          return;
        }
        if (status?.message === "success") {
          message.success("Sent!");
          // console.log("sucess");
        }
      }
    );
    sendButtonRef.current.focus();
  };

  useEffect(() => {
    // Focus on the file input when a file is selected
    if (fileToSend) {
      sendButtonRef.current.focus();
    }
  }, [fileToSend]);

  const handleSendMessage = (e) => {
    // console.log(messageText);

    if (!fileToSend) {
      if (messageText?.trim() !== "") {
        sendMessage(messageText);
        setMessageText("");
      }
    } else {
      sendFile();
      setFileToSend(null);
    }
  };

  const onChangeSearch = () => {
    setFilteredMessages(
      messages?.filter((message) =>
        message?.message?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  useEffect(() => {
    onChangeSearch();
  }, [searchText]);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleInputKeyDown = (e) => {
    console.log("Key pressed:", e.key);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // sendButtonRef.current.click();
      handleSendMessage();
    }
  };

  // console.log(filteredMessages, "filteredMessages");

  return (
    <>
      <div className="inbox" ref={inboxRef}>
        {isMessagesLoading ? (
          <Spinner />
        ) : (
          filteredMessages.map((el, index) => (
            <>
              {index === 0 ||
              formatDate(el?.date) !==
                formatDate(filteredMessages[index - 1]?.date) ? (
                <div className="day-divider">
                  <span>{formatDate(el?.date)}</span>
                  <hr />
                </div>
              ) : null}
              {el?.sender !== (isGroupChat ? user?._id : chat?.admin?._id) ? (
                <Row>
                  <Col className="span-1" span={isLaptop ? 2 : 1}>
                    <img
                      src={
                        usersOfChat.find(
                          (chatUser) => chatUser?._id === el?.sender
                        )?.profile_image || Profile
                      }
                      alt=""
                      className="receiver"
                    />
                  </Col>
                  <Col span={18} style={{ padding: "0 5px" }}>
                    <div className="box-receiver-main">
                      <p>
                        {
                          usersOfChat.find(
                            (chatUser) => chatUser?._id === el?.sender
                          )?.full_name
                        }
                      </p>
                      {el?.file ? (
                        <a href={IMAGE_URL + el?.file?.url} target="_blank">
                          <span className="box-sender">
                            {el?.file?.file_type?.includes("pdf") ? (
                              <Button>Download file</Button>
                            ) : (
                              <img
                                className="message-image"
                                src={IMAGE_URL + el?.file?.url}
                              />
                            )}
                          </span>
                        </a>
                      ) : (
                        <>
                          <p className="box-receiver">{el?.message}</p>
                          <span>
                            {new Date(el?.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row style={{ display: "flex", flexDirection: "row-reverse" }}>
                  <Col className="span-1" span={isLaptop ? 2 : 1}>
                    <img
                      src={user?.profile_image || Profile}
                      alt=""
                      className="receiver"
                    />
                  </Col>
                  <Col span={18} className="span-12">
                    <div className="box-sender-main">
                      {el?.file ? (
                        <a href={IMAGE_URL + el?.file?.url} target="_blank">
                          <span className="box-sender">
                            {el?.file?.file_type?.includes("pdf") ? (
                              <Button>Download file</Button>
                            ) : (
                              <img
                                className="message-image"
                                src={IMAGE_URL + el?.file?.url}
                              />
                            )}
                          </span>
                        </a>
                      ) : (
                        <>
                          <p className="box-sender">{el?.message}</p>
                          <span>
                            {new Date(el?.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              )}
            </>
          ))
        )}
      </div>

      {checkSubPermissions("messages", "SendCustomCoachingClientsMessages")
        ?.status || isGroupChat ? (
        <div className="send-btn-content">
          <div className="input-send-msg">
            {!fileToSend ? (
              <Input
                value={messageText}
                disabled={fileToSend ? true : false}
                onChange={(e) => setMessageText(e.target?.value)}
                placeholder="Write your message..."
                onKeyDown={handleInputKeyDown}
              />
            ) : (
              <div className="file-name">
                <span>{fileToSend?.name}</span>
                <span
                  className="cross-file-name"
                  onClick={() => setFileToSend(null)}
                >
                  X
                </span>
              </div>
            )}
            <input
              id="input_file"
              type="file"
              hidden
              style={{ display: "none" }}
              onChange={(e) => {
                if (
                  e.target?.files[0]?.type === "application/pdf" ||
                  e.target?.files[0]?.type.split("/")[0] === "image"
                ) {
                  setFileToSend(e.target.files[0]);
                  return;
                }
                message.error("Only Images and PDF files Allowed");
              }}
            ></input>
            <label htmlFor="input_file">
              <img src={Clipper} alt="" className="clipper" />
            </label>
          </div>
          <div
            onClick={handleSendMessage}
            className="send-btn"
            onKeyDown={handleInputKeyDown}
            // ref={sendButtonRef}
          >
            <img src={PaperPlane} alt="" />
            {/* <button type="button" ref={sendButtonRef}> */}
            <button
              type="button"
              ref={sendButtonRef}
              className="no-outline-button"
              // style={{ border: "none" }}
            >
              Send
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Message;
