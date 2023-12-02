import React from "react";

const Notification = ({ from, message, time }) => {
  const notificationStyle = {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '12px',
  };

  const headerStyle = {
    marginBottom: '6px',
    color: '#333',
  };

  const bodyStyle = {
    marginBottom: '6px',
    color: '#555',
  };

  const footerStyle = {
    color: '#888',
  };

  return (
    <div style={notificationStyle}>
      <div className="notification-content">
        <div style={headerStyle}>
          <strong>From:</strong> {from}
        </div>
        <div style={bodyStyle}>
          <strong>Message:</strong> {message}
        </div>
        <div style={footerStyle}>
          <small>{time}</small>
        </div>
      </div>
    </div>
  );
};

export default Notification;
