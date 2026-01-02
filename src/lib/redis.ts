import { Redis } from "ioredis";

export function createRedisConnection() {
  const redis = new Redis(process.env.REDIS_URL!, {
    tls: {},                  // REQUIRED for Upstash
    maxRetriesPerRequest: null, // REQUIRED for BullMQ
    connectTimeout: 10000,
  });

  redis.once("ready", () => {
    console.log("✅ Redis ready");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });

  return redis;
}
