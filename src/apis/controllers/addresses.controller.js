import { controllerWrapper } from "@/lib/controller.wrapper";
import { slugify } from "@/lib/utils/common";

const addressesController = {
    getAllAddresses: controllerWrapper(
        async (_, res, { errorResponse, successResponse, sql }) => {
          const addresses = await sql`
            SELECT customer_id, street_address, city, state, postal_code, country, phone_number
            FROM addresses
          `;
    
          return successResponse(
            { addresses },
            "Get all addresses successfully",
            200
          );
        }
      ),
};
  
export default addressesController;
