import { OrderStatus } from "@/lib/constants";
import { controllerWrapper } from "@/lib/controller.wrapper";
const ordersController = {
  // Get all orders
  getAllOrders: controllerWrapper(async (_, res, { successResponse, sql }) => {
    const orders = await sql`
    SELECT orders.id, orders.status, orders.shipping_fee, orders.coupon_id, orders.total, orders.created_at,
    cd.first_name, cd.last_name, c.email
    FROM orders
    LEFT JOIN customers c ON orders.customer_id = c.id
    LEFT JOIN customer_details cd ON orders.customer_id = cd.id
    ORDER BY orders.created_at ASC
  `;

    return successResponse({ orders }, "Get all orders", 200);
  }),
  // Get order by id
  getOrderById: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.params;
      const orderItems = await sql`
        SELECT order_items.id, order_items.product_id, order_items.order_id, p.name, p.image, p.slug, pd.author, order_items.quantity, order_items.price, o.canceled_at, o.completed_at, o.delivery_at
        FROM order_items
        LEFT JOIN orders o ON order_items.order_id = o.id
        LEFT JOIN products p ON order_items.product_id = p.id
        LEFT JOIN product_details pd ON p.id = pd.id
        WHERE order_items.order_id = ${id}
      `;

      // Get all attributes of order by id
      return successResponse(
        { orderItems },
        "Get order by id successfully",
        200
      );
    }
  ),
  // Get all orders by customerId
  getAllOrdersByCustomerId: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { customerId } = req.params;
      // Check if customerId existed
      const orders = await sql`
                SELECT id,customer_id,status,shipping_fee,total,coupon_id,created_at,updated_at,deleted_at,canceled_at,completed_at, delivery_at
                FROM orders
                WHERE customer_id = ${customerId}
            `;
      if (!orders) {
        return errorResponse(
          `Orders with customerId ${customerId} not found`,
          404
        );
      }
      // Get all attribute of orders by customerId
      return successResponse(
        { orders },
        "Get all orders by customerId successfully",
        200
      );
    }
  ),
  // Update only status of order
  updateOrder: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { status } = req.body;
      const { id } = req.params;
      // Check if order existed
      const [order] = await sql`
                SELECT id, status FROM orders WHERE id = ${id}
            `;
      if (!order) {
        return errorResponse(`Order with id ${id} not found`, 404);
      }

      // Check if status is valid before update
      if (status === OrderStatus.CANCELED) {
        if (
          order.status === OrderStatus.CANCELED ||
          order.status === OrderStatus.DELIVERED ||
          order.status === OrderStatus.PROCESSED
        ) {
          return errorResponse(`Order with id ${id} cannot be updated`, 400);
        }

        // rollback quantity of product, set deleted_at for order_items
        const orderItems = await sql`
                    SELECT product_id, quantity
                    FROM order_items
                    WHERE order_id = ${id}
                `;
        await sql.begin(async (sql) => {
          for (const item of orderItems) {
            const [product] = await sql`
                          SELECT id, quantity
                          FROM products
                          WHERE id = ${item.productId}
                      `;
            const newQuantity = product.quantity + item.quantity;
            await sql`UPDATE products
                      SET quantity = ${newQuantity}, sold = sold - ${item.quantity}
                      WHERE id = ${item.productId}
                      `;
            await sql`
                    UPDATE order_items
                    SET deleted_at = NOW()
                    WHERE order_id = ${id}`;
          }
        });
      }

      let column = "";
      switch (status) {
        case OrderStatus.PENDING:
          break;
        case OrderStatus.PROCESSED:
          column = "completed_at";
          break;
        case OrderStatus.DELIVERED:
          column = "delivery_at";
          break;
        case OrderStatus.CANCELED:
          column = "canceled_at";
          break;
        default:
          return errorResponse("Invalid order status", 400);
      }

      // Update order
      const [updatedOrder] = await sql`
                UPDATE orders
                SET status = ${status},
                ${column !== "" ? sql`${sql(column)} = NOW()` : sql``}
                WHERE id = ${id}
                RETURNING id
            `;
      return successResponse(
        { updatedOrder },
        "Update order successfully",
        200
      );
    }
  ),
  viewOrderDetail: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.params;
      // Check if order existed
      const [order] = await sql`
                SELECT id FROM orders WHERE id = ${id}
            `;
      if (!order) {
        return errorResponse(`Order with id ${id} not found`, 404);
      }
      // View order detail with list of product and quantity
      const orderDetail = await sql`
                SELECT order_items.order_id, order_items.product_id, order_items.product_name, order_items.quantity, order_items.price
                FROM order_items
                WHERE order_id = ${id}
            `;

      return successResponse(
        { orderDetail },
        "View order detail successfully",
        200
      );
    }
  ),
  // get Revenue of all orders
  getTotalRevenue: controllerWrapper(
    async (_, res, { successResponse, sql }) => {
      // Get revenue
      const revenue = await sql`
                SELECT SUM(total) as revenue
                FROM orders
                WHERE status != 1304
            `;
      return successResponse(
        { revenue },
        "Get total revenue successfully",
        200
      );
    }
  ),

  getOrderStatsToday: controllerWrapper(
    async (_, res, { successResponse, sql }) => {
      const [orderStats] = await sql`
    SELECT COUNT(*) as total_orders,
    SUM(CASE WHEN status = ${OrderStatus.PENDING} THEN 1 ELSE 0 END) as pending_orders,
    SUM(CASE WHEN status = ${OrderStatus.DELIVERED} THEN 1 ELSE 0 END) as delivered_orders,
    SUM(CASE WHEN status = ${OrderStatus.CANCELED} THEN 1 ELSE 0 END) as canceled_orders
    FROM orders
  `;

      return successResponse({ orderStats }, "Get order stats", 200);
    }
  ),
};
export default ordersController;
