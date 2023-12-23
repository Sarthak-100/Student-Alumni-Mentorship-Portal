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
import { formatDistanceToNow, format } from "date-fns";

// import { useLoadConversationsContext } from "../context/LoadConversationsContext";

const PreviousChats = ({ loadConversations, setLoadConversations }) => {
  const [conversations, setConversations] = useState([]);
  // const { loadConversations } = useLoadConversationsContext();

  // const [loadConversations, setLoadConversations] = useState(null);

  const { user } = useUserContext();

  const { conversation, setConversationValue } = useConversationContext();

  const { receiverId, setReceiverIdValue } = useReceiverIdContext();

  // console.log("in Welcome", "000000000000000000000000", receiverId);

  const { socket } = useSocketContext();

  // const tempSetConversationValue = async (c) => {
  //   setConversationValue(c);
  // };

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
                // setConversationsTemp(response.data);
                // await setConversationValue(dictionaryWithElement);
                // setReceiverIdValue(null);
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
                // setConversationsTemp([conv, ...response.data]);
                // setConversationValue(conv);
                // setConversations((prevConversations) => [
                //   conv,
                //   ...res,
                // ]);
              }
              // console.log("------------+++++++++", conv);
              // setConversationValue(conv);
            } else {
              setConversations(conversationsTemp);
              // setConversationsTemp(response.data);
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
      // console.log("in receiveNewConversation&Message");
      setLoadConversations(
        (prevLoadConversations) => prevLoadConversations + 1
      );
    });
    return () => {
      socket.off("receiveNewConversation&Message");
    };
  });

  // console.log(currentChat);

  const navigate = useNavigate();

  useEffect(() => {
    const handleSelectedConversation = async () => {
      console.log("in useEffect for prev chat click");
      console.log("CONVERSATION", conversation);
      // console.log("#$#$@#@#", conversation.unseenMessages);
      // console.log("user", typeof user._id);
      // console.log("$^%^%", conversation.unseenMessages[user._id]);
      // console.log(Object.keys(conversation.unseenMessages));

      if (conversation) {
        navigate("chatting");
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
        }
      }
      if (receiverId !== null && conversation?._id === null) {
        setReceiverIdValue(null);
      }
    };
    handleSelectedConversation();
  }, [conversation]);

  return (
    <div className="previousChats">
      {conversations.map((c) => (
        <div
          className="userChatsContainer"
          style={{
            backgroundColor:
              conversation?._id === c._id ? "#2f2d52" : "transparent",
            // display: "flex",
            // flexDirection: "row",
            // justifyContent: "space-between",
            // alignItems: "center",
            // marginTop: "19px",
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
