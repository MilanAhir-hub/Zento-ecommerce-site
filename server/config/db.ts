import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
            console.error("Unknown error connecting to MongoDB");
        }

        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;