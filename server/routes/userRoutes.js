import express from "express";
import isAuthenticated from "../middlewares/auth.js";

import {
  register,
  login,
  getMyProfile,
} from "../controllers/userController.js";

import registerAlumni from "../controllers/alumniController.js";

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/registerAlumni", registerAlumni);

userRouter.get("/login", login);

userRouter.get("/myProfile", isAuthenticated, getMyProfile);

export default userRouter;
