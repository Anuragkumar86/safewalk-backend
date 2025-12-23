import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../lib/redis.js";
import prisma from "../lib/prismaDb.js";
import { sendEmergencyEmail } from "../lib/mail.js";

export const safetyWorker = new Worker("safety-timer", async (job) => {
    const { sessionId, userId } = job.data;

    // Fetch session and contacts
    const session = await prisma.walkSession.findUnique({
        where: { id: sessionId },
        include: { user: { include: { contacts: true } } }
    });

    // Check if session exists and is still ACTIVE (User didn't click "I am safe")
    if (session && session.status === "ACTIVE") {
        console.log(`🚨 ALERT TRIGGERED: User ${session.user.name} (${userId}) timed out.`);

        // 1. Update status to DANGER in DB
        await prisma.walkSession.update({
            where: { id: sessionId },
            data: { status: "DANGER" }
        });

        // 2. Send Emails to all contacts
        // FIX: Use for...of instead of forEach to ensure emails are sent before job finishes
        for (const contact of session.user.contacts) {
            console.log(`Sending emergency email to ${contact.email}...`);
            try {
                await sendEmergencyEmail(
                    contact.email,
                    session.user.name,
                    session.lastKnownLat,
                    session.lastKnownLng,
                    sessionId // Pass the ID for the custom tracking link
                );
            } catch (err) {
                console.error(`Failed to send to ${contact.email}:`, err);
            }
        }
    } else {
        console.log(`✅ Session ${sessionId} is already ${session?.status}. No alert needed.`);
    }
}, {
    connection: redisConnection
});

safetyWorker.on('ready', () => {
    console.log("✅ Safety Worker is connected and listening for jobs");
});

safetyWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});