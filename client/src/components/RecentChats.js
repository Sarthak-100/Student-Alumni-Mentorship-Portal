import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReceiverIdContext } from "../context/ReceiverIdContext";

const ChatCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

const ChatUser = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));

const ChatTime = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "0.8rem",
}));

const RecentChats = () => {
  const [chats, setChats] = useState([]);
  const { user } = useUserContext();

  const { setReceiverIdValue } = useReceiverIdContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Fetch conversation details
        const conversationsResponse = await axios.get(
          `http://localhost:4000/api/v1/conversations/getConversations?user_id=${user._id}`
        );
        const conversations = conversationsResponse.data;

        // Sort conversations by createdAt timestamp in descending order (most recent first)
        conversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        const userIds = conversations.map((conv) =>
          conv.members.find(
            (memberId) => memberId !== user._id // Get the other user's ID
          )
        );

        // Fetch user profiles based on IDs
        const usersData = await Promise.all(
          userIds.map((userId) =>
            axios.get(
              `http://localhost:4000/api/v1/users/getUserProfile?id=${userId}`
            )
          )
        );

        const usersNames = usersData.map((userData) => userData.data.user.name);

        // Combine user names and chat times from conversations
        const chatsWithTime = conversations.map((conv, index) => ({
          user: usersNames[index],
          userId: userIds[index],
          time: new Date(conv.updatedAt).toLocaleString(), // Use chat time from API
        }));

        setChats(chatsWithTime.slice(0, 2)); // Limit to first 2 chats
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchChats();
  }, []);

  const formatChatTime = (time) => {
    const [dateStr, timeStr] = time.split(', ');
    const [hours, minutes] = timeStr.split(':').slice(0, 2);
    const formattedTimeString = `${dateStr}, ${hours}:${minutes}`;
    return formattedTimeString;
  };

  const handleChatButton = async (e) => {
    console.log("WWWWWWW", e.target.value);
    await setReceiverIdValue(e.target.value);
    navigate("/chat/welcome");
  };

  return (
    <div>
      {chats.length > 0 ? (
        chats.map((chat, index) => (
          <>
            <ChatCard
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <ChatUser variant="subtitle1" sx={{ fontSize: '1.1rem' }}>
                  {chat.user} {/* Displaying user's name */}
                </ChatUser>
                <ChatTime variant="caption" sx={{ fontSize: '1rem' }}>
                  {formatChatTime(chat.time)} {/* Displaying formatted chat time */}
                </ChatTime>
              </CardContent>
              <Button
                style={{
                  textTransform: "none",
                  marginBottom: "5px",
                }}
                variant="contained"
                onClick={handleChatButton}
                value={chat.userId}
              >
                Chat
              </Button>
            </ChatCard>
          </>
        ))
      ) : (
        <Typography variant="body1">No recent chats</Typography>
      )}
    </div>
  );
};

export default RecentChats;