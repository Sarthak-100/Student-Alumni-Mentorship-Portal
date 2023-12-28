import React, { createContext, useContext, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const setSocketValue = (value) => {
    setSocket(value);
  };

  return (
    <SocketContext.Provider value={{ socket, setSocketValue }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};