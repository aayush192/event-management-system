import IoRedis from "ioredis";
import config from "./config.js";
export const queueConnection = new IoRedis({
    host: config.REDIS_HOST || "localhost",
    port: config.REDIS_PORT ? parseInt(config.REDIS_PORT) : 6379,
    maxRetriesPerRequest: 5,
});
export const workerConnection = new IoRedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
});
