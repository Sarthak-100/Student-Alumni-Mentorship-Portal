import React from "react";
import { Button } from "@mui/material";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

const Notification = (props) => {
  const navigate = useNavigate();
  const { receiverId, setReceiverIdValue } = useReceiverIdContext();

  const notificationStyle = {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginBottom: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "12px",
  };

  const headerStyle = {
    marginBottom: "6px",
    color: "#333",
  };

  const bodyStyle = {
    marginBottom: "6px",
    color: "#555",
  };

  const footerStyle = {
    color: "#888",
  };

  const handleChatButton = async () => {
    await setReceiverIdValue(props.notification.senderId);
    navigate("/chat/welcome");
  };

  return (
    <div style={notificationStyle}>
      <div
        className="notification-content"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={headerStyle}>
            <strong>From:</strong> {props.notification.senderName}
          </div>
          <div style={bodyStyle}>
            <strong>Message:</strong> {props.notification.message}
          </div>
          <div style={footerStyle}>
            <small>{format(props.notification.createdAt)}</small>
          </div>
        </div>
        {props.notification.messageType === "message" ||
        props.notification.messageType === "chatMessage" ? (
          <Button
            style={{
              textTransform: "none",
              marginBottom: "5px",
            }}
            variant="contained"
            onClick={handleChatButton}
          >
            Chat
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Notification;