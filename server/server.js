import app from "./app.js";
import connectDB from "./data/DatabaseConnection.js";
import http from "http";
import { Server } from "socket.io";

// connectDB();

const server = http.createServer(app);

const io = new Server(server);

const users = [{}];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `A new user:${users[socket.id]}  joined`,
    });
    socket.emit("welcome", { user: "Admin", message: "Welcome to the chat" });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message: message, id: id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} left`,
    });
    console.log("user left");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
