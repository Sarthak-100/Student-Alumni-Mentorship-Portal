import router from "express";
import {
  newConversation,
  getConversations,
} from "../controllers/conversationController.js";
import isAuthenticated from "../middlewares/auth.js";

const conversationRouter = router.Router();

conversationRouter.post("/newConversation", isAuthenticated, newConversation);

conversationRouter.get("/getConversations", isAuthenticated, getConversations);

export default conversationRouter;
