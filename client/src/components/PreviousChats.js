import React from "react";
import UserChats from "./UserChats";

const PreviousChats = () => {
  return (
    <div className="previousChats">
      <UserChats
        imgLink="https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600"
        name="Rahul"
        lastMessage="that was really frustating for us."
      />
      <UserChats
        imgLink="https://images.pexels.com/photos/428361/pexels-photo-428361.jpeg?auto=compress&cs=tinysrgb&w=600"
        name="Harshit"
        lastMessage="ok"
      />
      <UserChats
        imgLink="https://images.pexels.com/photos/1181335/pexels-photo-1181335.jpeg?auto=compress&cs=tinysrgb&w=600"
        name="Priya"
        lastMessage="bye"
      />
    </div>
  );
};

export default PreviousChats;
