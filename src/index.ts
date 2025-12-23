
import "dotenv/config"
import './workers/safetyWorker.js'; 
import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io";
import prisma from "./lib/prismaDb.js";
import walkRoutes from "./routes/walkRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import contactRoutes from "./routes/ContactRoute.js"


const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin: "*",
        methods: ["POST", "GET"]
    }
})

app.use(express.json());
app.use(cors());

app.use((req: any, res, next) => {
    req.io = io;
    next();
})

app.use("/api/walk", walkRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

io.on("connection", (socket) => {
    console.log("SOCKET Mobile connected: ", socket.id)

    socket.on("join-walk", (sessionId) => {
        socket.join(sessionId)
        console.log(`👤 User joined room: ${sessionId}`);
    })

    socket.on("update-location", async(data) => {
        const { lat, log, sessionId } = await data

        console.log(`Received location update from ${socket.id}`)

        try{

            await prisma.walkSession.update({
                where: {id: sessionId},
                data:{
                    lastKnownLat: lat,
                    lastKnownLng: log
                }
            })

            socket.to(sessionId).emit("location-broadcast", {lat, log})
        }
        catch(err){
            console.error("Failed to update location in DB", err);
        }
    })

    socket.on("disconnection", () => {
        console.log("Mobile DISconnected: ", socket.id)
    })


})


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log("App is listening at port: ", PORT);
})

