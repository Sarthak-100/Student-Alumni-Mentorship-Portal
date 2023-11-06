import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import filterRouter from "./routes/filterRouter.js";


const app = express();

//PORT and database URI from config.env
config({
  path: "./data/config.env",
});

//adding middlewares
app.use(express.json());
app.use(cookieParser());

//API for user registration and login
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

//API for filtering alumni profiles as per added filters
app.use("/api/v1/student/filter-alumni", filterRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
});

export default app;
