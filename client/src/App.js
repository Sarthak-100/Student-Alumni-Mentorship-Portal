import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SignInSide from "./components/SignIn";
import Chat from "./pages/Chat";
import Chat2 from "./pages/Chat2";
import ChatWelcome from "./components/ChatWelcome";
import Chatting from "./components/Chatting";
import "./style.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* <Route path="/chat" element={<Chat />}> */}
      <Route path="/chat2" element={<Chat2 />}>
        <Route path="welcome" element={<ChatWelcome />} />
        <Route path="chatting" element={<Chatting />} />
      </Route>
    </Routes>
  );
};

export default App;
