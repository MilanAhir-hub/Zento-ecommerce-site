import api from './api';

export interface InteractionData {
    productId?: string;
    action: 'view' | 'click' | 'add_to_cart' | 'remove_from_cart' | 'checkout' | 'purchase' | 'search_query' | 'wishlist_add' | 'wishlist_remove';
    quantity?: number;
    searchQuery?: string;
    metadata?: Record<string, unknown>;
}

export const logUserInteraction = async (data: InteractionData) => {
    try {
        const response = await api.post('/interactions/log', data);
        return response.data;
    } catch (error) {
        console.error("Failed to log interaction", error);
    }
};
