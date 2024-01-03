import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Perform login logic, set user data, etc.
    setUser(userData);
  };

  const logout = ({ returnTo }) => {
    // Perform logout logic, clear user data, etc.
    window.location.href = "https://student-alumni-mentorship-portal.vercel.app/";
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};