import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";

const app = express();

config({
  path: "./data/config.env",
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/student", filterRouter)
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Nice Working");
});

export default app;
