import type { Request, Response } from "express";
import prisma from "../lib/prismaDb.js";
import { safetyQueue } from "../queues/safetyQueue.js";


export const startWalk = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { durationMinutes, startLat, startLon } = req.body;

        if (!userId || !durationMinutes || startLat === undefined || startLon === undefined) {
            return res.status(400).json({ message: "All fields required" });
        }

        const session = await prisma.walkSession.create({
            data: {
                userId,
                lastKnownLat: startLat,
                lastKnownLng: startLon,
                status: "ACTIVE"
            }
        });

        const delay = durationMinutes * 60 * 1000;

        // Using jobId: session.id prevents duplicate jobs for the same session
        const job = await safetyQueue.add(
            "safety-check",
            { sessionId: session.id, userId },
            { delay, jobId: session.id } 
        );

        await prisma.walkSession.update({
            where: { id: session.id },
            data: { bullMqJobId: job.id }
        });

        console.log(`🚀 Walk started. Job ${job.id} queued for ${durationMinutes}m`);
        res.status(201).json({ message: 'Walk started', sessionId: session.id });
    } catch (error) {
        console.error("START WALK ERROR:", error);
        res.status(500).json({ error: "Failed to start walk" });
    }
};


export const markSafe = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body

        const session = await prisma.walkSession.findUnique({
            where: { id: sessionId }
        })

        if (session && session.bullMqJobId) {
            const job = await safetyQueue.getJob(session.bullMqJobId);
            if (job) await job.remove();
        }

        await prisma.walkSession.update({
            where: { id: session?.id as string },
            data: {
                status: "SAFE",
                endTime: new Date()
            }
        })

        console.log("Glad you are safe!")

        res.status(200).json({ message: 'Glad you are safe!' });
    }
    catch (err) {
        res.status(501).json({
            messasge: "Error occured while marking safe: ", err
        })
    }
}




export const getWalkHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const history = await prisma.walkSession.findMany({
            where: { userId: userId },
            orderBy: { startTime: 'desc' }, 
            select: {
                id: true,
                status: true,
                startTime: true, // This exists in your schema
                endTime: true,
                lastKnownLat: true,
                lastKnownLng: true,
                // REMOVED durationMinutes because it's not in your schema!
            }
        });

        res.json(history);
    } catch (error: any) {
        // This will print the exact Prisma error in your VS Code terminal
        // console.error("Detailed Prisma Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getPublicSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params ;

        const session = await prisma.walkSession.findUnique({
            where: { id: sessionId as string },
            select: {
                status: true,
                lastKnownLat: true,
                lastKnownLng: true,
                startTime: true,
                user: {
                    select: { name: true }
                }
            }
        });

        if (!session) return res.status(404).json({ message: "Alert session not found" });
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

