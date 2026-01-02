import "dotenv/config";
import { Worker } from "bullmq";
import prisma from "../lib/prismaDb.js";
import { sendEmergencyEmail } from "../lib/mail.js";
import { createRedisConnection } from "../lib/redis.js";

export const safetyWorker = new Worker(
  "safety-timer",
  async (job) => {
    const { sessionId } = job.data;

    const session = await prisma.walkSession.findUnique({
      where: { id: sessionId },
      include: {
        user: { include: { contacts: true } },
      },
    });

    if (!session) return;
    if (session.status !== "ACTIVE") return;

    await prisma.walkSession.update({
      where: { id: sessionId },
      data: { status: "DANGER" },
    });

    for (const contact of session.user.contacts) {
      try {
        await sendEmergencyEmail(
          contact.email,
          session.user.name,
          session.lastKnownLat,
          session.lastKnownLng,
          sessionId
        );
      } catch (err) {
        console.error(`❌ Email failed to ${contact.email}`);
      }
    }
  },
  {
    connection: createRedisConnection(),
    concurrency: 5,
  }
);

safetyWorker.on("ready", () => {
  console.log("✅ Safety worker ready");
});

safetyWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});
