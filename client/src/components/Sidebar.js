import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import PreviousChats from "./PreviousChats";

const Sidebar = ({ loadConversations, setLoadConversations }) => {
  return (
    <div className="Sidebar">
      <Navbar />
      {/* <Search /> */}
      <PreviousChats
        loadConversations={loadConversations}
        setLoadConversations={setLoadConversations}
      />
    </div>
  );
};

export default Sidebar;
