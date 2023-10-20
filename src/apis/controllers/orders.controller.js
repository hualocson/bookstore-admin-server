import { controllerWrapper } from "@/lib/controller.wrapper";
import orderItemsController from "./orderItems.controller";
import { OrderStatus } from "@/lib/constants";
const cartData = [
    { customerId: 1, productId: 22, quantity: 3 },
    { customerId: 1, productId: 23, quantity: 2 },
    { customerId: 1, productId: 24, quantity: 1 }
  ];

const ordersController = 
{
    //Create new order
    createOrder: controllerWrapper(
        async(req, res, {errorResponse, successResponse, sql, redis}) => {
            const {customerId, addressId, shippingFee, couponType } = req.body;
            
            // Check if customer exists
            const [customer] = await sql`
                SELECT id FROM customers WHERE id = ${customerId}
            `;
            if (!customer) {
                return errorResponse(`Customer with id ${customerId} not found`, 404);
            }

            // Check if address exists
            const [address] = await sql`
                SELECT id FROM addresses WHERE id = ${addressId}
            `;
            if (!address) {
                return errorResponse(`Address with id ${addressId} not found`, 404);
            }

            // Check if coupon exists
            const [coupon] = await sql`
                SELECT id FROM coupons WHERE coupon_type = ${couponType}
            `;
            if (couponType && !coupon) {
                return errorResponse(`Coupon with code ${couponType} not found`, 404);
            }

            // Create new empty order
            const [newOrder] = await sql`
                INSERT INTO orders (customer_id, status, shipping_fee, total, address_id, coupon_id)
                VALUES (${customerId}, ${OrderStatus.PENDING}, ${shippingFee}, 0, ${addressId}, ${couponType ? coupon.id : null})
                RETURNING id,customer_id, status, shipping_fee, address_id, coupon_id
            `;

            //Create order items from cartData and new empty order ID
            const orderItems = cartData.map((item) => {
                return {
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity
                };
            }
            );

            // Create order items
            await Promise.all(
                orderItems.map(async (item) => {
                    const { orderId, productId, quantity } = item;
                    const [product] = await sql`
                        SELECT name, price
                        FROM products
                        WHERE id = ${productId}
                    `;
                    // Check if product exists
                    if (!product) {
                        return errorResponse(`Product with id ${productId} not found`, 404);
                    }
                    // Create order item
                    const [orderItem] = await sql`
                        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
                        VALUES (${orderId}, ${productId}, ${product.name}, ${quantity}, ${product.price})
                        RETURNING order_id, product_id, product_name, quantity, price
                    `;
                    
                    // Update total price of order
                    await sql`
                        UPDATE orders
                        SET total = total + ${orderItem.price * orderItem.quantity}
                        WHERE id = ${orderId}
                    `;
                })
            );

            //Update quantity of product after create order items
            await Promise.all(
                orderItems.map(async (item) => {
                    const { productId: temporaryProductId, quantity } = item;
                    const [product] = await sql`
                        SELECT id, quantity
                        FROM products
                        WHERE id = ${temporaryProductId}
                    `;
                    // Check if product exists
                    if (!product) {
                        return errorResponse(`Product with id ${temporaryProductId} not found`, 404);
                    }
                    // Update quantity of product
                    await sql`
                        UPDATE products
                        SET quantity = quantity - ${quantity}
                        WHERE id = ${temporaryProductId}
                    `;
                })
            );

            // Return new order
            return successResponse(
                { newOrder },
                "Create new order successfully",
                201
            );
        }
    ),
    //Get all orders
    getAllOrders: controllerWrapper(
        async(_,res,{errorResponse,successResponse,sql})=>
        {
            //get all attributes of an order
            const orders = await sql`
                SELECT id,customer_id,status,shipping_fee,total,coupon_id,created_at,updated_at,deleted_at,canceled_at,completed_at, delivery_at
                FROM orders
            `;
            return successResponse(
                {orders},
                "Get all orders successfully",
                200
            );
        }
    ),
    //Get order by id
    getOrderById: controllerWrapper(
        async(req,_,{errorResponse,successResponse,sql})=>
        {
            const {id} = req.params;
            //Check if order existed
            const [orderById] = await sql`
                SELECT id,customer_id,status,shipping_fee,total,coupon_id,created_at,updated_at,deleted_at,canceled_at,completed_at, delivery_at
                FROM orders
                WHERE id = ${id}
            `;
            if(!orderById)
            {
                return errorResponse(`Order with id ${id} not found`,404);
            }
            //Get all attributes of order by id
            return successResponse(
                {orderById},
                "Get order by id successfully",
                200
            );
        }
    ),
    //Get all orders by customerId
    getAllOrdersByCustomerId: controllerWrapper(
        async(req,_,{errorResponse,successResponse,sql})=>
        {
            const {customerId} = req.params;
            //Check if customerId existed
            const orders = await sql`
                SELECT id,customer_id,status,shipping_fee,total,coupon_id,created_at,updated_at,deleted_at,canceled_at,completed_at, delivery_at
                FROM orders
                WHERE customer_id = ${customerId}
            `;
            if(!orders)
            {
                return errorResponse(`Orders with customerId ${customerId} not found`,404);
            }
            //Get all attribute of orders by customerId
            return successResponse(
            {orders},
            "Get all orders by customerId successfully",
            200
            );
        }
    ),
    //Update only status of order
    updateOrder: controllerWrapper(
        async(req,_,{errorResponse,successResponse,sql})=>
        {
            const {status} = req.body;
            const {id} = req.params;
            //Check if order existed
            const [order] = await sql`
                SELECT id FROM orders WHERE id = ${id}
            `;
            if(!order)
            {
                return errorResponse(`Order with id ${id} not found`,404);
            }

            //Update order
            const [updatedOrder] = await sql`
                UPDATE orders
                SET status = ${status}
                WHERE id = ${id}
                RETURNING id,customer_id,status,shipping_fee,total,coupon_id
            `;
            return successResponse(
                {updatedOrder},
                "Update order successfully",
                200
            );
        }
    ),
    //View Order detail by Trả về thông tin chi tiết của đơn hàng, bao gồm sản phẩm, số lượng, giá tiền, địa chỉ giao hàng, và trạng thái đơn hàng.
    viewOrderDetail: controllerWrapper(
        async(req,_,{errorResponse,successResponse,sql})=>
        {
            const {id} = req.params;
            //Check if order existed
            const [order] = await sql`
                SELECT id FROM orders WHERE id = ${id}
            `;
            if(!order)
            {
                return errorResponse(`Order with id ${id} not found`,404);
            }
            //View order detail with list of product and quantity
            const orderDetail = await sql`
                SELECT order_items.order_id, order_items.product_id, order_items.product_name, order_items.quantity, order_items.price
                FROM order_items
                WHERE order_id = ${id}
            `;
            
            
            return successResponse(
                {orderDetail},
                "View order detail successfully",
                200
            );
        }
    ),
    //get Revenue of all orders
    getTotalRevenue: controllerWrapper(
        async(_,res,{errorResponse,successResponse,sql})=>
        {
            //Get revenue
            const revenue = await sql`
                SELECT SUM(total) as revenue
                FROM orders
                WHERE status != 1304
            `;
            return successResponse(
                {revenue},
                "Get total revenue successfully",
                200
            );
        }
    ),
    //Get revenue of orders by customerId
    getRevenueByCustomerId: controllerWrapper(
        async(req,_,{errorResponse,successResponse,sql})=>
        {
            const {customerId} = req.params;
            //Check if customerId existed
            const [customer] = await sql`
                SELECT id FROM customers WHERE id = ${customerId}
            `;
            if(!customer)
            {
                return errorResponse(`Customer with id ${customerId} not found`,404);
            }
            //Get revenue
            const revenue = await sql`
                SELECT SUM(total) as revenue
                FROM orders
                WHERE customer_id = ${customerId} AND status != 1304
            `;
            return successResponse(
                {revenue},
                "Get revenue successfully",
                200
            );
        }
    )
}
export default ordersController;