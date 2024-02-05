import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import filterStudentRouter from "./routes/filterStudentRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import eventRouter from "./routes/eventRouter.js";
import cookieParser from "cookie-parser";
import filterRouter from "./routes/filterAlumniRouter.js";
import notificationRouter from "./routes/notificationsRoutes.js";
import reportRouter from "./routes/reportsRoutes.js";
import connectDB from "./data/DatabaseConnection.js";
import { Server } from "socket.io";
import { Notification } from "./models/notificationModel.js";
import { Conversation } from "./models/conversationModel.js";
import { Reports } from "./models/reportsModel.js";
import { Event } from "./models/eventModel.js";

//PORT and database URI from config.env
config({
  path: "./data/config.env",
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://student-alumni-mentorship-portal.vercel.app/"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,  Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "set-cookie");
  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/filter-student", filterStudentRouter);

app.use("/api/v1/student/filter-alumni", filterRouter);
app.use("api/v1/users/updateAvatar", userRouter);
app.use("/api/v1/saveEvent", eventRouter);
app.use("/api/v1/fetchSlots", eventRouter);
app.use("/api/v1/updateEvent", eventRouter);
app.use("/api/v1/getEvent", eventRouter);
app.use("/api/v1/fetchPastMeetings", eventRouter);
app.use("/api/v1/deleteEvent", eventRouter);

connectDB();

const io = new Server(9000, {
  cors: {
    origin: "https://student-alumni-mentorship-portal.vercel.app/",
  },
});

let users = [];

const addUser = (userId, user_type, socketId) => {
  return (
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, user_type, socketId })
  );
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const getUserByUserType = (user_type) => {
  return users.find((user) => user.user_type === user_type);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  socket.on("addUser", (userId, user_type) => {
    if (userId === null) {
    } else {
      console.log(
        "New client Added->",
        "user",
        userId,
        "user_type",
        user_type,
        "socketId",
        socket.id
      );
      console.log(addUser(userId, user_type, socket.id));
      io.emit("getUsers", users);
    }
  });

  // send and get message
  socket.on(
    "sendMessage",
    async ({ senderId, senderName, receiverId, conversation, text }) => {
      const user = getUser(receiverId);
      console.log(user);
      console.log("$$$$");
      console.log(users);
      console.log(conversation);
      if (user) {
        io.to(user?.socketId).emit("updateLastAndUnseenMessage", {
          senderId,
          senderName,
          receiverId,
          conversation,
          text,
        });
        io.to(user?.socketId).emit("getMessage", {
          senderId,
          senderName,
          text,
          conversation,
        });
        io.to(user?.socketId).emit("getMessageNotification", {
          senderId,
          senderName,
          conversation,
        });
      } else {
        console.log("PRESENT HERE");
        let conversationT = await Conversation.findById(conversation._id);
        conversationT.unseenMessages[receiverId] += 1;
        try {
          await Conversation.updateOne(
            { _id: conversation._id },
            { $set: { unseenMessages: conversationT.unseenMessages } }
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  socket.on(
    "newConversation&Message",
    async ({ senderId, senderName, receiverId, conversation, text }) => {
      const user = getUser(receiverId);
      let conversationT = await Conversation.findById(conversation._id);
      conversationT.unseenMessages[receiverId] += 1;
      try {
        await Conversation.updateOne(
          { _id: conversation._id },
          { $set: { unseenMessages: conversationT.unseenMessages } }
        );
      } catch (error) {
        console.log(error);
      }
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
            conversationT,
          }
        );
      }
    }
  );

  socket.on("reloadConversations", async (id) => {
    const user = getUser(id);
    console.log("reloadConversations", id);
    if (user) {
      io.to(user?.socketId).emit("receiveReloadConversations", id);
    }
  });

  socket.on(
    "changeBlockedStatus",
    async ({
      senderId,
      senderName,
      receiverIdArg,
      receiverName,
      receiver_user_type,
      blockedStatus,
    }) => {
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
          receiverId: receiverIdArg,
          senderId,
          senderName,
          messageType: "blockingUpdate",
          message: `You have been ${blockedStatus ? "blocked" : "unblocked"}.`,
        });

        try {
          const savedNotification = await newNotification.save();
          console.log(savedNotification);
        } catch (error) {
          console.log(error);
        }
      }
      if (blockedStatus) {
        const admin = getUserByUserType("admin");
        if (admin) {
          io.to(admin?.socketId).emit("notifyingAdminStudentBlocked", {
            senderId,
            senderName,
            blockedStatus,
          });
        }
        // console.log("inside blockedStatus", admin);
        // console.log("inside blockedStatus", receiver_user_type);
        const newNotification2 = new Notification({
          receiverId: admin?.userId,
          senderId,
          senderName,
          messageType: "notifyingAdminStudentBlocked",
          message: `Blocked ${receiver_user_type}: ${receiverName}.`,
        });
        try {
          const savedNotification = await newNotification2.save();
          console.log(savedNotification);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  socket.on(
    "userReported",
    async ({
      reporterId,
      reporterName,
      reporterUserType,
      reportedId,
      reportedName,
      reportedUserType,
      reason,
    }) => {
      const user = getUserByUserType("admin");
      console.log(user);
      console.log(users);
      if (user) {
        console.log("inside userReported");
        io.to(user?.socketId).emit("reportNotificationAdmin", {});
      }

      const report = new Reports({
        reporterId: reporterId,
        reporterName: reporterName,
        reporterUserType: reporterUserType,
        reportedId: reportedId,
        reportedName: reportedName,
        reportedUserType: reportedUserType,
        reason: reason,
      });

      try {
        const savedReport = await report.save();
        // console.log(savedNotification);
      } catch (error) {
        console.log(error);
      }
      // }
      const reportedUser = getUser(reportedId);
      console.log("#$#$@#@#@$#$%^*&*", reportedUser);
      if (reportedUser) {
        io.to(reportedUser?.socketId).emit("reportNotificationUser", {});
      }
      console.log("inside reportedUser");
      const newNotification2 = new Notification({
        receiverId: reportedId,
        senderId: reporterId,
        senderName: reporterName,
        messageType: "report",
        message: `You have been reported to Admin.`,
      });

      try {
        const savedNotification2 = await newNotification2.save();
        console.log(savedNotification2);
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on(
    "sendResolvedNotification",
    async ({
      receiverId,
      senderName,
      reason,
      reportedName,
      reportedUserType,
    }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user?.socketId).emit("getResolvedNotification", {});
      }
      const newNotification = new Notification({
        receiverId,
        senderName,
        messageType: "reportResolved",
        message: `Your report against ${reportedUserType}: ${reportedName} with Reason: "${reason}" has been resolved.`,
      });
      try {
        await newNotification.save();
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("sendRemoveUserNotification", ({ removedUserId }) => {
    const user = getUser(removedUserId);
    if (user) {
      io.to(user?.socketId).emit("getRemoveUserNotification", {});
      io.to(user?.socketId).emit("getRemoveUserNotificationChat", {});
    } else {
      console.log("User not found");
    }
  });

  socket.on(
    "fixMeeting",
    async ({ receiverId, senderId, senderName, messageType, message }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user?.socketId).emit("getFixMeetingNotification", {
          senderId,
          senderName,
        });
      }

      const newNotification = new Notification({
        receiverId,
        senderId,
        senderName,
        messageType,
        message,
      });

      try {
        const savedNotification = await newNotification.save();
        console.log(savedNotification);
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("getUpdateDeletedEvent", async ({ eventId, userId, userName }) => {
    try {
      const event = await Event.findById({ _id: eventId });

      event.attendees.forEach(async (attendee) => {
        const attendeeId = attendee._id.toString(); // Assuming the attendee object has an '_id' field
        const user = getUser(attendeeId);
        if (user) {
          io.to(user?.socketId).emit("receiveUpdateDeletedEvent");
        }
        const newNotification = new Notification({
          receiverId: attendeeId,
          senderId: userId,
          senderName: userName,
          messageType: "eventDeleted",
          message: `Event ${event.summary} on ${new Date(
            new Date(event.startDateTime).getTime()
          ).toLocaleString([], {
            dateStyle: "long",
            timeStyle: "short",
          })}, has been cancelled.`,
        });
        try {
          await newNotification.save();
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
