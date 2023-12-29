import { createContext, useContext, useState } from "react";

const NotificationsNo = createContext();

export const NotificationsNoProvider = ({ children }) => {
  const [notificationsNo, setNotificationsNo] = useState(0);

  const increment = () => {
    // Perform login logic, set user data, etc.
    setNotificationsNo((prevNotificationsNo) => prevNotificationsNo + 1);
  };

  const decrement = () => {
    // Perform logout logic, clear user data, etc.
    setNotificationsNo((prevNotificationsNo) => prevNotificationsNo - 1);
  };

  const setNotificationsNoValue = (value) => {
    setNotificationsNo(value);
  };

  return (
    <NotificationsNo.Provider
      value={{ notificationsNo, increment, decrement, setNotificationsNoValue }}
    >
      {children}
    </NotificationsNo.Provider>
  );
};

export const useNotificationsNoContext = () => {
  return useContext(NotificationsNo);
};