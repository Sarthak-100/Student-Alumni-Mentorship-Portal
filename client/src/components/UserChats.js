import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useConversationContext } from "../context/ConversationContext";
import { useChattedUsersContext } from "../context/ChattedUsers";
import axios from "axios";

const UserChats = (props) => {
  const [user, setUser] = useState(null);
  // const { setConversationValue } = useConversationContext();

  const { setChattedUsersValue } = useChattedUsersContext();

  useEffect(() => {
    const friendId = props.conversation.members.find(
      (m) => m !== props.currentUser?._id
    );
    const getUser = async () => {
      // console.log();
      await axios
        .get(
          `http://localhost:4000/api/v1/users/getUserProfile?id=${friendId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          setUser(response.data);
          setChattedUsersValue(friendId, response.data);
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
        <p className="lastMessage">{""}</p>
      </div>
    </div>
  );
};

export default UserChats;
