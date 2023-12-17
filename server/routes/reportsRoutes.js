import router from "express";

// import isAuthenticated from "../middlewares/auth.js";

import {
  getReports,
  //   newreports,
  countUnresolvedReports,
  updateResolvedStatus,
  //   clearreportss,
} from "../controllers/reportsController.js";

const reportRouter = router.Router();

// reportRouter.post("/newreports", newreports);

reportRouter.get("/getReports", getReports);

reportRouter.get("/countUnresolvedReports", countUnresolvedReports);

reportRouter.put("/updateResolvedStatus", updateResolvedStatus);

export default reportRouter;
