import React from "react";
import { format } from "timeago.js";

const Message = (props) => {
  return (
    <div className={props.owner ? "msg_content owner" : "msg_content"}>
      <p className="msg_text">{props.message.text}</p>
      <span className="msg_time">{format(props.message.createdAt)}</span>
    </div>
  );
};

export default Message;