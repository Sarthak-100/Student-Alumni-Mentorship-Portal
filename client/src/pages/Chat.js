import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom';

const Chat = () => {
  return (
    <div className='chatContainer'>
        <Sidebar />
        <Outlet />
    </div>
  )
}

export default Chat