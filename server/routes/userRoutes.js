import express from "express";

import {
  getMyProfile,
  getUserProfile,
  updateAlumniProfile,
  getBatchwiseCounts,
  insertAvatar,
  removeUser,
  createProfile,
  getDemo,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/myProfile", getMyProfile);

userRouter.get("/getUserProfile", getUserProfile);

userRouter.put("/updateAlumniProfile", updateAlumniProfile);

userRouter.post("/updateAvatar", insertAvatar);

userRouter.get("/getBatchwiseCounts", getBatchwiseCounts);

userRouter.put("/removeUser", removeUser);

userRouter.post("/createProfile", createProfile);

userRouter.get("/demo", getDemo);

export default userRouter;