import React, { useEffect, useState } from "react";
// import SendMessage from "./SendMessage";
// import Messages from "./Messages";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Avatar, Input, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import socketIo from "socket.io-client";
import Message from "./Message";
import MessageOwner from "./MessageOwner";
import ReactScrollToBottom from "react-scroll-to-bottom";
// import { set } from "mongoose";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  // alignItems: 'flex-start',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(1.3),
  // Override media queries injected by theme.mixins.toolbar
  "@media all": {
    minHeight: 35,
  },
}));

function getCurrentTime() {
  const currentDate = new Date();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();
  let meridiem = "AM";

  // Convert hours to 12-hour format
  if (hours > 12) {
    hours -= 12;
    meridiem = "PM";
  }

  // Add leading zero for single digit minutes and seconds
  minutes = (minutes < 10 ? "0" : "") + minutes;
  seconds = (seconds < 10 ? "0" : "") + seconds;

  const formattedTime = hours + ":" + minutes + ":" + seconds + " " + meridiem;
  return formattedTime;
}

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

const Chatting = () => {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);

  const sendMeesageBtController = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("connected");
      setid(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("userJoined", (data) => {
      console.log(data.user, data.message);
    });

    socket.on("welcome", (data) => {
      console.log(data.user, data.message);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, { ...data, time_stamp: getCurrentTime() }]);
      console.log(data.user, data.message, data.id);
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chatting">
      <AppBar position="static">
        <StyledToolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 0 }}
          >
            {/* <MenuIcon /> */}
            <Avatar
              alt="Remy Sharp"
              src="https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600"
              sx={{ width: 24, height: 26 }}
            />
          </IconButton>
          <Typography variant="h6" flexGrow={1} sx={{ pt: 0, ml: 0 }}>
            Rahul
          </Typography>
          <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <VideoCallIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <DownloadIcon />
          </IconButton>
        </StyledToolbar>
      </AppBar>
      {/* <Messages /> */}
      <ReactScrollToBottom className="messages">
        {messages.map((item, i) => (
          <Message
            class_type={item.id === id ? "message owner" : "message"}
            value={item.message}
            time={item.time_stamp}
          />
        ))}
      </ReactScrollToBottom>
      {/* <SendMessage /> */}
      <div className="sendMsg">
        <Input
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMeesageBtController() : null
          }
          placeholder="Type a message"
          className="input"
          id="chatInput"
        />
        <Button
          variant="contained"
          color="primary"
          className="button"
          onClick={sendMeesageBtController}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chatting;
