import jwt from "jsonwebtoken";
import configs from "@/configs/vars";
import ApiError from "@/lib/api-error";

export default function adminAuthorization(adminRequiredRank) {
  return async (req, res, next) => {
    try {
      const jwtToken = req.cookies.admin_auth;

      if (!jwtToken) {
        next(new ApiError(403, "Access unauthorized. Please login."));
      }

      const payload = jwt.verify(jwtToken, configs.jwtSecret);

      if (!payload.adminRank) {
        next(
          new ApiError(
            403,
            "Access unauthorized. Please login with admin account."
          )
        );
      }

      if (payload.adminRank < adminRequiredRank) {
        next(
          new ApiError(
            403,
            "Not enough privilege to execute this request. Contact admin."
          )
        );
      }

      next();
    } catch (error) {
      next(new ApiError(403, "Access unauthorized. Please login."));
    }
  };
}
