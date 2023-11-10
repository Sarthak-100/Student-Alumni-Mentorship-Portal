import React from "react";
import { Input, Button } from "@mui/material";
import { sendMeesageBtController } from "./Messages";
// import { wrap } from 'module';

const SendMessage = () => {
  return (
    <div className="sendMsg">
      <Input placeholder="Type a message" className="input" id="chatInput" />
      <Button
        variant="contained"
        color="primary"
        className="button"
        onClick={sendMeesageBtController}
      >
        Send
      </Button>
    </div>
  );
};

export default SendMessage;
