import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";

const app = express();

config({
  path: "./data/config.env",
});

//middlewares
app.use(express.json());
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
});

export default app;
