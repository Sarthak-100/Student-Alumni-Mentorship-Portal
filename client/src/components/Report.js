import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import axios from "axios";
import { format } from "timeago.js";
import { useSocketContext } from "../context/SocketContext";

const Report = (props) => {
  const navigate = useNavigate();
  const { receiverId, setReceiverIdValue } = useReceiverIdContext();

  const { socket } = useSocketContext();

  const [openResolvedDialog, setOpenResolvedDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

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
    marginTop: "6px",
    color: "#888",
  };

  const handleChatWithReporter = async (e) => {
    await setReceiverIdValue(props.report.reporterId);
    navigate("/chat/welcome");
  };

  const handleChatWithReported = async (e) => {
    await setReceiverIdValue(props.report.reportedId);
    navigate("/chat/welcome");
  };

  const handleRemoveUser = async (e) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/users/removeUser?id=${props.report.reportedId}&user_type=${props.report.reportedUserType}`,
        {
          withCredentials: true,
        }
      );
      console.log("User removed:", props.report.reportedUserType, response);
      setOpenRemoveDialog(true);
      socket.emit("sendRemoveUserNotification", {
        removedUserId: props.report.reportedId,
      });
      const response2 = await axios.put(
        `http://localhost:4000/api/v1/reports/updateResolvedStatus?id=${props.report._id}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleResolved = async (e) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/reports/updateResolvedStatus?id=${props.report._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Issue resolved:", response);
      setOpenResolvedDialog(true);
      socket.emit("sendResolvedNotification", {
        receiverId: props.report.reporterId,
        senderName: "Admin",
        reason: props.report.reason,
        reportedName: props.report.reportedName,
        reportedUserType: props.report.reportedUserType,
      });
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenResolvedDialog(false);
    setOpenRemoveDialog(false);
    props.onReportResolved(props.report._id);
  };

  return (
    <div style={notificationStyle}>
      <div className="notification-content">
        <div style={headerStyle}>
          <strong>Reporter:</strong>{" "}
          {props.report.reporterUserType === "student" ? "Student" : "Alumni"} -
          {">"}
          {props.report.reporterName}
        </div>
        <div style={headerStyle}>
          <strong>Reported:</strong>{" "}
          {props.report.reportedUserType === "student" ? "Student" : "Alumni"} -
          {">"} {props.report.reportedName}
        </div>
        <div style={bodyStyle}>
          <strong>Reason:</strong> {props.report.reason}
        </div>
        <Button
          style={{ textTransform: "none" }}
          variant="contained"
          onClick={handleChatWithReporter}
        >
          Chat With {props.report.reporterName}
        </Button>
        <Button
          style={{ marginLeft: "13px", textTransform: "none" }}
          variant="contained"
          onClick={handleChatWithReported}
        >
          Chat With {props.report.reportedName}
        </Button>
        <Button
          style={{
            marginLeft: "13px",
            backgroundColor: "#00FF00",
            textTransform: "none",
          }}
          variant="contained"
          onClick={handleResolved}
        >
          Mark as Resolved
        </Button>
        <Button
          style={{
            marginLeft: "13px",
            backgroundColor: "#FF0000",
            textTransform: "none",
          }}
          variant="contained"
          onClick={handleRemoveUser}
        >
          Remove{" "}
          {props.report.reportedUserType === "student" ? "Student" : "Alumni"}
        </Button>
        <div style={footerStyle}>
          <small>{format(props.report.createdAt)}</small>
        </div>
      </div>

      <Dialog open={openResolvedDialog} onClose={handleDialogClose}>
        <DialogTitle>{"Issue Resolved"}</DialogTitle>
        <DialogContent>
          <DialogContentText>The issue has been resolved.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRemoveDialog} onClose={handleDialogClose}>
        <DialogTitle>{"Student/Alumni Removed"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The{" "}
            {props.report.reportedUserType === "student" ? "Student" : "Alumni"}{" "}
            has been removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Report;