import express from "express";
import config from "./config/config.js";
import router from "./routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/globalErrorHandler.utils";
import "./utils/otpCleanUp.utils";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.use(errorHandler);
app.listen(config.PORT, () => {
  console.log("server has started");
});
