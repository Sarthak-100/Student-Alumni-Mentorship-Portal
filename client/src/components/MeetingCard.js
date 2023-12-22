import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { format } from "timeago.js";

const MeetingCard = ({ meeting }) => {
  const cardStyle = {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginBottom: "20px", // Increased margin for better separation
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "20px", // Increased padding for better spacing
  };

  const headerStyle = {
    marginBottom: "12px", // Increased margin for better separation
    color: "#333",
    fontSize: "1.2rem", // Larger font size for header
    fontWeight: "bold", // Bold font weight
  };

  const bodyStyle = {
    marginBottom: "12px", // Increased margin for better separation
    color: "#555",
    fontSize: "1rem", // Slightly larger font size for body
  };

  const footerStyle = {
    color: "#888",
    fontSize: "0.8rem", // Smaller font size for footer
  };

  return (
    <Card variant="outlined" sx={{ width: "100%", ...cardStyle }}>
      <CardContent>
        <Typography variant="body1" color="text.secondary" style={bodyStyle}>
          <strong>Alumni:</strong> {meeting.alumniName}
          <br />
          <strong>Summary:</strong> {meeting.summary}
          <br />
          <strong>Description:</strong> {meeting.description}
          <br />
          <strong>Start Time:</strong>{" "}
          {new Date(meeting.startDateTime).toLocaleString()}
          <br />
          <strong>End Time:</strong>{" "}
          {new Date(meeting.endDateTime).toLocaleString()}
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
