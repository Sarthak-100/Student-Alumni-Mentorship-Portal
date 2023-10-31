import React from 'react'
import Message from './Message'
import MessageOwner from './MessageOwner'

const Messages = () => {
  return (
    <div className='messages'>
      <MessageOwner value={"hi"} time={"9:00 AM"}/>
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
      <Message value={"that was really frustating for us."} time={"11:11 AM"}/>
    </div>
  )
}

export default Messages
