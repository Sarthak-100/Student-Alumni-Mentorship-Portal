import React from "react";

const MessageOwner = (props) => {
  return (
    <div className="msg_content owner">
      <p className="msg_text">{props.value}</p>
      {/* <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className='msg_img'/> */}
      <span className="msg_time">{props.time}</span>
    </div>
  );
};

export default MessageOwner;
