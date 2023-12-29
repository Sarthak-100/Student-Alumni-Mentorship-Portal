import React from "react";
import Navbar from "./Navbar";
import PreviousChats from "./PreviousChats";

const Sidebar = ({ loadConversations, setLoadConversations }) => {
  return (
    <div className="Sidebar">
      <Navbar />
      <PreviousChats
        loadConversations={loadConversations}
        setLoadConversations={setLoadConversations}
      />
    </div>
  );
};

export default Sidebar;