import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import filterRouter from "./routes/filterRouter.js";
import cors from "cors";

const app = express();

config({
  path: "./data/config.env",
});

//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);
app.use("/api/v1/student/filter-alumni", filterRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
});

app.get("/api/data", (req, res) => {
  res.status(200).json({ message: "This is a sample response" });
});

export default app;
