import mongoose, { Document, Schema } from "mongoose";

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true // A user should only have exactly ONE wishlist
        },
        items: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
