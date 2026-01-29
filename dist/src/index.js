import express from "express";
import config from "./config/config";
import router from "./routes";
import { errorHandler } from "./utils/apiError";
const app = express();
app.use(express.json());
app.use("/", router);
app.use(errorHandler);
app.listen(config.PORT, () => {
    console.log("server has started");
});
