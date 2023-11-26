import router from "express";
import {
  newConversation,
  getConversations,
  findConversation,
  updateConversation,
} from "../controllers/conversationController.js";
// import isAuthenticated from "../middlewares/auth.js";

const conversationRouter = router.Router();

conversationRouter.post("/newConversation", newConversation);

conversationRouter.get("/getConversations", getConversations);

conversationRouter.get("/findConversation", findConversation);

conversationRouter.put("/updateConversation", updateConversation);

export default conversationRouter;
