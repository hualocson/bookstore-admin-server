import { body, param } from "express-validator";
import adminAuthorization from "../middlewares/auth";
import couponsController from "../controllers/coupons.controller";
import { CouponStatus } from "@/lib/constants";
import { CouponType } from "@/lib/constants";
// INSERT INTO public.coupons
// (id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status, created_at, updated_at, deleted_at)
// VALUES(nextval('coupons_id_seq'::regclass), '', 0, 0, '', '', 0, 0, 0, 0, 0, now(), now(), '');
const couponsRoutes = (router) => {
    router.post(
        "/coupons",
        adminAuthorization(2),
        body("couponCode")
            .notEmpty()
            .withMessage("Coupon code is required")
            .isString()
            .withMessage("Coupon code must be a string"),
        body("couponType")
            .notEmpty()
            .withMessage("Coupon type is required")
            .isInt()
            .withMessage("Coupon type must be a number")
            .isIn(Object.values(CouponType))
            .withMessage("Coupon type must be in valid range"),
        body("couponValue")
            .notEmpty()
            .withMessage("Coupon value is required")
            .isInt()
            .withMessage("Coupon value must be a number"),
        body("couponStartDate")
            .notEmpty()
            .withMessage("Coupon start date is required")
            .isString()
            .withMessage("Coupon start date must be a string"),
        body("couponEndDate")
            .notEmpty()
            .withMessage("Coupon end date is required")
            .isString()
            .withMessage("Coupon end date must be a string"),
        body("couponMinSpend")
            .notEmpty()
            .withMessage("Coupon min spend is required")
            .isInt()
            .withMessage("Coupon min spend must be a number"),
        body("couponMaxSpend")
            .notEmpty()
            .withMessage("Coupon max spend is required")
            .isInt()
            .withMessage("Coupon max spend must be a number"),
        body("couponUsesPerCustomer")
            .notEmpty()
            .withMessage("Coupon uses per customer is required")
            .isInt()
            .withMessage("Coupon uses per customer must be a number"),
        body("couponUsesPerCoupon")
            .notEmpty()
            .withMessage("Coupon uses per coupon is required")
            .isInt()
            .withMessage("Coupon uses per coupon must be a number"),
        body("couponStatus")
            .notEmpty()
            .withMessage("Coupon status is required")
            .isInt()
            .withMessage("Coupon status must be a number")
            .isIn(Object.values(CouponStatus))
            .withMessage("Coupon status must be in valid range"),
        couponsController.createCoupon
    );
    router.get(
        "/coupons",
        adminAuthorization(2),
        couponsController.getAllCoupons
    );
    router.get(
        "/coupons/:id",
        adminAuthorization(2),
        couponsController.getCouponById
    );
    router.patch(
        "/coupons/:id",
        adminAuthorization(2),
        body("couponCode")
            .notEmpty()
            .withMessage("Coupon code is required")
            .isString()
            .withMessage("Coupon code must be a number"),
        body("couponType")
            .notEmpty()
            .withMessage("Coupon type is required")
            .isInt()
            .withMessage("Coupon type must be a number")
            .isIn(Object.values(CouponType))
            .withMessage("Coupon type must be in valid range"),
        body("couponValue")
            .notEmpty()
            .withMessage("Coupon value is required")
            .isInt()
            .withMessage("Coupon value must be a number"),
        body("couponStartDate")
            .notEmpty()
            .withMessage("Coupon start date is required")
            .isString()
            .withMessage("Coupon start date must be a string"),
        body("couponEndDate")
            .notEmpty()
            .withMessage("Coupon end date is required")
            .isString()
            .withMessage("Coupon end date must be a string"),
        body("couponMinSpend")
            .notEmpty()
            .withMessage("Coupon min spend is required")
            .isInt()
            .withMessage("Coupon min spend must be a number"),
        body("couponMaxSpend")
            .notEmpty()
            .withMessage("Coupon max spend is required")
            .isInt()
            .withMessage("Coupon max spend must be a number"),
        body("couponUsesPerCustomer")
            .notEmpty()
            .withMessage("Coupon uses per customer is required")
            .isInt()
            .withMessage("Coupon uses per customer must be a number"),
        body("couponUsesPerCoupon")
            .notEmpty()
            .withMessage("Coupon uses per coupon is required")
            .isInt()
            .withMessage("Coupon uses per coupon must be a number"),
        body("couponStatus")
            .notEmpty()
            .withMessage("Coupon status is required")
            .isInt()
            .withMessage("Coupon status must be a number")
            .isIn(Object.values(CouponStatus))
            .withMessage("Coupon status must be in valid range"),
        couponsController.updateCoupon
    );
}

export default couponsRoutes;
