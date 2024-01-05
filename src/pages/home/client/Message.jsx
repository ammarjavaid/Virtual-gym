import React, { useEffect, useRef, useState } from "react";
import { Clipper, PaperPlane, Profile, Search } from "../../../assets";
import { Col, Row, Input, message, Button } from "antd";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { ApiCall } from "../../../Services/Apis";
import { useNavigate } from "react-router-dom";
import socket from "../../../../socket";

const Message = ({ chatId }) => {
  const navigate = useNavigate();
  const inboxRef = useRef();
  const isLaptop = useMediaQuery({ query: "(max-width: 1280px)" });
  const token = useSelector((state) => state.auth.userToken);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [fileToSend, setFileToSend] = useState(null);

  const dispatch = useDispatch();

  const getChatDetails = async () => {
    // dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: "",
        route: `chat/chat_detail/${chatId}`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        // console.log(res?.response?.chat);
        setChat(res?.response?.chat);
        setFilteredMessages(res?.response?.chat?.messages);
        setMessages(res?.response?.chat?.messages);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting client detail -- ", e.toString());
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetails();
      socket.emit("join", { chatroomId: chatId });

      const handleChatMessage = (message) => {
        // console.log(message, "incoming message");
        setMessages((prev) => [...prev, message]);
        setFilteredMessages((prev) => [...prev, message]);
      };

      socket.on("chat", handleChatMessage);

      return () => {
        socket.off("chat", handleChatMessage);
      };
    }
  }, [chatId]);

  useEffect(() => {
    if (inboxRef.current) {
      inboxRef.current.scrollTop = inboxRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  const sendMessage = (text) => {
    socket.emit("chat", {
      chatroomId: chatId,
      senderId: chat?.admin?._id,
      date: new Date(),
      text,
    });
  };

  const sendFile = (text) => {
    // console.log(fileToSend);
    socket.emit(
      "upload",
      fileToSend,
      fileToSend?.name,
      fileToSend.type,
      chat?.admin?._id,
      chatId,
      (status) => {
        if (status?.message === "failure") {
          // console.log("failure");
          // message.error("Couldn't send.");
          return;
        }
        if (status?.message === "success") {
          message.error("Sent!");
          // console.log("sucess");
        }
      }
    );
  };

  const handleSendMessage = (e) => {
    // console.log(messageText);
    if (!fileToSend) {
      if (messageText?.trim() !== "") sendMessage(messageText);
      setMessageText("");
    } else {
      sendFile();
      setFileToSend(null);
    }
  };

  const onChangeSearch = (value) => {
    setFilteredMessages(
      messages?.filter((message) =>
        message?.message?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="message-inbox-head">
        <div className="message-inbox-head-content">
          <div className="message-inbox-head-left">
            <img src={chat?.customer?.profile_image || Profile} alt="" />
            <p> {chat?.customer?.full_name}</p>
          </div>
          <div className="message-inbox-head-right">
            <div className="input">
              <img src={Search} alt="" />
              <input
                onChange={(e) => onChangeSearch(e.target.value)}
                type="text"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="inbox" ref={inboxRef}>
        {filteredMessages.map((el, index) => (
          <>
            {index === 0 ||
            formatDate(el?.date) !==
              formatDate(filteredMessages[index - 1]?.date) ? (
              <div className="day-divider">
                <span>{formatDate(el?.date)}</span>
                <hr />
              </div>
            ) : null}
            {el?.sender !== chat?.admin?._id ? (
              <Row>
                <Col className="span-1" span={isLaptop ? 2 : 1}>
                  <img
                    src={chat?.customer?.profile_image || Profile}
                    alt=""
                    className="receiver"
                  />
                </Col>
                <Col span={18} style={{ padding: "0 5px" }}>
                  <div className="box-receiver-main">
                    {el?.file ? (
                      <a href={el?.file?.file_url} target="_blank">
                        <span className="box-sender">
                          {el?.file?.file_type?.includes("pdf") ? (
                            <Button>Download file</Button>
                          ) : (
                            <img
                              className="message-image"
                              src={el?.file?.file_url}
                            />
                          )}
                        </span>{" "}
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
                    src={chat?.admin?.profile_image || Profile}
                    alt=""
                    className="receiver"
                  />
                </Col>
                <Col span={18} className="span-12">
                  <div className="box-sender-main">
                    {el?.file ? (
                      <a href={el?.file?.file_url} target="_blank">
                        <span className="box-sender">
                          {el?.file?.file_type?.includes("pdf") ? (
                            <Button>Download file</Button>
                          ) : (
                            <img
                              className="message-image"
                              src={el?.file?.file_url}
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
        ))}
      </div>
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
        <div onClick={handleSendMessage} className="send-btn">
          <img src={PaperPlane} alt="" />
          <button> Send </button>
        </div>
      </div>
    </>
  );
};

export default Message;
