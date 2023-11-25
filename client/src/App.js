import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { ConversationProvider } from "./context/ConversationContext";
import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { ChattedUsersProvider } from "./context/ChattedUsers";
import { ReceiverIdProvider } from "./context/ReceiverIdContext";

import Dashboard from "./components/Dashboard";
import LoginButton from "./components/LoginButton";
import ProfilePage from "./pages/ProfilePage";
import Chat from "./pages/Chat";
import ChatWelcome from "./components/ChatWelcome";
import Chatting from "./components/Chatting";

import "./style.css";

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  // Rendering based on authentication and loading/error states
  if (!isAuthenticated) {
    return <LoginButton />;
  }

  // Display loading state or error message
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Wrapping providers for context */}
      <UserProvider>
        <ReceiverIdProvider>
          <ConversationProvider>
            <ChattedUsersProvider>
              <SocketProvider>
                {/* Defining routes using React Router */}
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/chat" element={<Chat />}>
                    {/* Nested routes for chat */}
                    <Route path="welcome" element={<ChatWelcome />} />
                    <Route path="chatting" element={<Chatting />} />
                  </Route>
                </Routes>
              </SocketProvider>
            </ChattedUsersProvider>
          </ConversationProvider>
        </ReceiverIdProvider>
      </UserProvider>
    </>
  );
};

export default App;
