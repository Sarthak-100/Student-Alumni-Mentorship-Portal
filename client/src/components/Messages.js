import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

let socket;

const ENDPOINT = "http://localhost:4000";

const user = makeid(5);

let tId = "";

const Messages = () => {
  const [id, setid] = useState("");

  useEffect(() => {
    const socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("connected");
      setid(socket.id);
      tId = socket.id;
    });

    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      console.log(data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      console.log(data.user, data.message);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      console.log(data.user, data.message, data.id);
    });
    return () => {};
  }, []);

  return (
    <div className="messages">
    </div>
  );
};

export default Messages;

function sendMeesageBtController() {
  try {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, tId });
    document.getElementById("chatInput").value = "";
  } catch (err) {
    console.log(err);
  }
}

export { sendMeesageBtController };