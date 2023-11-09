import React, { useEffect, useState } from "react";
import Message from "./Message";
import MessageOwner from "./MessageOwner";
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
      {/* <MessageOwner value={"hi"} time={"9:00 AM"}/>
      <MessageOwner value={"Abhit this side, How r u doing?"} time={"9:00 AM"}/>
      <Message value={"Hi Abhit"} time={"11:00 AM"}/>
      <Message value={"I am good, wbu?"} time={"11:01 AM"}/>
      <MessageOwner value={"I am also doing good"} time={"11:05 AM"}/>
      <MessageOwner value= {"I have some doubt related to NLP"} time={"11:06 AM"}/>
      <Message value={"Yeah, sure ask?"} time={"11:07 AM"}/>
      <Message value={"I took that course..."} time={"11:07 AM"}/>
      <MessageOwner value={"That's great"} time={"11:09 AM"}/>
      <MessageOwner value={"Do the papers which sir assigns, came in your end sem exam?"} time={"11:09 AM"}/>
      <Message value={"Bro in our time, actually they did not came."} time={"11:10 AM"}/>
      <Message value={"On a fun note, we spent around entire day in understanding them but nothing came from them"} time={"11:11 AM"}/>
      <Message value={"that was really frustating for us."} time={"11:11 AM"}/> */}
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
