import React from 'react'
import { Input, Button } from '@mui/material';
// import { wrap } from 'module';

const SendMessage = () => {
  return (
    <div className="sendMsg">
        <Input placeholder="Type a message" className='input'/>
        <Button variant="contained" color="primary" className='button'>Send</Button>
    </div>
  )
}

export default SendMessage
