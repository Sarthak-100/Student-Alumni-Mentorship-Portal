import React from "react";
import UserChats from "./UserChats";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";
import { useConversationContext } from "../context/ConversationContext";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { formatDistanceToNow, format, set } from "date-fns";

const PreviousChats = ({ loadConversations, setLoadConversations }) => {
  const [conversations, setConversations] = useState([]);

  const { user } = useUserContext();

  const { conversation, setConversationValue } = useConversationContext();

  const { receiverId, setReceiverIdValue } = useReceiverIdContext();

  const { socket } = useSocketContext();

  // const divRef = useRef(null);
  // const [isOverflowing, setIsOverflowing] = useState(false);

  // useEffect(() => {
  //   const container = divRef.current;

  //   if (container) {
  //     // Check if the content overflows horizontally or vertically
  //     const isVerticallyOverflowing =
  //       container.scrollHeight > container.clientHeight;

  //     setIsOverflowing(isVerticallyOverflowing);
  //   }
  // }, []);

  useEffect(() => {
    const getConversations = async () => {
      try {
        console.log("!!!!!!!!!!!!!!inside getConversations", user);
        await axios
          .get(
            `http://localhost:4000/api/v1/conversations/getConversations?user_id=${user._id}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            const conversationsTemp = response.data;
            conversationsTemp.sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            if (receiverId) {
              const dictionaryWithElement = conversationsTemp.find((dict) =>
                dict?.members.includes(receiverId)
              );
              let conv;
              console.log("dictionaryWithElement", dictionaryWithElement);
              console.log("receiverId", receiverId);
              if (dictionaryWithElement) {
                setConversations(conversationsTemp);
              } else {
                conv = {
                  _id: null,
                  members: [user?._id, receiverId],
                  unseenMessages: {
                    [String(user._id)]: 0,
                    [String(receiverId)]: 0,
                  },
                };
                setConversations([conv, ...conversationsTemp]);
              }
            } else {
              setConversations(conversationsTemp);
            }
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [loadConversations]);

  console.log(socket);

  useEffect(() => {
    console.log(socket);
    socket.on("receiveNewConversation&Message", (data) => {
      setLoadConversations(
        (prevLoadConversations) => prevLoadConversations + 1
      );
    });
    return () => {
      socket.off("receiveNewConversation&Message");
    };
  });

  useEffect(() => {
    socket.on("updateLastAndUnseenMessage", async (data) => {
      console.log("in updateLastAndUnseenMessage");
      console.log("data", data);
      console.log("conversation", conversation);
      if (data.conversation._id !== conversation._id) {
        try {
          let unseenMessagesT = data.conversation.unseenMessages;
          unseenMessagesT[data.receiverId] =
            data.conversation.unseenMessages[data.receiverId] + 1;
          console.log("unseenMessagesT", unseenMessagesT);
          console.log(
            "+1 from unseenMessagesT",
            unseenMessagesT[data.receiverId] + 1
          );
          console.log(
            "+1 from data.conversation",
            data.conversation.unseenMessages[data.receiverId] + 1
          );
          await axios
            .put(
              `http://localhost:4000/api/v1/conversations/updateConversation?conversationId=${data.conversation._id}`,
              {
                unseenMessages: unseenMessagesT,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              socket.emit("reloadConversations", data.senderId);
              setLoadConversations(
                (prevLoadConversations) => prevLoadConversations + 1
              );
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        setLoadConversations(
          (prevLoadConversations) => prevLoadConversations + 1
        );
      }
    });
    socket.on("receiveReloadConversations", async (data) => {
      setLoadConversations(
        (prevLoadConversations) => prevLoadConversations + 1
      );
    });
    return () => {
      socket.off("updateLastAndUnseenMessage");
      socket.off("receiveReloadSenderConversations");
    };
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleSelectedConversation = async () => {
      console.log("in useEffect for prev chat click");
      console.log("CONVERSATION", conversation);
      if (conversation) {
        navigate("chatting");
        // }
        if (conversation.unseenMessages[user._id] > 0) {
          conversation.unseenMessages[user._id] = 0;
          try {
            await axios
              .put(
                `http://localhost:4000/api/v1/conversations/updateConversation?conversationId=${conversation._id}`,
                {
                  unseenMessages: conversation.unseenMessages,
                },
                {
                  withCredentials: true,
                }
              )
              .then((response) => {})
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
          const otherMember = conversation?.members.find(
            (m) => m !== user?._id
          );
          socket.emit("reloadConversations", otherMember);
        }
      }
      if (receiverId !== null && conversation?._id === null) {
        setReceiverIdValue(null);
      }
    };
    handleSelectedConversation();
  }, [conversation]);

  return (
    <div
      // ref={divRef}
      // className={isOverflowing ? "previousChatsScrollable" : "previousChats"}
      className="previousChats"
      // style={{ overflow: isOverflowing ? "scroll" : "hidden" }}
    >
      {conversations.map((c) => (
        <div
          className="userChatsContainer"
          style={{
            backgroundColor:
              conversation?._id === c._id ? "#2f2d52" : "transparent",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => setConversationValue(c)}
          onMouseOver={(event) =>
            (event.currentTarget.style.backgroundColor = "#2f2d52")
          }
          onMouseOut={(event) =>
            (event.currentTarget.style.backgroundColor =
              conversation?._id === c._id ? "#2f2d52" : "transparent")
          }
        >
          <UserChats conversation={c} currentUser={user} />
          {c?.unseenMessages[user._id] > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "60px",
                marginTop: "0px",
                paddingRight: "10px",
              }}
            >
              <p
                className="chatMessageTime"
                style={{ marginTop: "3px", marginRight: "5px" }}
              >
                {formatDistanceToNow(new Date(c.updatedAt)).indexOf("day") !==
                -1
                  ? formatDistanceToNow(new Date(c.updatedAt))
                  : format(new Date(c.updatedAt), "HH:mm")}
              </p>
              <Badge
                style={{ marginRight: "30px" }}
                badgeContent={c.unseenMessages[user._id]}
                color="secondary"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default PreviousChats;
