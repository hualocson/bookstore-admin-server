import { body, param, query } from "express-validator";
import productDetailsController from "../controllers/productDetails.controller";

const productDetailsRoutes = (router) =>
{
    //create productDetails
    router.post(
        "/productDetails",
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
            .withMessage("Publication date is required")
            .isDate()
            .withMessage("Publication date must be a date"),
        productDetailsController.createProductDetails
    );
    // getAllProductDetails
    router.get(
        "/productDetails",
        productDetailsController.getAllProductDetails
    );
    // getProductDetailsById
    router.get(
        "/productDetails/:id",
        param("id")
            .notEmpty()
            .withMessage("Id is required")
            .isInt()
            .withMessage("Id must be a number"),
        productDetailsController.getProductDetailsById
    );
    // updateProductDetails
    router.patch(
        "/productDetails/:id",
        param("id")
            .notEmpty()
            .withMessage("Id is required")
            .isInt()
            .withMessage("Id must be a number"),
        body("pages")
            .optional()
            .isInt()
            .withMessage("Pages must be a number"),
        body("author")
            .optional()
            .isString()
            .withMessage("Author must be a string"),
        body("publisher")
            .optional()
            .isString()
            .withMessage("Publisher must be a string"),
        body("publicationDate")
            .optional()
            .isDate()
            .withMessage("Publication date must be a date"),
        productDetailsController.updateProductDetails
    );
    // deleteProductDetails
    router.delete(
        "/productDetails/:id",
        param("id")
            .notEmpty()
            .withMessage("Id is required")
            .isInt()
            .withMessage("Id must be a number"),
        productDetailsController.deleteProductDetails
    );
}
//export
export default productDetailsRoutes;