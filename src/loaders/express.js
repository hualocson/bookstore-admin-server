import cors from "cors";
import bodyParser from "body-parser";
import morgan from "@/configs/morgan.js";
import configs from "@/configs/vars.js";
import helmet from "helmet";
import routes from "@/apis";
import cookieParser from "cookie-parser";
import { errorConverter, errorHandler } from "@/middlewares/error.handler";

export default (app) => {
  if (!configs.isTest) {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }

  // app.use(helmet());

  // app.enable("trust proxy");

  app.use(cookieParser());
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Load API routes
  app.use(configs.api.prefixV1, routes());

  app.use(errorConverter);
  app.use(errorHandler);
};
