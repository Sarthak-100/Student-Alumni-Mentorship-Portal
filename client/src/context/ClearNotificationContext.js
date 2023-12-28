import React, { createContext, useContext, useState } from "react";

const ClearNotificationContext = createContext();

export const ClearNotificationProvider = ({ children }) => {
  const [clearNotification, setClearNotification] = useState(0);

  const setClearNotificationValue = (value) => {
    setClearNotification((prevReceiverId) => value);
  };

  return (
    <ClearNotificationContext.Provider
      value={{ clearNotification, setClearNotificationValue }}
    >
      {children}
    </ClearNotificationContext.Provider>
  );
};

export const useClearNotificationContext = () => {
  return useContext(ClearNotificationContext);
};