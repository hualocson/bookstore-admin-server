import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import assetsRoutes from "./routes/assets.routes";
import categoriesRoutes from "./routes/categories.routes";
import productsRoutes from "./routes/products.routes";
import ordersRoutes from "./routes/orders.routes";
import orderItemsRoutes from "./routes/orderItems.routes";
import addressesRoutes from "./routes/addresses.routes";
import customersRoutes from "./routes/customers.routes";
import couponsRoutes from "./routes/coupons.routes";
import productDetailsRoutes from "./routes/productDetails.routes";
import statisticsRoute from "./routes/statistics.routes";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  authRoutes(app);
  assetsRoutes(app);
  categoriesRoutes(app);
  productsRoutes(app);
  productDetailsRoutes(app);
  ordersRoutes(app);
  orderItemsRoutes(app);
  addressesRoutes(app);
  customersRoutes(app);
  couponsRoutes(app);
  statisticsRoute(app);
  return app;
};
