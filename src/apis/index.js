import { Router } from "express";
import authRoutes from "./routes/auth.routes";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  authRoutes(app);

  return app;
};
