import router from "express";
import {
  newConversation,
  getConversations,
  findConversation,
} from "../controllers/conversationController.js";
// import isAuthenticated from "../middlewares/auth.js";

const conversationRouter = router.Router();

conversationRouter.post("/newConversation", newConversation);

conversationRouter.get("/getConversations", getConversations);

conversationRouter.get("/findConversation", findConversation);

export default conversationRouter;
