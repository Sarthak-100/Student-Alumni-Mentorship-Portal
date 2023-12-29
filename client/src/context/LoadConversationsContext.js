import React, { createContext, useContext, useState } from "react";

const LoadConversationsContext = createContext();

export const LoadConversationsProvider = ({ children }) => {
  const [loadConversations, setLoadConversations] = useState(null);

  const setLoadConversationsValue = (value) => {
    setLoadConversations(
      (prevLoadConversations) => prevLoadConversations + value
    );
  };

  return (
    <LoadConversationsContext.Provider
      value={{ loadConversations, setLoadConversationsValue }}
    >
      {children}
    </LoadConversationsContext.Provider>
  );
};

export const useLoadConversationsContext = () => {
  return useContext(LoadConversationsContext);
};