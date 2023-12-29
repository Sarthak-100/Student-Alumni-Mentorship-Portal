import React, { createContext, useContext, useState } from "react";

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversation, setConversation] = useState(null);

  const setConversationValue = (value) => {
    setConversation(value);
  };

  return (
    <ConversationContext.Provider
      value={{ conversation, setConversationValue }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  return useContext(ConversationContext);
};