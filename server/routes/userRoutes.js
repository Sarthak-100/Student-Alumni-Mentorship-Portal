import express from "express";
// import isAuthenticated from "../middlewares/auth.js";

import {
  // register,
  // login,
  getMyProfile,
  getUserProfile,
  updateAlumniProfile,
  // getMyToken,
} from "../controllers/userController.js";

// import registerAlumni from "../controllers/alumniController.js";

const userRouter = express.Router();

//API for user registration
// userRouter.post("/register", register);

// userRouter.post("/registerAlumni", registerAlumni);

//API for user login
// userRouter.get("/login", login);

//API for getting user profile
// userRouter.get("/myProfile", isAuthenticated, getMyProfile);
userRouter.get("/myProfile", getMyProfile);

userRouter.get("/getUserProfile", getUserProfile);

userRouter.put("/updateAlumniProfile", updateAlumniProfile);

// userRouter.get("/myToken", getMyToken);

export default userRouter;
