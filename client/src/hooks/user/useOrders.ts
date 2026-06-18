import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/order.api';
import toast from 'react-hot-toast';

export const useOrders = (page = 1, limit = 10) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['my_orders', page, limit],
        queryFn: () => orderService.getMyOrders(page, limit),
        retry: 1,
    });

    const cancelOrderMutation = useMutation({
        mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
        onSuccess: (response) => {
            toast.success(response.message || 'Order cancelled successfully');
            queryClient.invalidateQueries({ queryKey: ['my_orders'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        }
    });

    return {
        data,
        orders: data?.orders || [],
        totalOrders: data?.totalOrders || 0,
        totalPages: data?.totalPages || 1,
        currentPage: data?.currentPage || 1,
        isLoading,
        isError,
        error,
        refetch,
        cancelOrder: cancelOrderMutation.mutateAsync,
        isCancelling: cancelOrderMutation.isPending
    };
};
