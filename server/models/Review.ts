import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
}

const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must not exceed 5"]
        },
        comment: {
            type: String,
            required: [true, "Please provide a review comment"],
            trim: true
        }
    },
    { timestamps: true }
);

// Prevent a user from submitting more than one review per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
