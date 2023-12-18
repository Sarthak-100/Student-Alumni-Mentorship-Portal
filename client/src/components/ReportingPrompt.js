// ReportPrompt.js

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

const ReportPrompt = ({ open, onClose, onSubmit }) => {
  const [reportReason, setReportReason] = useState("");

  const handleInputChange = (event) => {
    setReportReason(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(reportReason);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Report
        </Typography>
        <TextField
          label="Reason for Reporting"
          multiline
          maxRows={4}
          value={reportReason}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <IconButton variant="contained" onClick={handleSubmit}>
          Submit Report
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ReportPrompt;
