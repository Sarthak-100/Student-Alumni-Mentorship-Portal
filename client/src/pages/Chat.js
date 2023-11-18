import { React, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useSocketContext } from "../context/SocketContext";

const Chat = () => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    console.log("socket#$#$#$#$#$#$#$#$#$#$#", socket, socket.id);
    socket.emit("addUser", user?._id);
    socket.on("getUsers", (users) => {
      console.log(users);
    });
  });

  return (
    <div className="chatContainer">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Chat;
