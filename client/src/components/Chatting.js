import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Avatar, Input, Button } from "@mui/material";
import Message from "./Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useConversationContext } from "../context/ConversationContext";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";
import { useChattedUsersContext } from "../context/ChattedUsers";
import BlockingPrompt from "./BlockingPrompt";
import ReportIcon from "@mui/icons-material/Report";
import ReportingPrompt from "./ReportingPrompt";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(1.3),
  // height: "30px",
  "@media all": {
    minHeight: "38px",
  },
}));

const Chatting = ({ setLoadConversations }) => {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const { conversation, setConversationValue } = useConversationContext();

  const { user } = useUserContext();

  const authContext = useAuth0();

  const { socket } = useSocketContext();

  const { chattedUsers } = useChattedUsersContext();

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

    const tempUserType =
      chattedUsers[conversation?.members.find((m) => m !== user?._id)]
        ?.user_type;
    socket.emit("userReported", {
      reporterId: user._id,
      reporterName: user.name,
      reporterUserType: user.user_type,
      reportedId: receiverIdTemp,
      reportedName: tempName,
      reportedUserType: tempUserType,
      reason: reason,
    });
  };

  const scrollRef = useRef();

  useEffect(() => {
    setBlockedValue(conversation?.blocked);
  }, [conversation]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data.conversation._id === conversation._id) {
        console.log(
          "^^^^^^^^^ INSIDE GETMESSAGES ^^^^^^^^^^",
          window.location.pathname,
          data
        );
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
        console.log("((((((())))))) INSIDE GETMESSAGES )))))))))", messages);
      }
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
    // setLoadConversations((prevLoadConversations) => prevLoadConversations + 1);
  }, [arrivalMessage]);

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

      conversation.lastMessage = newMessage;

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
        console.log(
          "$%$%$%$%$%$%$%$%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
          conversation
        );
        socket.emit("sendMessage", {
          senderId: user._id,
          senderName: user.name,
          receiverId: receiverIdTemp,
          conversation: conversation,
          text: newMessage,
        });
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
    conversation.blocked = status;
    conversation.blockedUser = status
      ? conversation?.members.find((m) => m !== user?._id)
      : null;
    try {
      await axios
        .put(
          `http://localhost:4000/api/v1/conversations/updateConversation?conversationId=${conversation?._id}`,
          {
            blocked: status,
            blockedUser: conversation.blockedUser,
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

      const receiverName = chattedUsers[receiverIdTemp]?.name;
      const receiver_user_type = chattedUsers[receiverIdTemp]?.user_type;

      socket.emit("changeBlockedStatus", {
        senderId: user._id,
        senderName: user.name,
        receiverIdArg: receiverIdTemp,
        receiverName: receiverName,
        receiver_user_type: receiver_user_type,
        blockedStatus: status,
      });

      socket.emit(
        "reloadConversations",
        conversation?.members.find((m) => m !== user?._id)
      );
      
      setBlockedValue(true); // Update blocked state
      handleCloseBlockingPrompt();

    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockPromptOpen = () => {
    setShowBlockingPrompt(true);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatting">
      <AppBar
        position="static"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "60px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "15px",
          }}
        >
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
              sx={{ width: 26, height: 26 }}
            />
          </IconButton>
          <Typography variant="h6" flexGrow={1} sx={{ pt: 0, ml: 0 }}>
            {
              chattedUsers[conversation?.members.find((m) => m !== user?._id)]
                ?.name
            }
          </Typography>
        </div>
        {user.user_type !== "admin" ? (
          <div>
            {chattedUsers[conversation?.members.find((m) => m !== user?._id)]
              .user_type === "admin" ? null : (
              <>
                {user.user_type !== "student" &&
                conversation.blockedUser !== user._id ? (
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: blocked ? "#00FF00" : "#FF0000",
                      marginLeft: "12px",
                      fontSize: "16px",
                    }}
                    className="IconButton"
                    onClick={blockBtController}
                  >
                    {blocked ? "Unblock" : "Block"}
                  </Button>
                ) : null}
                <IconButton
                  style={{ marginRight: "5px" }}
                  size="large"
                  aria-label="display more actions"
                  edge="end"
                  onClick={handleReport}
                >
                  <ReportIcon style={{ color: "#FF0000" }} />
                </IconButton>
              </>
            )}
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
        {/* </StyledToolbar> */}
      </AppBar>
      {/* <Messages /> */}
      <ReactScrollToBottom className="messages">
        {messages.map((m) => (
          <Message owner={m.sender === user._id} message={m} />
        ))}
      </ReactScrollToBottom>
      <div>
        {conversation.blockedUser !== user._id ? (
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
        message={`You have been ${blocked ? "blocked" : "unblocked"} by ${
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