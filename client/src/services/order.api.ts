import api from "./api";

export interface OrderItem {
    product: {
        _id: string;
        title: string;
        price: number;
        imageUrl: string;
        category?: string;
        description?: string;
    };
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: string;
    vendorId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface OrdersResponse {
    success: boolean;
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    orders: Order[];
}

export const orderService = {
    getMyOrders: async (page = 1, limit = 10): Promise<OrdersResponse> => {
        const response = await api.get<OrdersResponse>(`/user/orders?page=${page}&limit=${limit}`);
        return response.data;
    },

    cancelOrder: async (orderId: string): Promise<{ success: boolean; message: string; order: Order }> => {
        const response = await api.put<{ success: boolean; message: string; order: Order }>(`/user/order/${orderId}/cancel`);
        return response.data;
    }
};
