import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
    vendorId: mongoose.Types.ObjectId;
    title: string;
    subtitle?: string;
    description?: string;
    color?: string;
    imageUrl: string;
    imageSource?: "upload" | "ai";
    generatedPrompt?: string;
    category: string;
    subcategory?: string;
    discountType: "Percentage" | "Flat";
    discountValue: number;
    startDate: Date;
    endDate: Date;
    theme: "light" | "dark";
    priority: number;
    isActive: boolean;
}

const BannerSchema = new Schema<IBanner>(
    {
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Please provide a banner title"],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Please provide a banner image URL"],
        },
        imageSource: {
            type: String,
            enum: ["upload", "ai"],
            default: "upload",
        },
        generatedPrompt: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please provide a banner category"],
        },
        subcategory: {
            type: String,
        },
        discountType: {
            type: String,
            enum: ["Percentage", "Flat"],
            default: "Percentage",
        },
        discountValue: {
            type: Number,
            required: true,
            default: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "light",
        },
        priority: {
            type: Number,
            required: true,
            default: 0,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Banner = mongoose.model<IBanner>("Banner", BannerSchema);
