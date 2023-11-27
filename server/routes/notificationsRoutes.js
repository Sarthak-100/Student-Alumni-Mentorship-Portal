import router from "express";

// import isAuthenticated from "../middlewares/auth.js";

import {
  getNotifications,
  newNotification,
  countNotifications,
} from "../controllers/notificationController.js";

const notificationRouter = router.Router();

notificationRouter.post("/newNotification", newNotification);

notificationRouter.get("/getNotifications", getNotifications);

notificationRouter.get("/countNotifications", countNotifications);

export default notificationRouter;
