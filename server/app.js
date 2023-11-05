import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import filterRouter from "./routes/filterRouter.js";


const app = express();

config({
  path: "./data/config.env",
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);
app.use("/api/v1/student/filter-alumni", filterRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
});

export default app;
