import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useChattedUsersContext } from "../context/ChattedUsers";
import axios from 'axios';

const ChatCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

const ChatUser = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

const ChatMessage = styled(Typography)(({ theme }) => ({
  color: '#333',
}));

const ChatTime = styled(Typography)(({ theme }) => ({
  color: '#666',
  fontSize: '0.8rem',
}));

const RecentChats = () => {
    const [chats, setChats] = useState([]);
  
    useEffect(() => {
      const fetchChats = async () => {
        try {
          // Fetch conversation details
          const conversationsResponse = await axios.get('http://localhost:4000/api/v1/conversations/getConversations?user_id=6557abab3edbce75ade9d46f');
          const conversations = conversationsResponse.data;
  
          const userIds = conversations.map(conv => conv.members.find(memberId => memberId !== '6557abab3edbce75ade9d46f'));
  
          // Fetch user profiles based on IDs
          const usersData = await Promise.all(
            userIds.map(userId =>
              axios.get(`http://localhost:4000/api/v1/users/getUserProfile?id=${userId}`)
            )
          );
  
          const usersNames = usersData.map(userData => userData.data.user.name);
  
          // Combine user names and chat times from conversations
          const chatsWithTime = conversations.map((conv, index) => ({
            user: usersNames[index],
            time: new Date(conv.createdAt).toLocaleString(), // Use chat time from API
          }));
  
          setChats(chatsWithTime.slice(0, 2)); // Limit to first 2 chats
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchChats();
    }, []); // Empty dependency array to run the effect only once
  
    return (
      <div>
        {chats.length > 0 ? (
          chats.map((chat, index) => (
            <ChatCard key={index}>
              <CardContent>
                <ChatUser variant="subtitle1">
                  {chat.user} {/* Displaying user's name */}
                </ChatUser>
                <ChatTime variant="caption">
                  {chat.time} {/* Displaying chat time */}
                </ChatTime>
              </CardContent>
            </ChatCard>
          ))
        ) : (
          <Typography variant="body1">No recent chats</Typography>
        )}
      </div>
    );
  };
  
  export default RecentChats;