import mongoose from "mongoose";
import dns from "dns";

const connectDB = async (): Promise<void> => {
    try {
        // Set DNS servers to Google DNS to bypass ISP/local DNS resolution issues for SRV records
        try {
            dns.setServers(["8.8.8.8", "8.8.4.4"]);
        } catch (dnsErr) {
            console.warn("⚠️ Warning: Failed to set custom DNS servers:", dnsErr);
        }

        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

        await mongoose.connect(mongoUri);

        console.log("✅ MongoDB connected");
    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ Error connecting to MongoDB:", error.message);
        } else {
            console.error("❌ Unknown error connecting to MongoDB");
        }

        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;