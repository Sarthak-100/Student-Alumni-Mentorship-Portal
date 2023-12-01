import app from "./app.js";
import connectDB from "./data/DatabaseConnection.js";
import http from "http";
import { Server } from "socket.io";
import { Notification } from "./models/notificationModel.js";
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
  return (
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
  );
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  socket.on("addUser", (userId) => {
    if (userId === null) {
    } else {
      console.log("New client Added->", "user", userId, "socketId", socket.id);
      console.log(addUser(userId, socket.id));
      io.emit("getUsers", users);
    }
  });

  // send and get message
  socket.on(
    "sendMessage",
    async ({ senderId, senderName, receiverId, text }) => {
      const user = getUser(receiverId);
      // console.log(receiverId);
      console.log(user);
      console.log("$$$$");
      console.log(users);
      if (user) {
        io.to(user?.socketId).emit("getMessage", {
          senderId,
          senderName,
          text,
        });
        io.to(user?.socketId).emit("getMessageNotification", {
          senderId,
          senderName,
          text,
        });
      } else {
        const newNotification = new Notification({
          receiverId,
          senderId,
          senderName,
          messageType: "message",
          message: text,
        });

        try {
          const savedNotification = await newNotification.save();
          console.log(savedNotification);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  socket.on(
    "newConversation&Message",
    async ({ senderId, senderName, receiverId, text }) => {
      const user = getUser(receiverId);
      // console.log(receiverId);
      // console.log(user);
      // console.log(users);
      if (user) {
        io.to(user?.socketId).emit("receiveNewConversation&Message", {
          senderId,
          senderName,
          text,
        });
        io.to(user?.socketId).emit(
          "receiveNewConversation&MessageNotification",
          {
            senderId,
            senderName,
            text,
          }
        );
      } else {
        const newNotification = new Notification({
          receiverId,
          senderId,
          senderName,
          messageType: "chatMessage",
          message: text,
        });

        try {
          const savedNotification = await newNotification.save();
          console.log(savedNotification);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  socket.on(
    "changeBlockedStatus",
    async ({ senderId, senderName, receiverIdArg, blockedStatus }) => {
      const user = getUser(receiverIdArg);
      if (user) {
        io.to(user?.socketId).emit("updateBlockedStatus", {
          senderId,
          senderName,
          blockedStatus,
        });
        io.to(user?.socketId).emit("updateBlockedStatusNotification", {
          senderId,
          senderName,
          blockedStatus,
        });
      } else {
        const newNotification = new Notification({
          receiverIdArg,
          senderId,
          senderName,
          messageType: "blockingUpdate",
          message: `You have been ${blockedStatus ? "blocked" : "unblocked"}.}`,
        });

        try {
          const savedNotification = await newNotification.save();
          console.log(savedNotification);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

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
