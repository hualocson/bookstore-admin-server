import addressesController from "../controllers/addresses.controller";
import adminAuthorization from "../middlewares/auth";
/**
 *
 * @param {import('express').Router} router
 */

const addressesRoutes = (router) => {
  router.get(
    "/addresses",
    adminAuthorization(1),
    addressesController.getAllAddresses
  );
};

export default addressesRoutes;
