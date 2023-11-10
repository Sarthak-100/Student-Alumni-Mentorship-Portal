import express from "express";
import isAuthenticated from "../middlewares/auth.js";

import { getChattedUsers } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/getChattedUsers", isAuthenticated, getChattedUsers);

export default chatRouter;
