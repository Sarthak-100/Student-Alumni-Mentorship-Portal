import express from "express";
import isAuthenticated from "../middlewares/auth.js";

import {
  register,
  login,
  getMyProfile,
  getUserProfile,
  getMyToken,
} from "../controllers/userController.js";

// import registerAlumni from "../controllers/alumniController.js";

const userRouter = express.Router();

userRouter.post("/register", register);

// userRouter.post("/registerAlumni", registerAlumni);

userRouter.get("/login", login);

userRouter.get("/myProfile", isAuthenticated, getMyProfile);

userRouter.get("/getUserProfile", isAuthenticated, getUserProfile);

userRouter.get("/myToken", isAuthenticated, getMyToken);

export default userRouter;
