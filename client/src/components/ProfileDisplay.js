import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

const ProfileDisplay = ({ open, onClose, userData }) => {
  const { name, email, work, branch, batch, location } = userData || {};
  const { city, state, country } = location || {};

  const titleStyle = {
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  };

  const textStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#555",
    marginBottom: "8px",
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={titleStyle}>{name}'s Profile</DialogTitle>
      <DialogContent>
        <Typography variant="body1" style={textStyle}>
          <strong>Email:</strong> {email}
        </Typography>
        <Typography variant="body1" style={textStyle}>
          <strong>Current Work:</strong> {work && work.role}
        </Typography>
        <Typography variant="body1" style={textStyle}>
          <strong>Branch:</strong> {branch}
        </Typography>
        <Typography variant="body1" style={textStyle}>
          <strong>Batch:</strong> {batch}
        </Typography>
        <Typography variant="body1" style={textStyle}>
          <strong>Organization:</strong> {work && work.organization}
        </Typography>
        <Typography variant="body1" style={textStyle}>
          <strong>Location:</strong> {city}, {state}, {country}
        </Typography>
        {/* Add more details here if needed */}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDisplay;