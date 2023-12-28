import React, { createContext, useContext, useState } from "react";

const ReceiverIdContext = createContext();

export const ReceiverIdProvider = ({ children }) => {
  const [receiverId, setReceiverId] = useState(null);

  const setReceiverIdValue = (value) => {
    setReceiverId((prevReceiverId) => value);
  };

  return (
    <ReceiverIdContext.Provider value={{ receiverId, setReceiverIdValue }}>
      {children}
    </ReceiverIdContext.Provider>
  );
};

export const useReceiverIdContext = () => {
  return useContext(ReceiverIdContext);
};