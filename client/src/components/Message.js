import React from "react";
import { format } from "timeago.js";

const Message = (props) => {
  // console.log(props);
  return (
    <div className={props.owner ? "msg_content owner" : "msg_content"}>
      <p className="msg_text">{props.message.text}</p>
      {/* <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className='msg_img'/> */}
      <span className="msg_time">{format(props.message.createdAt)}</span>
    </div>
  );
};

export default Message;
