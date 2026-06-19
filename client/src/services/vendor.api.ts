import api from './api';

export interface VendorDashboardStats {
    totalSales: number;
    activeProducts: number;
    newOrders: number;
    totalRevenue?: number;
    pendingOrders?: number;
}

export interface VendorProduct {
    _id: string;
    title: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    subcategory?: string;
    imageUrl?: string;
    images?: string[];
    status?: 'Active' | 'Out of Stock' | 'Draft';
}

export interface VendorOrder {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    items: Array<{
        product: {
            _id: string;
            title: string;
            imageUrl?: string;
            price: number;
        };
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
}

export interface StoreInfo {
    _id: string;
    storeName?: string;
    storeDescription?: string;
    logo?: string;
    address?: string;
    email: string;
}

// New Analytics Types
export interface TopProduct {
    _id: string;
    title: string;
    imageUrl?: string;
    price: number;
    totalRevenue: number;
    totalUnits: number;
    orderCount: number;
}

export interface DailyChartPoint {
    date: string;
    revenue?: number;
    orders: number;
}

export interface VendorAnalytics {
    // Core metrics
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    productsSold: number;
    
    // Status breakdown
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;

    // Charts (last 30 days)
    revenueChart: DailyChartPoint[];
    ordersChart: DailyChartPoint[];

    // Top products
    topProducts: TopProduct[];
}

export const getVendorDashboardStats = async (): Promise<VendorDashboardStats> => {
    const response = await api.get('/vendor/dashboard-stats');
    if (response.data.success && response.data.stats) {
        return {
            totalSales: response.data.stats.totalOrders,
            activeProducts: response.data.stats.totalProducts,
            newOrders: response.data.stats.pendingOrders,
            totalRevenue: response.data.stats.totalRevenue,
            pendingOrders: response.data.stats.pendingOrders
        };
    }
    return response.data;
};

export const getVendorProducts = async (): Promise<VendorProduct[]> => {
    const response = await api.get('/vendor/products');
    return response.data.products || [];
};

export const getVendorProductById = async (productId: string): Promise<VendorProduct> => {
    const response = await api.get(`/vendor/product/${productId}`);
    return response.data.product;
};

export const createVendorProduct = async (formData: FormData): Promise<VendorProduct> => {
    const response = await api.post('/vendor/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
};

export const updateVendorProduct = async (productId: string, formData: FormData): Promise<VendorProduct> => {
    const response = await api.put(`/vendor/product/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
};

export const deleteVendorProduct = async (productId: string): Promise<void> => {
    await api.delete(`/vendor/product/${productId}`);
};

export const getVendorOrders = async (): Promise<VendorOrder[]> => {
    const response = await api.get('/vendor/orders');
    return response.data.orders || [];
};

export const updateVendorOrderStatus = async (orderId: string, status: string): Promise<VendorOrder> => {
    const response = await api.put(`/vendor/order/${orderId}/status`, { status });
    return response.data.order;
};

export const getStoreInfo = async (): Promise<StoreInfo> => {
    const response = await api.get('/vendor/store');
    return response.data.store;
};

export const updateStoreInfo = async (storeData: Partial<StoreInfo>): Promise<StoreInfo> => {
    const response = await api.put('/vendor/store', storeData);
    return response.data.store;
};

export const getTopSellingProducts = async (): Promise<any[]> => {
    const response = await api.get('/vendor/top-selling-products');
    return response.data.topProducts || [];
};

export const getVendorAnalytics = async (): Promise<VendorAnalytics> => {
    const response = await api.get('/vendor/analytics');
    if (response.data.success && response.data.analytics) {
        return response.data.analytics;
    }
    return response.data;
};
