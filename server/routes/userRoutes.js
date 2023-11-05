import express from "express";

import {
  register,
  login,
  getMyProfile,
} from "../controllers/userController.js";

userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/profile", getMyProfile);
