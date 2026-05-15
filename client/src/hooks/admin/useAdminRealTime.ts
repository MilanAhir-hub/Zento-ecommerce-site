import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAdminRealTime = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Initialize socket connection
        const socket: Socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('✅ Connected to Admin Real-Time socket:', socket.id);
        });

        // Event listeners connected to React Query cache invalidation
        socket.on('admin_vendor_request_update', () => {
            console.log('🔔 Real-Time Event: Vendor Request Update');
            // This instantly tells React Query to refetch vendor requests quietly in background!
            queryClient.invalidateQueries({ queryKey: ['adminVendorRequests'] });
        });

        socket.on('admin_order_update', () => {
            console.log('🔔 Real-Time Event: Order Update');
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
        });

        socket.on('admin_stats_update', () => {
            console.log('🔔 Real-Time Event: Admin Stats Update');
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        });

        // Cleanup connection on component unmount
        return () => {
            console.log('⛔ Disconnecting from Admin Real-Time socket');
            socket.disconnect();
        };
    }, [queryClient]);
};
