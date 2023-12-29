import React from "react";
import { Input, IconButton } from "@mui/material";
import { sendMeesageBtController } from "./Messages";

const SendMessage = () => {
  return (
    <div className="sendMsg">
      <Input placeholder="Type a message" className="input" id="chatInput" />
      <IconButton
        variant="contained"
        color="primary"
        className="IconButton"
        onClick={sendMeesageBtController}
      >
        Send
      </IconButton>
    </div>
  );
};

export default SendMessage;