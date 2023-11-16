import React from "react";
import UserChats from "./UserChats";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";
import { useConversationContext } from "../context/ConversationContext";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // Generate a random number between min (inclusive) and max (exclusive)
  return Math.floor(Math.random() * (max - min)) + min;
}

const data = [
  { email: "a11@iiitd.ac.in", password: "s1p", user_type: "student" },
  { email: "a22@iiitd.ac.in", password: "s2p", user_type: "student" },
  { email: "a33@iiitd.ac.in", password: "s3p", user_type: "student" },
];

const PreviousChats = () => {
  const { setSocketValue } = useSocketContext();

  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  // const [currentChat, setCurrentChat] = useState(null);

  const socket = useRef();

  const { login } = useUserContext();

  const { conversation, setConversationValue } = useConversationContext();

  const { receiverId } = useReceiverIdContext();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    setSocketValue(socket);
  }, []);

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const jsonData = data[getRandomInt(0, 3)];
        const queryParams = new URLSearchParams(jsonData).toString();
        await axios
          .get(`http://localhost:4000/api/v1/users/login?${queryParams}`, {
            withCredentials: true,
          })
          .then((response) => {
            console.log("user logged in");
            console.log(response);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error("Login failed:", error);
      }
    };
    handleLogin();

    const getMyProfile = async () => {
      try {
        await axios
          .get(`http://localhost:4000/api/v1/users/myProfile`, {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response);
            setUser(response.data);
            login(response.data);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error("fetch Profile failed:", error);
      }
    };

    getMyProfile();
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user?._id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        await axios
          .get("http://localhost:4000/api/v1/conversations/getConversations", {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response);
            if (receiverId) {
              const isElementPresent = response.data.find((dict) =>
                dict.members.includes(receiverId)
              );
              if (isElementPresent) {
              } else {
              }
            } else {
              setConversations(response.data);
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
  }, [user?._id]);

  console.log(socket);

  // console.log(currentChat);

  const navigate = useNavigate();

  useEffect(() => {
    if (conversation) {
      navigate("chatting");
    }
  }, [conversation]);

  return (
    <div className="previousChats">
      {/* {
        if(directedFromChatSection){
          conversation.push({
            "_id": null,
            "members": [
                "60e9c3c8f1a0f1f6d0e1f6a1",
                "60e9c3c8f1a0f1f6d0e1f6a2"
            ],
          })
        }
      } */}
      {conversations.map((c) => (
        <div onClick={() => setConversationValue(c)}>
          <UserChats conversation={c} currentUser={user} />
        </div>
      ))}
    </div>
  );
};

export default PreviousChats;
