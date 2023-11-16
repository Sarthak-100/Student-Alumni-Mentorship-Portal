import app from "./app.js";
import connectDB from "./data/DatabaseConnection.js";
import http from "http";
import { Server } from "socket.io";
// import io from "socket.io";

connectDB();

// const server = http.createServer();

const io = new Server(8900, {
  cors: {
    origin: "http://localhost:5000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("New client connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(receiverId);
    console.log(user);
    console.log(users);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

try {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (error) {
  console.error("Server Error:", error);
}
