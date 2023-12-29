import { React, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWelcome from "../components/ChatWelcome";
import Chatting from "../components/Chatting";
import { Route, Routes } from "react-router-dom";

const Chat = () => {
  const [loadConversations, setLoadConversations] = useState(null);

  return (
    <div className="chatContainer">
      <Sidebar
        loadConversations={loadConversations}
        setLoadConversations={setLoadConversations}
      />
      <Routes>
        <Route path="welcome" element={<ChatWelcome />} />
        <Route
          path="chatting"
          element={<Chatting setLoadConversations={setLoadConversations} />}
        />
      </Routes>
    </div>
  );
};

export default Chat;