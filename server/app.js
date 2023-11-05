import express from "express";
import { config } from "dotenv";

const app = express();

config({
  path: "./data/config.env",
});

app.get("/", (req, res) => {
  res.send("Nice Working");
});

export default app;
