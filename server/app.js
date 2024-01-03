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

const app = express();

//PORT and database URI from config.env
config({
  path: "./data/config.env",
});

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,  Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "set-cookie");
  next();
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

export default app;