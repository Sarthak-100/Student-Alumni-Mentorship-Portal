import router from "express";

import {
  getNotifications,
  newNotification,
  countNotifications,
  clearNotifications,
} from "../controllers/notificationController.js";

const notificationRouter = router.Router();

notificationRouter.post("/newNotification", newNotification);

notificationRouter.get("/getNotifications", getNotifications);

notificationRouter.get("/countNotifications", countNotifications);

notificationRouter.delete("/clearNotifications", clearNotifications);

export default notificationRouter;