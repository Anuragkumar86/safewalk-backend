import { Queue } from "bullmq"
import { redisConnection } from "../lib/redis.js"

export const safetyQueue = new Queue("safety-timer", {
    connection: redisConnection
})