import { controllerWrapper } from "@/lib/controller.wrapper";

const orderItemsController =  {
    //create Order Items
    createOrderItems: controllerWrapper(
        async(req, res, {errorResponse, successResponse, sql}) => {
            const {orderId, productId, quantity} = req.body;
            const [product] = await sql`
                SELECT name, price
                FROM products
                WHERE id = ${productId}
            `;
            //kiểm tra sản phẩm có tồn tại hay không
            if(!product){
                return errorResponse("Product not found", 404);
            }
            const [orderItem] = await sql`
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
                VALUES (${orderId}, ${productId}, ${product.name}, ${quantity}, ${product.price})
                RETURNING order_id, product_id, product_name, quantity, price
            `;
            //trả về order item
            return successResponse(
                {orderItem},
                "Create order item successfully",
                200
            );
        }
    )
}
export default orderItemsController;