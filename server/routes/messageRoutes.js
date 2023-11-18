import router from "express";

// import isAuthenticated from "../middlewares/auth.js";

import { getMessages, newMessage } from "../controllers/messageController.js";

const messageRouter = router.Router();

messageRouter.post("/newMessage", newMessage);

messageRouter.get("/getMessages", getMessages);

export default messageRouter;
