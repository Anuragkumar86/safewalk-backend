import { Redis } from "ioredis"

// This logic allows it to work BOTH locally and on AWS/Docker
const connectionString = process.env.REDIS_URL || "redis://redis:6379";

export const redisConnection = new Redis(connectionString, {
    maxRetriesPerRequest: null,
    // Add this to see connection errors in your 'docker logs'
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
})

redisConnection.on("error", (err) => console.error("Redis Connection Error:", err));