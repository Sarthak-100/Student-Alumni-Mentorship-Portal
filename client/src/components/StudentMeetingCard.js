import React from "react";
import { Card, CardContent, Typography, } from "@mui/material";

const StudentMeetingCard = ({ meeting }) => {
  const cardStyle = {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginBottom: "5px", // Increased margin for better separation
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "5px", // Increased padding for better spacing
  };

  const bodyStyle = {
    marginBottom: "5px", 
    color: "#555",
    fontSize: "1rem", 
  };

  return (
    <Card variant="outlined" sx={{ width: "100%", ...cardStyle }}>
      <CardContent>
        <Typography variant="body1" color="text.secondary" style={bodyStyle}>
          <strong>Alumni:</strong> {meeting.alumniName}
          <br />
          <strong>Summary:</strong> {meeting.summary}
          <br />
          {meeting.description && (
            <>
              <strong>Description:</strong> {meeting.description}
              <br />
            </>
          )}
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

export default StudentMeetingCard;