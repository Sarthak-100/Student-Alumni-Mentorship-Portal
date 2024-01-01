import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AlumniMeetingCard = ({ meeting, onDelete }) => {
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

  const handleDelete = () => {
    // Pass the meeting ID or necessary data to the parent component for deletion
    onDelete(meeting._id, meeting.googleEventId);
  };

  return (
    <Card variant="outlined" sx={{ width: "100%", ...cardStyle }}>
      <CardContent>
        <Typography variant="body1" color="text.secondary" style={bodyStyle}>
          <strong>Attendees:</strong>
          <IconButton
            color="secondary"
            aria-label="Delete Event"
            onClick={handleDelete}
            size="large"
            title="Delete Event"
            sx={{ color: "#C41E3A" }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
          {meeting.attendees.length > 0 ?
            <ol>
              {meeting.attendees.map((attendee, index) => (
                  <li key={index}>
                      {attendee.name} ({attendee.email})
                  </li>
              ))}
            </ol> :
              "None"
          }
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

export default AlumniMeetingCard;