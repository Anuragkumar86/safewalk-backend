import { Queue } from "bullmq";
import { createRedisConnection } from "../lib/redis.js";

export const safetyQueue = new Queue("safety-timer", {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 50,
  },
});
