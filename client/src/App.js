import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SignInSide from "./components/SignIn";
import Chat from "./pages/Chat";
import Chat2 from "./pages/Chat2";
import ChatWelcome from "./components/ChatWelcome";
import Chatting from "./components/Chatting";
import { ConversationProvider } from "./context/ConversationContext";
import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { ChattedUsersProvider } from "./context/ChattedUsers";
import { ReceiverIdProvider } from "./context/ReceiverIdContext";
import "./style.css";

const App = () => {
  return (
    <UserProvider>
      <ReceiverIdProvider>
        <ConversationProvider>
          <ChattedUsersProvider>
            <SocketProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chat" element={<Chat />}>
                  {/* <Route path="/chat2" element={<Chat2 />}> */}
                  <Route path="welcome" element={<ChatWelcome />} />
                  <Route path="chatting" element={<Chatting />} />
                </Route>
              </Routes>
            </SocketProvider>
          </ChattedUsersProvider>
        </ConversationProvider>
      </ReceiverIdProvider>
    </UserProvider>
  );
};

export default App;
