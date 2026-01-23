import express from "express";
import config from "./config/config";
import router from "./routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/globalErrorHandler";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.use(errorHandler);
app.use(express.urlencoded({ extended: true }));
app.listen(config.PORT, () => {
  console.log("server has started");
});
