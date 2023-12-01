import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ConversationProvider } from "./context/ConversationContext";
import { LoadConversationsProvider } from "./context/LoadConversationsContext";
import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { ChattedUsersProvider } from "./context/ChattedUsers";
import { ReceiverIdProvider } from "./context/ReceiverIdContext";
import { NotificationsNoProvider } from "./context/NotificationsNoContext";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import FilterAlumni from "./components/FilterAlumni.js";

import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import ChatWelcome from "./components/ChatWelcome";
import ProfilePage from "./pages/ProfilePage";
import LoginButton from "./components/LoginButton";
import Chatting from "./components/Chatting";
import Layout from "./components/Layout";
import Hello from "./components/Hello";
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
      <UserProvider>
        <NotificationsNoProvider>
          <ReceiverIdProvider>
            <LoadConversationsProvider>
              <ConversationProvider>
                <ChattedUsersProvider>
                  <SocketProvider>
                    <Routes>
                  <Route path="/" element={<Layout />}>
                  <Route index element={<Hello />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="filterAlumni" element={<FilterAlumni />} />
                  </Route>
                      <Route
                        path="/notifications"
                        element={<Notifications />}
                      />
                      <Route path="/chat" element={<Chat />}>
                        {/* <Route path="/chat2" element={<Chat2 />}> */}
                        <Route path="welcome" element={<ChatWelcome />} />
                        <Route path="chatting" element={<Chatting />} />
                      </Route>
                    </Routes>
                  </SocketProvider>
                </ChattedUsersProvider>
              </ConversationProvider>
            </LoadConversationsProvider>
          </ReceiverIdProvider>
        </NotificationsNoProvider>
      </UserProvider>
    </>
  );
};

export default App;
