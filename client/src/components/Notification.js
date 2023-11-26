import React from "react";

const Notification = ({ from, message, time }) => {
  return (
    <div className="notification">
      <div className="notification-header">
        <strong>From:</strong> {from}
      </div>
      <div className="notification-body">
        <strong>Message:</strong> {message}
      </div>
      <div className="notification-footer">
        <small>{time}</small>
      </div>
    </div>
  );
};

export default Notification;
