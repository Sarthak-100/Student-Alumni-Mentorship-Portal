import router from "express";
import {
  newConversation,
  getConversations,
  findConversation,
} from "../controllers/conversationController.js";
import isAuthenticated from "../middlewares/auth.js";

const conversationRouter = router.Router();

conversationRouter.post("/newConversation", isAuthenticated, newConversation);

conversationRouter.get("/getConversations", isAuthenticated, getConversations);

conversationRouter.get("/findConversation", isAuthenticated, findConversation);

export default conversationRouter;
