import { React, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";
import ChatWelcome from "../components/ChatWelcome";
import Chatting from "../components/Chatting";
import { Route, Routes } from "react-router-dom";

const Chat = () => {
  // const { user } = useUserContext();
  // const { socket } = useSocketContext();

  // useEffect(() => {
  //   console.log("socket#$#$#$#$#$#$#$#$#$#$#", socket, socket.id);
  //   socket.emit("addUser", user?._id);
  //   socket.on("getUsers", (users) => {
  //     console.log(users);
  //   });
  // });
  const [loadConversations, setLoadConversations] = useState(null);

  return (
    <div className="chatContainer">
      <Sidebar
        loadConversations={loadConversations}
        setLoadConversations={setLoadConversations}
      />
      <Routes>
        <Route path="welcome" element={<ChatWelcome />} />
        <Route
          path="chatting"
          element={<Chatting setLoadConversations={setLoadConversations} />}
        />
      </Routes>
    </div>
  );
};

export default Chat;
