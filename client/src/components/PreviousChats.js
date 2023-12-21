import React from "react";
import UserChats from "./UserChats";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";
import { useConversationContext } from "../context/ConversationContext";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useNavigate } from "react-router-dom";
// import { useLoadConversationsContext } from "../context/LoadConversationsContext";

const PreviousChats = () => {
  const [conversations, setConversations] = useState([]);
  // const { loadConversations } = useLoadConversationsContext();

  const [loadConversations, setLoadConversations] = useState(null);

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
            if (receiverId) {
              const dictionaryWithElement = response.data.find((dict) =>
                dict?.members.includes(receiverId)
              );
              let conv;
              console.log("dictionaryWithElement", dictionaryWithElement);
              console.log("receiverId", receiverId);
              if (dictionaryWithElement) {
                setConversations(response.data);
                // setConversationsTemp(response.data);
                // await setConversationValue(dictionaryWithElement);
                // setReceiverIdValue(null);
              } else {
                conv = {
                  _id: null,
                  members: [user?._id, receiverId],
                };
                setConversations([conv, ...response.data]);
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
              setConversations(response.data);
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
    console.log("in useEffect for prev chat click");
    console.log("CONVERSATION", conversation);
    if (conversation) {
      navigate("chatting");
    }
  }, [conversation]);

  return (
    <div className="previousChats">
      {conversations.map((c) => (
        <div onClick={() => setConversationValue(c)}>
          <UserChats conversation={c} currentUser={user} />
        </div>
      ))}
    </div>
  );
};

export default PreviousChats;
