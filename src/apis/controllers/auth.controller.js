import { controllerWrapper } from "@/lib/controller.wrapper";
import authUtils from "@/lib/utils/auth.utils";
import { jwtGenerator, verifyJwt } from "@/lib/utils/jwt.utils";
import jwt from "jsonwebtoken";

const authController = {
  hashPassword: controllerWrapper(
    async (req, _, { successResponse, errorResponse, sql }) => {
      const { password, username } = req.body;
      const hashedPassword = await authUtils.hashPassword(password);

      // check admin exits
      const admin =
        await sql`SELECT id FROM admin.admins WHERE username = ${username}`;
      if (admin[0]) {
        return errorResponse("Admin already exists!", 400);
      }

      const newAdmin =
        await sql`INSERT INTO admin.admins (username, user_password, admin_rank) VALUES (${username}, ${hashedPassword}, 3) RETURNING username, user_password as password, admin_rank as rank`;

      successResponse(
        {
          newAdmin: newAdmin[0],
        },
        "This is message for success response"
      );
    }
  ),

  loginAdmin: controllerWrapper(
    async (req, res, { errorResponse, successResponse, sql }) => {
      const { username, password } = req.body;

      // get admin and password
      const admin =
        await sql`SELECT username, user_password AS password, admin_rank FROM admin.admins WHERE username = ${username}`;

      if (admin.length === 0) {
        errorResponse("Password or Email is incorrect.", 401);
        return;
      }

      // Verify password
      const storedPassword = admin[0].password;
      const validPassword = await authUtils.verifyPassword(
        password,
        storedPassword
      );

      if (!validPassword) {
        errorResponse("Password or Email is incorrect.", 401);
        return;
      }

      const payload = { username, adminRank: admin[0].adminRank };
      const token = jwtGenerator(payload);

      // save token to cookie
      res.cookie("admin_auth", token, {
        httpOnly: true,
        // secure: true, // only https
        sameSite: "none",
      });

      return successResponse(
        {
          payload: jwt.decode(token),
          token,
        },
        "Login successful."
      );
    }
  ),
  logoutAdmin: controllerWrapper(async (_, res, { successResponse }) => {
    // clear cookie
    res.clearCookie("admin_auth");

    return successResponse({}, "Logout successful.", 200);
  }),

  getAdminData: controllerWrapper(
    async (req, _, { errorResponse, successResponse }) => {
      const token = req.cookies.admin_auth;

      if (!token) return errorResponse("Token not found.", 404);

      const { payload, error } = verifyJwt(token);

      if (error) {
        if (error.name === "TokenExpiredError")
          return errorResponse("Token expired.", 401);

        return errorResponse("Token invalid.", 401);
      }

      return successResponse(
        { payload },
        "Retrieve admin data successful",
        200
      );
    }
  ),
};

export default authController;
