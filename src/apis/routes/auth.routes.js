import authController from "../controllers/auth.controller";
import { body } from "express-validator";

const authRoutes = (router) => {
  router.get("/auth", authController.getAdmin);

  router.post(
    "/auth/hash-password",
    body("username")
      .exists()
      .withMessage("username required!")
      .isString()
      .withMessage("username must be a string!"),
    body("password")
      .exists()
      .withMessage("password required!")
      .isString()
      .withMessage("password must be a string!"),
    authController.hashPassword
  );
};

export default authRoutes;
