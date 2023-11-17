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

//API for user registration
userRouter.post("/register", register);

// userRouter.post("/registerAlumni", registerAlumni);

//API for user login
userRouter.get("/login", login);

//API for getting user profile
userRouter.get("/myProfile", isAuthenticated, getMyProfile);

userRouter.get("/getUserProfile", isAuthenticated, getUserProfile);

userRouter.get("/myToken", isAuthenticated, getMyToken);

export default userRouter;
