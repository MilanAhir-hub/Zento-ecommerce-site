import api from "./api";

// Define the type for the cart item according to the backend response
export interface CartItem {
    _id: string; // The specific ID of this cart item document
    product: {
        _id: string;
        title: string;
        price: number;
        imageUrl: string;
        images?: (string | { url: string })[];
        category?: string;
        stock: number;
    };
    quantity: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export const cartService = {
    getCart: async (): Promise<Cart> => {
        const response = await api.get<{ success: boolean; cart: Cart }>("/user/cart");
        return response.data.cart;
    },

    addToCart: async (productId: string, quantity: number = 1): Promise<Cart> => {
        const response = await api.post<{ success: boolean; cart: Cart }>("/user/cart", { productId, quantity });
        return response.data.cart;
    },

    updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
        const response = await api.put<{ success: boolean; cart: Cart }>(`/user/cart/${productId}`, { quantity });
        return response.data.cart;
    },

    removeFromCart: async (productId: string): Promise<Cart> => {
        const response = await api.delete<{ success: boolean; cart: Cart }>(`/user/cart/${productId}`);
        return response.data.cart;
    },

    clearCart: async (): Promise<Cart> => {
        const response = await api.delete<{ success: boolean; cart: Cart }>('/user/cart/clear');
        return response.data.cart;
    }
};
