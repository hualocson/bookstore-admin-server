import http from "http";
import startApp from "./app.js";
import logger from "./configs/logger.js";
import configs from "./configs/vars.js";

const server = http.createServer(startApp());

server.listen(configs.port, () => {
  logger.info(`Listening to port ${configs.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
