import { controllerWrapper } from "@/lib/controller.wrapper";

const customersController = {
  getAllCustomers: controllerWrapper(
    async (_, res, { errorResponse, successResponse, sql }) => {
      const customers = await sql`
          SELECT id, email, status
          FROM customers
        `;

      return successResponse(
        { customers },
        "Get all customers successfully",
        200
      );
    }
  ),

  updateCustomerStatus: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { status } = req.body;
      const { id } = req.params;

      const [existingStatus] = await sql`
        SELECT status FROM customers WHERE id = ${id} AND deleted_at IS NULL
      `;

      if (!existingStatus) {
        return errorResponse(
          `Customer with id ${id} not found or deleted`,
          404
        );
      }

      const [customer] = await sql`
        UPDATE customers
        SET status = ${status}
        WHERE id = ${id}
        RETURNING id, email, status
      `;

      return successResponse(
        { customer },
        "Update customer status successfully",
        200
      );
    }
  ),
};

export default customersController;
