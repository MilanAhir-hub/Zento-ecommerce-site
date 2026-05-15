import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false // optional for search_query actions
    },
    action: {
        type: String,
        enum: ['view', 'click', 'add_to_cart', 'remove_from_cart', 'checkout', 'purchase', 'search_query'],
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: false // optional for search_query actions
    },
    metadata: {
        searchQuery: { type: String, default: null }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Compound indexes for fast recommendation queries
interactionSchema.index({ userId: 1, action: 1 });
interactionSchema.index({ productId: 1, action: 1 });
interactionSchema.index({ userId: 1, productId: 1 });
interactionSchema.index({ timestamp: -1 });

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;