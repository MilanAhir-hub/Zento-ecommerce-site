import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

export const initIO = (httpServer: HttpServer): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://zento-ecommerce-site.vercel.app"
            ],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`🔌 Client disconnected from Socket.io: ${socket.id}`);
        });
    });

    console.log("🚀 Socket.io initialized");
    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};
