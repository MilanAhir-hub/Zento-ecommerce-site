import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/authContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useUserRealTime = () => {
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Only connect if the user is logged in
        if (!isAuthenticated || !user) return;

        // Initialize socket connection
        const socket: Socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log(`✅ Connected to User Real-Time socket for ${user._id}`);
        });

        // 🚀 TARGETED EVENT LISTENER! 
        // This listens explicitly to the unique room for this particular user
        socket.on(`user_notification_${user._id}`, () => {
            console.log('🔔 User Notification Update Received');

            // Instantly invalidate the notifications query to cause a silent foreground refetch
            // This guarantees the notification bell updates without a gross hard-reload
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });

        // Cleanup connection on component unmount or user change
        return () => {
            console.log('⛔ Disconnecting from User Real-Time socket');
            socket.disconnect();
        };
    }, [queryClient, user, isAuthenticated]);
};
