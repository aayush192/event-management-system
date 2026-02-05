import IoRedis from "ioredis";
import { Job, Queue, Worker } from "bullmq";
import config from "../config/config";
export const queueConnection = new IoRedis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT ? parseInt(config.REDIS_PORT) : 6379,
  maxRetriesPerRequest: 5,
});

export const workerConnection = new IoRedis({
  host: config.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
});
