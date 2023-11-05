import React from 'react'

const Message = (props: { value: string, time: string }) => {
  return (
    <div className='msg_content'>
        <p className='msg_text'>{props.value}</p>
        {/* <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className='msg_img'/> */}
        <span className='msg_time'>{props.time}</span>
    </div>
  )
}

export default Message
