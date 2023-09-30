import { body, param } from "express-validator";
import categoriesController from "../controllers/categories.controller";
import adminAuthorization from "../middlewares/auth";
import validateImageMiddleware from "../middlewares/validate.image";
/**
 *
 * @param {import('express').Router} router
 */
const categoriesRoutes = (router) => {
  // create new category
  router.post(
    "/categories",
    adminAuthorization(2),
    validateImageMiddleware("image"),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
    body("image")
      .notEmpty()
      .withMessage("Image is required")
      .isURL()
      .withMessage("Image must be a URL"),
    body("parentId")
      .optional()
      .isInt()
      .withMessage("Parent id must be a number"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    categoriesController.createCategory
  );

  // get all categories
  router.get(
    "/categories",
    adminAuthorization(1),
    categoriesController.getAllCategories
  );

  // update category
  router.patch(
    "/categories/:id",
    adminAuthorization(2),
    validateImageMiddleware("image"),
    param("id").isInt().withMessage("Id must be a number"),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
    body("image")
      .notEmpty()
      .withMessage("Image is required")
      .isURL()
      .withMessage("Image must be a URL"),
    body("parentId")
      .optional()
      .isInt()
      .withMessage("Parent id must be a number"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    categoriesController.updateCategory
  );

  // toggle category status
  router.patch(
    "/categories/:id/toggle-status",
    adminAuthorization(2),
    param("id").isInt().withMessage("Id must be a number"),
    categoriesController.toggleCategoryStatus
  );
};

export default categoriesRoutes;
