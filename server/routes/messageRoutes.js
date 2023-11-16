import router from "express";

import isAuthenticated from "../middlewares/auth.js";

import { getMessages, newMessage } from "../controllers/messageController.js";

const messageRouter = router.Router();

messageRouter.post("/newMessage", isAuthenticated, newMessage);

messageRouter.get("/getMessages", isAuthenticated, getMessages);

export default messageRouter;
