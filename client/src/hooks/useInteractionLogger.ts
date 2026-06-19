import { useAuth } from '../context/authContext';
import { logUserInteraction, type InteractionData } from '../services/interaction.api';

export const useInteractionLogger = () => {
    const { user } = useAuth();

    const log = (data: Omit<InteractionData, 'userId'>) => {
        if (!user?._id) return;

        logUserInteraction(data);
    };

    return { log };
};
