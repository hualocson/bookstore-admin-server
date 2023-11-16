import { controllerWrapper } from "@/lib/controller.wrapper";

const statisticsController = {
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
    // Get revenue of orders by customerId
    getRevenueByCustomerId: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
        const { customerId } = req.params;
        // Check if customerId existed
        const [customer] = await sql`
                    SELECT id FROM customers WHERE id = ${customerId}
                `;
        if (!customer) {
            return errorResponse(`Customer with id ${customerId} not found`, 404);
        }
        // Get revenue
        const revenue = await sql`
                    SELECT SUM(total) as revenue
                    FROM orders
                    WHERE customer_id = ${customerId} AND status != 1304
                `;
        return successResponse({ revenue }, "Get revenue successfully", 200);
        }
    ),
    //Get total product has been bought by productId
    getTotalProductByProductId: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
        const { productId } = req.params;
        // Check if productId existed
        const [product] = await sql`
                    SELECT id FROM products WHERE id = ${productId}
                `;
        if (!product) {
            return errorResponse(`Product with id ${productId} not found`, 404);
        }
        // Get total product
        const [total] = await sql`
                    SELECT SUM(quantity) as total
                    FROM order_details
                    WHERE product_id = ${productId}
                `;
        return successResponse({ total }, "Get total product successfully", 200);
        }
    ),
    //Get total orders of a user
    getTotalOrderByUserId: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
        const { userId } = req.params;
        // Check if userId existed
        const [user] = await sql`
                    SELECT id FROM users WHERE id = ${userId}
                `;
        if (!user) {
            return errorResponse(`User with id ${userId} not found`, 404);
        }
        // Get total orders
        const [total] = await sql`
                    SELECT COUNT(id) as total
                    FROM orders
                    WHERE user_id = ${userId}
                `;
        return successResponse({ total }, "Get total orders successfully", 200);
        }
    )
    //Get total revenue in a month, input dates
    
}
//Export
export default statisticsController;
