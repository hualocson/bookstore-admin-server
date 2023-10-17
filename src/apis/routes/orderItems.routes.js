//Import cho orderItems
import { body,query, param } from "express-validator";
import orderItemsController from "../controllers/orderItems.controller";
import adminAuthorization from "../middlewares/auth";
/**
 *
 * @param {import('express').Router} router
 */
const orderItemsRoutes = (router) => {
    //Create Order Items với các params theo Camel Case
    router.post(
        "/order-items",
        adminAuthorization(2),
        body("orderId").isInt().withMessage("Order id must be a number"),
        body("productId").isInt().withMessage("Product id must be a number"),
        body("quantity").isInt().withMessage("Quantity must be a number"),
        orderItemsController.createOrderItems
    );
}
//Export
export default orderItemsRoutes;
