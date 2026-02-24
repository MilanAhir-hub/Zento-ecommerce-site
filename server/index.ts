import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn("WARNING: GOOGLE_CLIENT_ID is not defined. Google OAuth will fail.");
}
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://zento-ecommerce-site.vercel.app",
        ],
        credentials: true,
    })
);

import cookieParser from "cookie-parser";
app.use(cookieParser());

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vendorRoutes from "./routes/vendor.routes";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorRoutes);

app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Database connection & Server start
import connectDB from "./config/db";

// Connect to MongoDB and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
