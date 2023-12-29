import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

const StudentProfileDisplay = ({ open, onClose, userData }) => {
  const { name, email, branch, batch } = userData || {};

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
          <strong>Branch:</strong> {branch}
        </Typography>
        <Typography variant="body1" style={textStyle}>
          <strong>Batch:</strong> {batch}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileDisplay;