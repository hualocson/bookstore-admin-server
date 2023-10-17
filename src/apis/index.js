import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import assetsRoutes from "./routes/assets.routes";
import categoriesRoutes from "./routes/categories.routes";
import productsRoutes from "./routes/products.routes";
import ordersRoutes from "./routes/orders.routes";
import orderItemsRoutes from "./routes/orderItems.routes";
// guaranteed to get dependencies
export default () => {
  const app = Router();
  authRoutes(app);
  assetsRoutes(app);
  categoriesRoutes(app);
  productsRoutes(app);
  ordersRoutes(app);
  orderItemsRoutes(app);
  return app;
};
