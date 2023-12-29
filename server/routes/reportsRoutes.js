import router from "express";

import {
  getReports,
  countUnresolvedReports,
  updateResolvedStatus,
} from "../controllers/reportsController.js";

const reportRouter = router.Router();

reportRouter.get("/getReports", getReports);

reportRouter.get("/countUnresolvedReports", countUnresolvedReports);

reportRouter.put("/updateResolvedStatus", updateResolvedStatus);

export default reportRouter;