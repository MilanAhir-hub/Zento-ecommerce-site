import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlist.api';
import toast from 'react-hot-toast';

export const useWishlist = () => {
    const queryClient = useQueryClient();

    // Fetch Wishlist
    const { data: wishlist, isLoading: isWishlistLoading, error: wishlistError } = useQuery({
        queryKey: ['wishlist'],
        queryFn: wishlistService.getWishlist,
        retry: 1,
    });

    // Add To Wishlist Mutation
    const addToWishlistMutation = useMutation({
        mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
        onSuccess: (data) => {
            queryClient.setQueryData(['wishlist'], data);
            toast.success('Product added to wishlist');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    });

    // Remove From Wishlist Mutation
    const removeFromWishlistMutation = useMutation({
        mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
        onSuccess: (data) => {
            queryClient.setQueryData(['wishlist'], data);
            toast.success('Product removed from wishlist');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    });

    // Clear Wishlist Mutation
    const clearWishlistMutation = useMutation({
        mutationFn: () => wishlistService.clearWishlist(),
        onSuccess: (data) => {
            queryClient.setQueryData(['wishlist'], data);
        },
        onError: (error: any) => {
            console.error("Failed to clear wishlist:", error);
        }
    });

    const isInWishlist = (productId: string) => {
        return wishlist?.items.some(item => (item as any)._id === productId || item._id === productId) || false;
    };

    const toggleWishlist = async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlistMutation.mutateAsync(productId);
        } else {
            await addToWishlistMutation.mutateAsync(productId);
        }
    };

    return {
        wishlist,
        isWishlistLoading,
        wishlistError,
        addToWishlist: addToWishlistMutation.mutateAsync,
        isAddingToWishlist: addToWishlistMutation.isPending,
        removeFromWishlist: removeFromWishlistMutation.mutateAsync,
        isRemovingFromWishlist: removeFromWishlistMutation.isPending,
        clearWishlist: clearWishlistMutation.mutateAsync,
        isClearingWishlist: clearWishlistMutation.isPending,
        isInWishlist,
        toggleWishlist
    };
};
