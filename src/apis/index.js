import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import assetsRoutes from "./routes/assets.routes";
import categoriesRoutes from "./routes/categories.routes";
import productsRoutes from "./routes/products.routes";
import addressesRoutes from "./routes/addresses.routes";
import customersRoutes from "./routes/customers.routes";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  authRoutes(app);
  assetsRoutes(app);
  categoriesRoutes(app);
  productsRoutes(app);
  addressesRoutes(app);
  customersRoutes(app);
  return app;
};
