import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { initIO } from "./utils/socket";

// Route Imports
console.log("!!! INDEX.TS LOADED !!!");
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vendorRoutes from "./routes/vendor.routes";
import productRoutes from "./routes/product.routes";
import adminRoutes from "./routes/admin.routes";
import aiRoutes from "./routes/ai.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import paymentRoutes from "./routes/payment.routes";
console.log("📦 Auth routes loaded");
console.log("📦 User routes loaded");
console.log("📦 Vendor routes loaded");
console.log("📦 Product routes loaded");
console.log("📦 Admin routes loaded");
console.log("📦 AI routes loaded");

import connectDB from "./config/db";
import { initializeModelDiscovery } from "./config/gemini.config";

// --- Initialize AI Model Discovery ---
initializeModelDiscovery();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn("WARNING: GOOGLE_CLIENT_ID is not defined. Google OAuth will fail.");
}

const app = express();
const server = http.createServer(app);
initIO(server);

const PORT = process.env.PORT || 5000;

// GLOBAL LOGGER (For debugging 404s)
app.use((req, res, next) => {
    console.log(`🔥 [GLOBAL HIT] ${req.method} ${req.originalUrl || req.url}`);
    next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:5173",
                "http://10.27.247.152:8081",
                "https://zento-ecommerce-site.vercel.app",
            ];
            
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
                callback(null, true);
            } else {
                console.warn(`⚠️ CORS blocked for origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

import interactionRoutes from "./routes/interaction.routes";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vendor", (req, res, next) => {
    console.log("🛠️ app.use /api/vendor is triggered");
    next();
}, vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/live-test", (req, res) => {
    res.send("Live Config OK - Nodemon is working!");
});

app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Global 404 handler
app.use((req, res) => {
    console.log("Route not found:", req.method, req.url);
    res.status(404).json({ message: "Route not found" });
});

// Database connection & Server start
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
    });
});
