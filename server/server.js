import app from "./app.js";
import connectDB from "./data/DatabaseConnection.js";
import http from "http";
import { Server } from "socket.io";

connectDB();

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected");
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
