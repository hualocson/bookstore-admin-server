import { body, param, query } from "express-validator";
import productsController from "../controllers/products.controller";
import adminAuthorization from "../middlewares/auth";
import { ProductStatus } from "@/lib/constants";
/**
 *
 * @param {import('express').Router} router
 */
const productsRoutes = (router) => {
  // create new category
  router.post(
    "/products",
    adminAuthorization(2),
    body("categoryId")
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
    query("filter")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Invalid filter!"),
    productsController.getAllProducts
  );

  // update product
  router.patch(
    "/products/:id",
    adminAuthorization(2),
    param("id").isInt().withMessage("Id must be a number"),
    body("categoryId")
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
    body("status")
      .optional()
      .isInt()
      .withMessage("Status must be a number")
      .isIn(Object.values(ProductStatus))
      .withMessage("Invalid status!"),
    productsController.updateProduct
  );

  // delete product
  router.delete(
    "/products/:id",
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
