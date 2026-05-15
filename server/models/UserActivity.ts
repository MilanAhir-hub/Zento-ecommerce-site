// models/UserActivity.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IUserActivity } from '../types';

export interface IUserActivityDoc extends IUserActivity, Document { }

const activitySchema = new Schema<IUserActivityDoc>({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    action: {
        type: String, 
        enum: [
            'view',
            'click',
            'add_to_cart',
            'remove_from_cart',
            'wishlist_add',
            'wishlist_remove',
            'purchase'
        ],
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUserActivityDoc>('UserActivity', activitySchema);