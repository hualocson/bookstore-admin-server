import express from "express";

import loaders from "@/loaders/express";
import loadRedisStore from "@/loaders/redis-store";

const startApp = () => {
  const app = express();
  loaders(app);
  loadRedisStore();
  return app;
};

export default startApp;
