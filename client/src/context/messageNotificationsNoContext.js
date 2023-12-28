import { createContext, useContext, useState } from "react";

const MessageNotificationsNo = createContext();

export const MessageNotificationsNoProvider = ({ children }) => {
  const [messageNotificationsNo, setMessageNotificationsNo] = useState(0);

  const increment = (value) => {
    // Perform login logic, set user data, etc.
    setMessageNotificationsNo(
      (prevMessageNotificationsNo) => prevMessageNotificationsNo + value
    );
  };

  const decrement = (value) => {
    // Perform logout logic, clear user data, etc.
    setMessageNotificationsNo(
      (prevMessageNotificationsNo) => prevMessageNotificationsNo - value
    );
  };

  const setMessageNotificationsNoValue = (value) => {
    setMessageNotificationsNo(value);
  };

  return (
    <MessageNotificationsNo.Provider
      value={{
        messageNotificationsNo,
        increment,
        decrement,
        setMessageNotificationsNoValue,
      }}
    >
      {children}
    </MessageNotificationsNo.Provider>
  );
};

export const useMessageNotificationsNoContext = () => {
  return useContext(MessageNotificationsNo);
};