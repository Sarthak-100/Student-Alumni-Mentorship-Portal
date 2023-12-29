import React, { useEffect, useState } from "react";
import { useConversationContext } from "../context/ConversationContext";
import { useChattedUsersContext } from "../context/ChattedUsers";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import axios from "axios";

const UserChats = (props) => {
  const [user, setUser] = useState(null);
  const { conversation, setConversationValue } = useConversationContext();

  const { setChattedUsersValue } = useChattedUsersContext();

  const { receiverId } = useReceiverIdContext();

  useEffect(() => {
    console.log("INSIDE USER CHATS:", props.conversation);
    const friendId = props.conversation?.members.find(
      (m) => m !== props.currentUser?._id
    );
    const getUser = async () => {
      await axios
        .get(
          `http://localhost:4000/api/v1/users/getUserProfile?id=${friendId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          let tempUser = response.data.user;
          let user_type = response.data.user_type;
          tempUser.user_type = user_type;
          setUser(tempUser);
          setChattedUsersValue(friendId, tempUser);
          console.log("&&&&&&In User CHat", friendId, tempUser);
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
  return (
    <div
      className="userChats"
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