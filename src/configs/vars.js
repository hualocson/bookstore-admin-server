import * as dotenv from "dotenv";
import osHelpers from "@/lib/helpers.js";

dotenv.config();
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
  port: osHelpers.toNumber(osHelpers.getOsEnv("PORT")) || 5000,
  dbHost: osHelpers.getOsEnv("PG_HOST"),
  dbPort: osHelpers.getOsEnv("PG_PORT"),
  dbUser: osHelpers.getOsEnv("PG_USER"),
  dbPassword: osHelpers.getOsEnv("PG_PASSWORD"),
  dbName: osHelpers.getOsEnv("PG_DATABASE"),
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
  /**
   * API configs
   */
  api: {
    prefixV1: "/api/admin/v1",
  },

  // JWT
  jwtSecret: osHelpers.getOsEnv("JWT_SECRET"),
  jwtExpiresIn: osHelpers.getOsEnv("JWT_EXPIRES_IN"),

  // Cloudinary
  cloudinary: {
    cloudName: osHelpers.getOsEnv("CLOUD_NAME"),
    apiKey: osHelpers.getOsEnv("CLOUD_API_KEY"),
    apiSecret: osHelpers.getOsEnv("CLOUD_API_SECRET"),
  },

  // redis
  redisHost: osHelpers.getOsEnv("REDIS_HOST"),
  redisPort: osHelpers.getOsEnv("REDIS_PORT"),
  redisPassword: osHelpers.getOsEnvOptional("REDIS_PASSWORD"),
};
