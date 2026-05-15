import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getVendorDashboardStats,
    getTopSellingProducts,
    getVendorProducts,
    getVendorProductById,
    deleteVendorProduct,
    createVendorProduct,
    updateVendorProduct,
    getVendorOrders,
    updateVendorOrderStatus,
    getStoreInfo,
    updateStoreInfo,
    getVendorBanners,
    createVendorBanner
} from '../../services/vendor.api';
import type {
    StoreInfo,
    VendorBanner
} from '../../services/vendor.api';

export const useVendorStats = () => {
    return useQuery({
        queryKey: ['vendorStats'],
        queryFn: getVendorDashboardStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useVendorProducts = () => {
    return useQuery({
        queryKey: ['vendorProducts'],
        queryFn: getVendorProducts,
        staleTime: 5 * 60 * 1000,
    });
};

export const useVendorProduct = (productId: string) => {
    return useQuery({
        queryKey: ['vendorProduct', productId],
        queryFn: () => getVendorProductById(productId),
        enabled: !!productId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateVendorProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => createVendorProduct(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
            queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
        },
    });
};

export const useUpdateVendorProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: FormData }) => updateVendorProduct(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
            queryClient.invalidateQueries({ queryKey: ['vendorProduct', variables.id] });
        },
    });
};

export const useDeleteVendorProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVendorProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
            queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
        },
    });
};

export const useVendorOrders = () => {
    return useQuery({
        queryKey: ['vendorOrders'],
        queryFn: getVendorOrders,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateVendorOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => updateVendorOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
            queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
        },
    });
};

export const useVendorStore = () => {
    return useQuery({
        queryKey: ['vendorStore'],
        queryFn: getStoreInfo,
        staleTime: 30 * 60 * 1000, // Long cache for store info
    });
};

export const useUpdateVendorStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<StoreInfo>) => updateStoreInfo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorStore'] });
        },
    });
};

export const useVendorTopProducts = () => {
    return useQuery({
        queryKey: ['vendorTopProducts'],
        queryFn: getTopSellingProducts,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useVendorBanners = () => {
    return useQuery<VendorBanner[]>({
        queryKey: ['vendorBanners'],
        queryFn: getVendorBanners,
        staleTime: 10 * 60 * 1000,
    });
};

export const useCreateVendorBanner = () => {
    const queryClient = useQueryClient();
    return useMutation<VendorBanner, Error, FormData>({
        mutationFn: (formData: FormData) => createVendorBanner(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorBanners'] });
        },
    });
};
