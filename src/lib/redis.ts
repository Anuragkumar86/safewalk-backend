import { Redis } from "ioredis";

// Use the environment variable, or fallback to local redis
const connectionString = process.env.REDIS_URL || "redis://redis:6379";

// Check if the URL starts with 'rediss://' (Upstash/Production requires this)
const isTls = connectionString.startsWith("rediss://");

export const redisConnection = new Redis(connectionString, {
    maxRetriesPerRequest: null,
    
    // CRITICAL: Upstash requires TLS (SSL) to be active
    // We only enable it if the connection string starts with 'rediss'
    tls: isTls ? {
        rejectUnauthorized: false // Necessary for many cloud Redis providers
    } : undefined,

    retryStrategy(times) {
        // Progressive backoff: wait longer between each failed attempt
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redisConnection.on("connect", () => console.log("✅ Redis Connected Successfully"));
redisConnection.on("error", (err) => console.error("❌ Redis Connection Error:", err));