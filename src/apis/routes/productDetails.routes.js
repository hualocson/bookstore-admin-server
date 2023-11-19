import { body, param } from "express-validator";
import productDetailsController from "../controllers/productDetails.controller";
import adminAuthorization from "../middlewares/auth";

const productDetailsRoutes = (router) => {
  // create productDetails
  router.post(
    "/product-details",
    adminAuthorization(2),
    body("id")
      .notEmpty()
      .withMessage("Product id is required")
      .isInt()
      .withMessage("Product id must be a number"),
    body("pages")
      .notEmpty()
      .withMessage("Pages is required")
      .isInt()
      .withMessage("Pages must be a number"),
    body("author")
      .notEmpty()
      .withMessage("Author is required")
      .isString()
      .withMessage("Author must be a string"),
    body("publisher")
      .notEmpty()
      .withMessage("Publisher is required")
      .isString()
      .withMessage("Publisher must be a string"),
    body("publicationDate")
      .notEmpty()
      .withMessage("Publication date is required"),
    productDetailsController.createProductDetails
  );
  //  getAllProductDetails
  router.get("/product-details", productDetailsController.getAllProductDetails);
  //  getProductDetailsById
  router.get(
    "/product-details/:id",
    param("id")
      .notEmpty()
      .withMessage("Id is required")
      .isInt()
      .withMessage("Id must be a number"),
    productDetailsController.getProductDetailsById
  );
  //  updateProductDetails
  router.patch(
    "/product-details/:id",
    param("id")
      .notEmpty()
      .withMessage("Id is required")
      .isInt()
      .withMessage("Id must be a number"),
    body("pages").optional().isInt().withMessage("Pages must be a number"),
    body("author").optional().isString().withMessage("Author must be a string"),
    body("publisher")
      .optional()
      .isString()
      .withMessage("Publisher must be a string"),
    body("publicationDate").optional(),
    productDetailsController.updateProductDetails
  );
  //  deleteProductDetails
  router.delete(
    "/product-details/:id",
    param("id")
      .notEmpty()
      .withMessage("Id is required")
      .isInt()
      .withMessage("Id must be a number"),
    productDetailsController.deleteProductDetails
  );
};
export default productDetailsRoutes;
