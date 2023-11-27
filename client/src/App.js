import { React } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import ProfilePage from "./pages/ProfilePage";
import Notifications from "./pages/Notifications";
import SignInSide from "./components/SignIn";
import Chat from "./pages/Chat";
import Chat2 from "./pages/Chat2";
import ChatWelcome from "./components/ChatWelcome";
import Chatting from "./components/Chatting";
import { ConversationProvider } from "./context/ConversationContext";
import { LoadConversationsProvider } from "./context/LoadConversationsContext";
import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { ChattedUsersProvider } from "./context/ChattedUsers";
import { ReceiverIdProvider } from "./context/ReceiverIdContext";
import { NotificationsNoProvider } from "./context/NotificationsNoContext";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import "./style.css";

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  {
    error && <div>Oops... {error.message}</div>;
  }
  {
    !error && isLoading && <div>Loading...</div>;
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
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/profile" element={<ProfilePage />} />
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
