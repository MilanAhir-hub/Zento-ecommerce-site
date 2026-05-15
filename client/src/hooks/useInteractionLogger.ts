import { useAuth } from '../context/authContext';
import { logUserInteraction,type InteractionData } from '../services/interaction.api';

export const useInteractionLogger = () => {
    const { user } = useAuth();

    const log = (data: Omit<InteractionData, 'userId'>) => {
        if (!user?._id) return; // Only log if user is logged in

        logUserInteraction({
            userId: user._id,
            ...data
        });
    };

    return { log };
};
