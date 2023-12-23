import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Avatar, Input, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Message from "./Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useConversationContext } from "../context/ConversationContext";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";
import { useChattedUsersContext } from "../context/ChattedUsers";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import BlockingPrompt from "./BlockingPrompt";
import ReportIcon from "@mui/icons-material/Report";
import ReportingPrompt from "./ReportingPrompt";
import { useAuth0 } from "@auth0/auth0-react";
// import { useLoadConversationsContext } from "../context/LoadConversationsContext";
import axios from "axios";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(1.3),
  "@media all": {
    minHeight: 35,
  },
}));

const Chatting = ({ setLoadConversations }) => {
  const [id, setid] = useState("");

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const { conversation, setConversationValue } = useConversationContext();

  // const { setLoadConversationsValue } = useLoadConversationsContext();

  const { user } = useUserContext();

  const authContext = useAuth0();

  const { socket } = useSocketContext();

  const { chattedUsers } = useChattedUsersContext();

  const { receiverId, setReceiverIdValue } = useReceiverIdContext();

  const [blocked, setBlockedValue] = useState(conversation?.blocked);

  console.log("#@#@# blocked #@#@#@", blocked, conversation);

  const [showBlockingPrompt, setShowBlockingPrompt] = useState(false);
  const [updateBlockingPrompt, setUpdateBlockingPrompt] = useState(false);

  const [showReportPrompt, setShowReportPrompt] = useState(false);

  const handleReport = () => {
    setShowReportPrompt(true);
  };

  const handleCloseReportPrompt = () => {
    setShowReportPrompt(false);
  };

  const handleSubmitReport = (reason) => {
    // Handle the submitted report reason, e.g., send it to the server
    console.log("Report Reason:", reason);
    const receiverIdTemp = conversation?.members.find(
      (member) => member !== user._id
    );
    const tempName =
      chattedUsers[conversation?.members.find((m) => m !== user?._id)]?.name;

    const tempUserType = user.user_type === "student" ? "alumni" : "student";
    socket.emit("userReported", {
      reporterId: user._id,
      reporterName: user.name,
      reportedId: receiverIdTemp,
      reportedName: tempName,
      reportedUserType: tempUserType,
      reason: reason,
    });
  };

  const scrollRef = useRef();

  useEffect(() => {
    console.log("^^^^^^^^^ ABOVE GETMESSAGES ^^^^^^^^^^");
    console.log(socket);
    socket.on("getMessage", (data) => {
      // setLoadConversationsValue(1);
      console.log("^^^^^^^^^ INSIDE GETMESSAGES ^^^^^^^^^^");
      console.log(
        "^^^^^^^^^ INSIDE GETMESSAGES ^^^^^^^^^^",
        window.location.pathname
      );
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => {
      socket.off("getMessage");
    };
  });

  useEffect(() => {
    socket.on("updateBlockedStatus", () => {
      setBlockedValue(!blocked);
      conversation.blocked = !blocked;
      setUpdateBlockingPrompt(true);
    });
    // return () => {
    //   socket.off("updateBlockedStatus");
    // };
  });

  useEffect(() => {
    socket.on("getRemoveUserNotificationChat", async (data) => {
      authContext.logout({ returnTo: "http://localhost:5000" });
    });
    return () => {
      socket.off("getRemoveUserNotification");
    };
  });

  useEffect(() => {
    arrivalMessage &&
      conversation?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conversation]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log("2");
        await axios
          .get(
            `http://localhost:4000/api/v1/messages/getMessages?conversationId=${conversation?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            // console.log(response);
            // console.log(response.data);
            setMessages(response.data);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [conversation?._id]);

  const sendMeesageBtController = async (e) => {
    if (!blocked) {
      e.preventDefault();

      const receiverIdTemp = conversation?.members.find(
        (member) => member !== user._id
      );

      try {
        if (messages.length === 0) {
          await axios
            .post(
              `http://localhost:4000/api/v1/conversations/newConversation`,
              {
                senderId: user._id,
                receiverId: receiverIdTemp,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log(response);
              // setConversationValue(response.data);
              conversation._id = response.data._id;
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
        }
      } catch (error) {
        console.log(error);
      }

      const message = {
        sender: user._id,
        text: newMessage,
        conversationId: conversation._id,
      };

      const receiverName = chattedUsers[receiverIdTemp]?.name;

      // if (receiverIdTemp === receiverId) {
      if (messages.length === 0) {
        socket.emit("newConversation&Message", {
          senderId: user._id,
          // senderId: user.email,
          senderName: user.name,
          receiverId: receiverIdTemp,
          conversation: conversation,
          text: newMessage,
        });
      } else {
        socket.emit("sendMessage", {
          // senderId: user.email,
          senderId: user._id,
          senderName: user.name,
          receiverId: receiverIdTemp,
          conversation: conversation,
          text: newMessage,
        });
      }
      try {
        await axios
          .post(`http://localhost:4000/api/v1/messages/newMessage`, message)
          .then((response) => {
            console.log(response);
            setMessages([...messages, response.data]);
            setNewMessage("");
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.log(error);
      }

      try {
        await axios
          .put(
            `http://localhost:4000/api/v1/conversations/updateConversation?conversationId=${conversation?._id}`,
            {
              lastMessage: newMessage,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            // setBlockedValue(!blocked);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.log(error);
      }
      setLoadConversations(
        (prevLoadConversations) => prevLoadConversations + 1
      );
    } else {
      setShowBlockingPrompt(true);
    }
  };

  const handleCloseBlockingPrompt = () => {
    setShowBlockingPrompt(false);
  };

  const handleCloseOfUpdateBlockingPrompt = () => {
    setUpdateBlockingPrompt(false);
  };

  const blockBtController = async (e) => {
    const status = !blocked;
    console.log("#$#$#$#$#$#Status", status);
    try {
      await axios
        .put(
          `http://localhost:4000/api/v1/conversations/updateConversation?conversationId=${conversation?._id}`,
          {
            blocked: status,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          setBlockedValue(!blocked);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      const receiverIdTemp = conversation?.members.find(
        (member) => member !== user._id
      );

      socket.emit("changeBlockedStatus", {
        senderId: user._id,
        senderName: user.name,
        receiverIdArg: receiverIdTemp,
        blockedStatus: status,
      });
      conversation.blocked = status;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const handleReport = () => {
  //   const receiverIdTemp = conversation?.members.find(
  //     (member) => member !== user._id
  //   );
  // };

  return (
    <div className="chatting">
      <AppBar position="static">
        <StyledToolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 0 }}
          >
            {/* <MenuIcon /> */}
            <Avatar
              alt="Remy Sharp"
              src={
                chattedUsers[conversation?.members.find((m) => m !== user?._id)]
                  ?.img
              }
              sx={{ width: 24, height: 26 }}
            />
          </IconButton>
          <Typography variant="h6" flexGrow={1} sx={{ pt: 0, ml: 0 }}>
            {
              chattedUsers[conversation?.members.find((m) => m !== user?._id)]
                ?.name
            }
          </Typography>
          {/* <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <VideoCallIcon />
          </IconButton> */}
          {/* {user.user_type !== "student" ? (
            <IconButton
              variant="contained"
              style={{
                backgroundColor: blocked ? "#00FF00" : "#FF0000",
                marginLeft: "12px",
              }}
              className="IconButton"
              onClick={blockBtController}
            >
              {blocked ? "Unblock" : "Block"}
            </IconButton>
          ) : null} */}
          {user.user_type !== "admin" ? (
            <div>
              {user.user_type !== "student" ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: blocked ? "#00FF00" : "#FF0000",
                    marginLeft: "12px",
                  }}
                  className="IconButton"
                  onClick={blockBtController}
                >
                  {blocked ? "Unblock" : "Block"}
                </Button>
              ) : null}
              <IconButton
                size="large"
                aria-label="display more actions"
                edge="end"
                onClick={handleReport}
              >
                <ReportIcon style={{ color: "#FF0000" }} />
              </IconButton>
            </div>
          ) : (
            <Button
              variant="contained"
              style={{ backgroundColor: "#FF0000" }}
              className="IconButton"
            >
              Remove User
            </Button>
          )}
        </StyledToolbar>
      </AppBar>
      {/* <Messages /> */}
      <ReactScrollToBottom className="messages">
        {messages.map((m) => (
          <Message owner={m.sender === user._id} message={m} />
        ))}
      </ReactScrollToBottom>
      <div>
        {!conversation.blocked || user.user_type !== "student" ? (
          <div className="sendMsg">
            <Input
              onKeyPress={(event) =>
                event.key === "Enter" ? sendMeesageBtController(event) : null
              }
              placeholder="Type a message"
              className="input"
              id="chatInput"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
            <Button
              variant="contained"
              color="primary"
              className="IconButton"
              onClick={sendMeesageBtController}
            >
              Send
            </Button>
          </div>
        ) : (
          <div className="BlockedContainer">
            <p className="bText">You are Blocked</p>
          </div>
        )}
      </div>
      <BlockingPrompt
        open={showBlockingPrompt}
        onClose={handleCloseBlockingPrompt}
        message={
          user.user_type === "student"
            ? `You have been blocked by ${
                true &&
                chattedUsers[conversation?.members.find((m) => m !== user?._id)]
                  ?.name
              }.`
            : `You have blocked ${
                true &&
                chattedUsers[conversation?.members.find((m) => m !== user?._id)]
                  ?.name
              }. Please unblock to send messages.`
        }
      />
      <BlockingPrompt
        open={updateBlockingPrompt}
        onClose={handleCloseOfUpdateBlockingPrompt}
        message={`You have been ${blocked ? "Blocked" : "Unblocked"} by ${
          true &&
          chattedUsers[conversation?.members.find((m) => m !== user?._id)]?.name
        }.`}
      />
      <ReportingPrompt
        open={showReportPrompt}
        onClose={handleCloseReportPrompt}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default Chatting;
