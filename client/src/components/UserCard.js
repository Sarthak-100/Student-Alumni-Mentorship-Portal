import { React, useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  CardActions,
  IconButton,
  Grid,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileDisplay from "./ProfileDisplay"; // Importing your ProfileDisplay component

const UserCard = (props) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { receiverId, setReceiverIdValue } = useReceiverIdContext();
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChat = async () => {
    console.log("USER CARD inside handleChat", props.cardUser._id, user._id);
    await setReceiverIdValue(props.cardUser._id);
    // useEffect(() => {
    //   console.log("USER CARD inside handleChat", receiverId);
    // }, [receiverId]);
    navigate("/chat/welcome");
  };

  // Destructure the nested location object
  const { city, state, country } = props.cardUser.location || {};

  const handleProfile = () => {
    setSelectedUser(props.cardUser); // Store the selected user data
    setOpenProfile(true); // Open the profile dialog
  };

  const cardStyle = {
    maxWidth: 300,
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#333",
  };

  const subheaderStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#555",
  };

  const contentStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#777",
  };

  return (
    <Card style={cardStyle}>
      <CardHeader

        avatar={<Avatar>{props.cardUser?.name.charAt(0)}</Avatar>}
        title={
          <Typography variant="h6" style={titleStyle}>
            {props.cardUser?.name}
          </Typography>
        }
        subheader={
          <Typography variant="body2" style={subheaderStyle}>
            {props.cardUser?.email}
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Current Work:</strong> {props.cardUser?.work.role}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Branch:</strong> {props.cardUser?.branch}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Batch:</strong> {props.cardUser?.batch}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Organization:</strong>{" "}
              {props.cardUser?.work.organization}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Location:</strong> {city}, {state}, {country}
            </Typography>
          </Grid>
        </Grid>

      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        <IconButton color="primary" aria-label="Chat">
          <ChatIcon />
        </IconButton>
        {/* Trigger ProfileDisplay dialog */}
        <IconButton
          color="primary"
          aria-label="Profile"
          onClick={handleProfile}
        >
          <AccountCircleIcon />
        </IconButton>
      </CardActions>
      {/* Display the profile dialog */}
      {selectedUser && (
        <ProfileDisplay
          open={openProfile}
          onClose={() => setOpenProfile(false)}
          userData={selectedUser}
        />
      )}
    </Card>
  );
};

export default UserCard;
