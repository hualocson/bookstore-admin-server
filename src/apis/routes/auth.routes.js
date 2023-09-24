import sql from "@/configs/db";
import { camelize } from "@/lib/utils";

const authRoutes = (router) => {
  router.get("/auth", async (req, res) => {
    const q = await sql`Select * From admin.admins`;

    res.json({ data: camelize(q) });
  });
};

export default authRoutes;
