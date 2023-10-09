import { body, param } from "express-validator";
import productsController from "../controllers/products.controller";
import adminAuthorization from "../middlewares/auth";
import validateImageMiddleware from "../middlewares/validate.image";
/**
 *
 * @param {import('express').Router} router
 */
const productsRoutes = (router) => {
  // create new category
  router.post(
    "/products",
    adminAuthorization(2),
    validateImageMiddleware("image"),
    body("category_id")
        .notEmpty()
        .withMessage("Category ID is required")
        .isInt()
        .withMessage("Category ID must be a number"),
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
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isInt()
      .withMessage("Price id must be a number"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt()
      .withMessage("Quantity id must be a number"),  
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    productsController.createProduct
  );

  // get all categories
  router.get(
    "/products",
    adminAuthorization(1),
    productsController.getAllProducts
  );

  // update product
  router.patch(
    "/products/:id",
    adminAuthorization(2),
    param("id").isInt().withMessage("Id must be a number"),
    body("category_id")
        .notEmpty()
        .withMessage("Category ID is required")
        .isInt()
        .withMessage("Category ID must be a number"),
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
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isInt()
      .withMessage("Price id must be a number"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt()
      .withMessage("Quantity id must be a number"),  
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
      productsController.updateProduct
  );

  // delete product
  router.patch(
    "/products/:id/delete",
    adminAuthorization(2),
    param("id").isInt().withMessage("Id must be a number"),
    productsController.deleteProduct
  );

  router.patch(
    "/products/:id/restore",
    adminAuthorization(2),
    param("id").isInt().withMessage("Id must be a number"),
    productsController.resStoreProduct
  );
};

export default productsRoutes;
