import React from "react";

const MessageOwner = (props) => {
  return (
    <div className="msg_content owner">
      <p className="msg_text">{props.value}</p>
      <span className="msg_time">{props.time}</span>
    </div>
  );
};

export default MessageOwner;