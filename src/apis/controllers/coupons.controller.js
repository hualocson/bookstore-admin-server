const { controllerWrapper } = require("@/lib/controller.wrapper");
import { CouponStatus } from "@/lib/constants";
const couponsController = {
    createCoupon: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
            const { couponCode, couponType, couponValue, couponStartDate, couponEndDate, couponMinSpend, couponMaxSpend, couponUsesPerCustomer, couponUsesPerCoupon, couponStatus } = req.body;
            const [newCoupon] = await sql`
                INSERT INTO coupons (coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status)
                VALUES (${couponCode}, ${couponType}, ${couponValue}, ${couponStartDate}, ${couponEndDate}, ${couponMinSpend}, ${couponMaxSpend}, ${couponUsesPerCustomer}, ${couponUsesPerCoupon}, ${couponStatus})
                RETURNING id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status
            `;
            return successResponse(
                { newCoupon },
                "Create new coupon successfully",
                200
            );
        }
    ),
    //Get all id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status, created_at, updated_at, deleted_at chuyển sang camel case
    getAllCoupons: controllerWrapper(
        async (_, res, { errorResponse, successResponse, sql }) => {
            const coupons = await sql`
                SELECT id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status, created_at, updated_at, deleted_at
                FROM coupons
            `;
            return successResponse(
                { coupons },
                "Get all coupons successfully",
                200
            );
        }
    ),
    getCouponById: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
            const { id } = req.params;
            const [coupon] = await sql`
                SELECT id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status, created_at, updated_at, deleted_at
                FROM coupons
                WHERE id = ${id}
            `;
            if (!coupon) {
                return errorResponse(
                    `Coupon with coupon id ${id} not found or deleted`,
                    404
                );
            }
            return successResponse(
                { coupon },
                "Get coupon by id successfully",
                200
            );
        }
    ),
    updateCoupon: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
            const { id } = req.params;
            const { couponCode, couponType, couponValue, couponStartDate, couponEndDate, couponMinSpend, couponMaxSpend, couponUsesPerCustomer, couponUsesPerCoupon, couponStatus } = req.body;
            const [couponId] = await sql`
                SELECT id FROM coupons WHERE id = ${id} AND deleted_at IS NULL
            `;
            if (!couponId) {
                return errorResponse(
                    `Coupon with coupon id ${id} not found or deleted`,
                    404
                );
            }
            const [coupon] = await sql`
                UPDATE coupons
                SET coupon_code = ${couponCode}, coupon_type = ${couponType}, coupon_value = ${couponValue}, coupon_start_date = ${couponStartDate}, coupon_end_date = ${couponEndDate}, coupon_min_spend = ${couponMinSpend}, coupon_max_spend = ${couponMaxSpend}, coupon_uses_per_customer = ${couponUsesPerCustomer}, coupon_uses_per_coupon = ${couponUsesPerCoupon}, coupon_status = ${couponStatus}
                WHERE id = ${id}
                RETURNING id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status
            `;
            return successResponse(
                { coupon },
                "Update coupon successfully",
                200
            );
        }
    )
};

export default couponsController;