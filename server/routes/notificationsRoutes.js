import router from "express";

// import isAuthenticated from "../middlewares/auth.js";

import {
  getNotifications,
  newNotification,
} from "../controllers/notificationController.js";

const notificationRouter = router.Router();

notificationRouter.post("/newNotification", newNotification);

notificationRouter.get("/getNotifications", getNotifications);

export default notificationRouter;
