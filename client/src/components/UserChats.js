import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useConversationContext } from "../context/ConversationContext";
import { useChattedUsersContext } from "../context/ChattedUsers";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserChats = (props) => {
  const [user, setUser] = useState(null);
  const { conversation, setConversationValue } = useConversationContext();

  const { setChattedUsersValue } = useChattedUsersContext();

  const { receiverId } = useReceiverIdContext();

  const navigate = useNavigate();

  // useEffect(() => {
  //   const friendId = props.conversation?.members.find(
  //     (m) => m !== props.currentUser?._id
  //   );
  //   if (receiverId === friendId) {
  //     setConversationValue(props.conversation);
  //   }
  //   console.log("in useEffect for prev chat click");
  //   console.log("RECEIVER ID", receiverId);
  //   console.log("FRIEND ID", friendId);
  //   console.log("CONVERSATION", conversation);
  //   if (conversation) {
  //     navigate("chatting");
  //   }
  // }, []);

  useEffect(() => {
    console.log("INSIDE USER CHATS:", props.conversation);
    const friendId = props.conversation?.members.find(
      (m) => m !== props.currentUser?._id
    );
    const getUser = async () => {
      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@", friendId);
      await axios
        .get(
          `http://localhost:4000/api/v1/users/getUserProfile?id=${friendId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setUser(response.data.user);
          setChattedUsersValue(friendId, response.data.user);
          console.log("&&&&&&In User CHat", friendId, response.data.user);
          if (receiverId === friendId) {
            setConversationValue(props.conversation);
          }
          if (
            conversation !== null &&
            props.conversation._id === conversation._id
          ) {
            setConversationValue(props.conversation);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    };
    getUser();
  }, [props.currentUser, props.conversation]);
  // const navigate = useNavigate();
  return (
    <div
      className="userChats"
      // onClick={() => {
      //   setConversationValue(props.conversation);
      //   navigate("chatting");
      // }}
    >
      <img className="img" src={user?.img} alt="user" />
      <div className="chatInfo">
        <span className="span">{user?.name}</span>
        <p className="lastMessage">
          {props.conversation.lastMessage?.length > 30
            ? props.conversation.lastMessage.substring(0, 30) + "..."
            : props.conversation.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default UserChats;
