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

const UserCard = (props) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { setReceiverIdValue } = useReceiverIdContext();

  const handleChat = () => {
    setReceiverIdValue(props.cardUser._id);
    navigate("/chat/welcome");
  };

  // Destructure the nested location object
  const { city, state, country } = props.cardUser.location || {};

  // Log props.cardUser to check its structure and the organization data
  console.log("Card User Data:", props.cardUser);

  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{props.cardUser.name.charAt(0)}</Avatar>}
        title={props.cardUser.name}
        subheader={props.cardUser.email}
      />
      <CardContent>
        <Typography variant="body1">
          Current Work: {props.cardUser.work.role}
        </Typography>
        <Typography variant="body1">Branch: {props.cardUser.branch}</Typography>
        <Typography variant="body1">Batch: {props.cardUser.batch}</Typography>

        {/* Render Organization Name */}
        <Typography variant="body1">
          Organization: {props.cardUser.work.organization}
        </Typography>

        {/* Render Location details */}
        <Typography variant="body1">
          Location: {city}, {state}, {country}
        </Typography>
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
