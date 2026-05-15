import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get("/user/notifications");
            return data.notifications;
        }
    });
};

export const useMarkNotificationsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data } = await api.put("/user/notifications/read");
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
};
