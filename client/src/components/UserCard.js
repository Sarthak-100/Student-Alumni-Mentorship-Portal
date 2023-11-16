import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useNavigate } from "react-router-dom";

const UserCard = ({ cardUser }) => {
  const navigate = useNavigate();

  const { user } = useUserContext();

  const { setReceiverIdValue } = useReceiverIdContext();

  const handleChat = () => {
    setReceiverIdValue(cardUser._id);
    navigate("/welcome");

    // const queryParams = new URLSearchParams({
    //   senderId: user._id,
    //   receiverId: cardUser._id,
    // }).toString();
    // axios
    //   .get(
    //     `http://localhost:4000/api/v1/conversations/findConversation?${queryParams}`,
    //     {
    //       withCredentials: true,
    //     }
    //   )
    //   .then((response) => {
    //     setReceiverIdValue(cardUser._id);
    //     if (response.data.success) {
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("API Error:", error);
    //   });
  };

  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
        title={user.name}
        subheader={user.email}
      />
      <CardContent>
        <Typography variant="body1">Current Work: {user.work.role}</Typography>
        <Typography variant="body1">Branch: {user.branch}</Typography>
        <Typography variant="body1">Batch: {user.batch}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        <IconButton color="primary" aria-label="Chat" onClick={handleChat}>
          <ChatIcon />
        </IconButton>
        <IconButton color="primary" aria-label="Profile">
          <AccountCircleIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default UserCard;
