import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
// import chatRouter from "./routes/chatRoutes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
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
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/chat", chatRouter);

app.use(errorMiddleware);

//API for filtering alumni profiles as per added filters
app.use("/api/v1/student/filter-alumni", filterRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
});

app.get("/api/data", (req, res) => {
  res.status(200).json({ message: "This is a sample response" });
});

export default app;
