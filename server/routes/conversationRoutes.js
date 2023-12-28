import router from "express";
import {
  newConversation,
  getConversations,
  conversationsByDate,
  updateConversation,
} from "../controllers/conversationController.js";

const conversationRouter = router.Router();

conversationRouter.post("/newConversation", newConversation);

conversationRouter.get("/getConversations", getConversations);

conversationRouter.get("/conversationsByDate", conversationsByDate);

conversationRouter.put("/updateConversation", updateConversation);

export default conversationRouter;