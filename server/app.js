import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import filterRouter from "./routes/filterRouter.js";
import cors from "cors";

const app = express();

//PORT and database URI from config.env
config({
  path: "./data/config.env",
});

//adding middlewares
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "set-cookie");
  next();
});
// app.use(cors());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);


//API for filtering alumni profiles as per added filters
app.use("/api/v1/student/filter-alumni", filterRouter);

// app.get("/", (req, res) => {
//   res.send("Nice Working");
// });

// app.get("/api/data", (req, res) => {
//   res.status(200).json({ message: "This is a sample response" });
// });

export default app;
