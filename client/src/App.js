import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ConversationProvider } from "./context/ConversationContext";
import { LoadConversationsProvider } from "./context/LoadConversationsContext";
import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { ChattedUsersProvider } from "./context/ChattedUsers";
import { ReceiverIdProvider } from "./context/ReceiverIdContext";
import { NotificationsNoProvider } from "./context/NotificationsNoContext";
import { ReportedNoProvider } from "./context/ReportedNoContext";
import { Route, Routes } from "react-router-dom";
import FilterAlumni from "./components/FilterAlumni.js";
import FilterStudent from "./components/FilterStudent";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import CreateProfile from "./pages/CreateProfile";
import ChatWelcome from "./components/ChatWelcome";
import ProfilePage from "./pages/ProfilePage";
import Reports from "./pages/Reports";
import LoginButton from "./components/LoginButton";
import Chatting from "./components/Chatting";
import Layout from "./components/Layout";
import Hello from "./components/Hello";
import Admin_Charts from "./components/AdminCharts";
import Calendar from "./components/Calendar";
import UpcomingEvents from "./components/UpcomingEvents";
import { ClearNotificationProvider } from "./context/ClearNotificationContext";
import { MessageNotificationsNoProvider } from "./context/messageNotificationsNoContext";
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
  {
    error && <div>Oops... {error.message}</div>;
  }
  {
    !error && isLoading && <div>Loading...</div>;
  }

  return (
    <>
      <UserProvider>
        <ReportedNoProvider>
          <NotificationsNoProvider>
            <MessageNotificationsNoProvider>
              <ReceiverIdProvider>
                <LoadConversationsProvider>
                  <ConversationProvider>
                    <ChattedUsersProvider>
                      <ClearNotificationProvider>
                        <SocketProvider>
                          <Routes>
                            <Route path="/" element={<Layout />}>
                              <Route index element={<Hello />} />
                              <Route path="profile" element={<ProfilePage />} />
                              <Route
                                path="filterAlumni"
                                element={<FilterAlumni />}
                              />
                              <Route
                                path="filterStudent"
                                element={<FilterStudent />}
                              />
                              <Route path="/stats" element={<Admin_Charts />} />
                              <Route path="calendar" element={<Calendar />} />
                              <Route path="/upcoming-events" element={<UpcomingEvents />} />
                              <Route
                                path="notifications"
                                element={<Notifications />}
                              />
                              <Route path="/reports" element={<Reports />} />
                              <Route
                                path="createProfile"
                                element={<CreateProfile />}
                              />
                            </Route>
                            <Route path="/chat/" element={<Chat />}>
                              {/* <Route path="/chat2" element={<Chat2 />}> */}
                              <Route path="welcome" element={<ChatWelcome />} />
                              <Route path="chatting" element={<Chatting />} />
                            </Route>
                          </Routes>
                        </SocketProvider>
                      </ClearNotificationProvider>
                    </ChattedUsersProvider>
                  </ConversationProvider>
                </LoadConversationsProvider>
              </ReceiverIdProvider>
            </MessageNotificationsNoProvider>
          </NotificationsNoProvider>
        </ReportedNoProvider>
      </UserProvider>
    </>
  );
};

export default App;