import { controllerWrapper } from "@/lib/controller.wrapper";
import authUtils from "@/lib/utils/auth.utils";
import { jwtGenerator } from "@/lib/utils/jwt.utils";
import jwt from "jsonwebtoken";

const authController = {
  getAdmin: controllerWrapper(async (req, _, { successResponse, sql }) => {
    const data = await sql`SELECT * FROM admin.admins`;
    successResponse(
      {
        data,
      },
      "This is message for success response"
    );
  }),

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

      res.cookie("admin-auth", token, {
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      });

      return successResponse(
        {
          token: jwt.decode(token),
        },
        "Login successful."
      );
    }
  ),
};

export default authController;
