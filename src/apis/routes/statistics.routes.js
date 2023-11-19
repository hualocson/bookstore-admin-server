import statisticsController from "../controllers/statistics.controller.js";
import adminAuthorization from "../middlewares/auth.js";

const statisticsRoute = (router) => {
  router.get("/stats", adminAuthorization(1), statisticsController.getStats);
};

export default statisticsRoute;
