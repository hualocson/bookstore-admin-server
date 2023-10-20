import { body, param } from "express-validator";
import ordersController from "../controllers/orders.controller";
import adminAuthorization from "../middlewares/auth";
import { OrderStatus } from "@/lib/constants";
/**
 *
 * @param {import('express').Router} router
 */

const ordersRoutes = (router) => {
  // create new order with customerId,status,shippingFee,total,couponId
  router.post(
    "/orders",
    adminAuthorization(2),
    body("customerId").isInt().withMessage("Customer id must be a number"),
    body("addressId").isInt().withMessage("Address id must be a number"),
    body("shippingFee").isInt().withMessage("Shipping fee must be a number"),
    body("couponType").isInt().withMessage("CouponType id must be a number"),
    ordersController.createOrder
  );
  // Get all orders
  router.get("/orders", adminAuthorization(1), ordersController.getAllOrders);
  // Get order by id
  router.get(
    "/orders/:id",
    adminAuthorization(1),
    param("id").isInt().withMessage("Id must be a number"),
    ordersController.getOrderById
  );
  // Get all orders by customerId
  router.get(
    "/orders/customer/:customerId",
    adminAuthorization(1),
    param("customerId").isInt().withMessage("Id must be a number"),
    ordersController.getAllOrdersByCustomerId
  );

  // Update only status of order
  router.patch(
    "/orders/:id/status",
    adminAuthorization(2),
    param("id").isInt().withMessage("Id must be a number"),
    body("status")
      .isInt()
      .withMessage("Status must be a number")
      .isIn(Object.values(OrderStatus))
      .withMessage("Invalid order status"),
    ordersController.updateOrder
  );

  // View Order detail by Trả về thông tin chi tiết của đơn hàng, bao gồm sản phẩm, số lượng, giá tiền, địa chỉ giao hàng, và trạng thái đơn hàng.
  router.get(
    "/orders/detail/:id",
    adminAuthorization(1),
    param("id").isInt().withMessage("Id must be a number"),
    ordersController.viewOrderDetail
  );

  // get Revenue of all orders
  router.get(
    "/total-revenue",
    adminAuthorization(1),
    ordersController.getTotalRevenue
  );

  // Get revenue of orders by customerId
  router.get(
    "/orders/revenue/:customerId",
    adminAuthorization(1),
    param("customerId").isInt().withMessage("Id must be a number"),
    ordersController.getRevenueByCustomerId
  );
};
export default ordersRoutes;
