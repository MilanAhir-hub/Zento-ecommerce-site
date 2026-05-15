import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, type Cart, type CartItem } from '../../services/cart.api';
import toast from 'react-hot-toast';

export const useCart = () => {
    const queryClient = useQueryClient();

    // Fetch Cart
    const { data: cart, isLoading: isCartLoading, error: cartError } = useQuery({
        queryKey: ['cart'],
        queryFn: cartService.getCart,
        retry: 1, // Only retry once as this could be a 401 Unauthorized if not logged in
    });

    // Add To Cart Mutation
    const addToCartMutation = useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
            cartService.addToCart(productId, quantity),
        onSuccess: (data: Cart) => {
            queryClient.setQueryData(['cart'], data);
            toast.success('Product added to cart');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    });

    // Update Cart Item Mutation
    const updateCartItemMutation = useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
            cartService.updateCartItem(productId, quantity),
        onMutate: async ({ productId, quantity }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['cart'] });

            // Snapshot the previous value
            const previousCart = queryClient.getQueryData<Cart>(['cart']);

            // Optimistically update to the new value
            queryClient.setQueryData(['cart'], (old: Cart | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.map((item: CartItem) =>
                        item.product._id === productId ? { ...item, quantity } : item
                    )
                };
            });

            // Return a context object with the snapshotted value
            return { previousCart };
        },
        onError: (error: any, _variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart);
            }
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        },
        onSettled: () => {
            // Always refetch after error or success to ensure we're in sync with the server
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    // Remove From Cart Mutation
    const removeFromCartMutation = useMutation({
        mutationFn: (productId: string) => cartService.removeFromCart(productId),
        onSuccess: (data) => {
            queryClient.setQueryData(['cart'], data);
            toast.success('Product removed from cart');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove product');
        }
    });

    // Clear Cart Mutation
    const clearCartMutation = useMutation({
        mutationFn: () => cartService.clearCart(),
        onSuccess: (data) => {
            queryClient.setQueryData(['cart'], data);
        },
        onError: (error: any) => {
            console.error("Failed to clear cart:", error);
        }
    });

    return {
        cart,
        isCartLoading,
        cartError,

        addToCart: addToCartMutation.mutateAsync,
        isAddingToCart: addToCartMutation.isPending,

        updateCartItem: updateCartItemMutation.mutateAsync,
        isUpdatingCart: updateCartItemMutation.isPending,

        removeFromCart: removeFromCartMutation.mutateAsync,
        isRemovingFromCart: removeFromCartMutation.isPending,

        clearCart: clearCartMutation.mutateAsync,
        isClearingCart: clearCartMutation.isPending,
    };
};
