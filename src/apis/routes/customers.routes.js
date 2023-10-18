import { body, param } from "express-validator";
import customersController from "../controllers/customers.controller";
import adminAuthorization from "../middlewares/auth";

const customersRoutes = (router) => {

    router.get(
      "/customers",
      adminAuthorization(1),
      customersController.getAllCustomers
    );
  
    router.patch(
      "/customers/:id",
      adminAuthorization(2),
      param("id").isInt().withMessage("Id must be a number"),
      body("status")
        .notEmpty()
        .withMessage("status is required")
        .isInt()
        .withMessage("status must be a number"),
      customersController.updateCustomerStatus
    );

  };
  
  export default customersRoutes;