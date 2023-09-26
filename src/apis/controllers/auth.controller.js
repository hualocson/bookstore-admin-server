import { controllerWrapper } from "@/lib/controller.wrapper";
import authUtils from "@/lib/utils/auth.utils";

const authController = {
  getAdmin: controllerWrapper(async (req, { successResponse, sql }) => {
    const data = await sql`SELECT * FROM admin.admins`;
    successResponse(
      {
        data,
      },
      "This is message for success response"
    );
  }),

  hashPassword: controllerWrapper(
    async (req, { successResponse, errorResponse, sql }) => {
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
};

export default authController;
