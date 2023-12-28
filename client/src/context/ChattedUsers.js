import React, { createContext, useContext, useState } from "react";

const ChattedUsersContext = createContext();

export const ChattedUsersProvider = ({ children }) => {
  const [chattedUsers, setChattedUsers] = useState(null);

  const setChattedUsersValue = (key, value) => {
    setChattedUsers((prevChattedUsers) => ({
      ...prevChattedUsers,
      [key]: value,
    }));
  };

  return (
    <ChattedUsersContext.Provider
      value={{ chattedUsers, setChattedUsersValue }}
    >
      {children}
    </ChattedUsersContext.Provider>
  );
};

export const useChattedUsersContext = () => {
  return useContext(ChattedUsersContext);
};