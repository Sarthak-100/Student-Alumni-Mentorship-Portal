import React from 'react'
import {useNavigate} from 'react-router-dom'

const UserChats = (props) => {
    const navigate = useNavigate();
    return (
        <div className='userChats' onClick={()=>{
            navigate("chat");
        }}>
            <img className='img' src={props.imgLink} alt="user" />
            <div className='chatInfo'>
                <span className='span'>{props.name}</span>
                <p className='lastMessage'>{props.lastMessage}</p>
            </div>
        </div>
    )
}

export default UserChats
