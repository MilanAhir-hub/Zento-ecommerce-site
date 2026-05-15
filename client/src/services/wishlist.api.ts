import api from "./api";

export interface WishlistItem {
    _id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
}

export interface Wishlist {
    _id: string;
    user: string;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
}

export const wishlistService = {
    getWishlist: async (): Promise<Wishlist> => {
        const response = await api.get<{ success: boolean; wishlist: Wishlist }>("/user/wishlist");
        return response.data.wishlist;
    },

    addToWishlist: async (productId: string): Promise<Wishlist> => {
        const response = await api.post<{ success: boolean; wishlist: Wishlist }>("/user/wishlist", { productId });
        return response.data.wishlist;
    },

    removeFromWishlist: async (productId: string): Promise<Wishlist> => {
        const response = await api.delete<{ success: boolean; wishlist: Wishlist }>(`/user/wishlist/${productId}`);
        return response.data.wishlist;
    },

    clearWishlist: async (): Promise<Wishlist> => {
        const response = await api.delete<{ success: boolean; wishlist: Wishlist }>("/user/wishlist");
        return response.data.wishlist;
    }
};
