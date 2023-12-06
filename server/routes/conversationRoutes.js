import router from "express";
import {
  newConversation,
  getConversations,
  conversationsByDate,
  updateConversation,
  // findConversation,
} from "../controllers/conversationController.js";
// import isAuthenticated from "../middlewares/auth.js";

const conversationRouter = router.Router();

conversationRouter.post("/newConversation", newConversation);

conversationRouter.get("/getConversations", getConversations);

conversationRouter.get("/conversationsByDate", conversationsByDate);

// conversationRouter.get("/findConversation", findConversation);

conversationRouter.put("/updateConversation", updateConversation);

export default conversationRouter;
