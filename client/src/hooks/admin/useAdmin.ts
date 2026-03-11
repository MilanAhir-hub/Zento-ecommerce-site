import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

// --- STATS ---
export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin_stats"],
        queryFn: async () => {
            const { data } = await api.get("/admin/dashboard-stats");
            return data.data;
        }
    });
};

// --- ORDERS ---
export const useAdminOrders = () => {
    return useQuery({
        queryKey: ["admin_orders"],
        queryFn: async () => {
            const { data } = await api.get("/admin/orders");
            return data.data;
        }
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const { data } = await api.put(`/admin/orders/${id}`, { status });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
        }
    });
};

// --- PRODUCTS ---
export const useAdminProducts = () => {
    return useQuery({
        queryKey: ["admin_products"],
        queryFn: async () => {
            const { data } = await api.get("/admin/products");
            return data.data;
        }
    });
};

export const useDeleteProductAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/products/${id}`);
            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_products"] });
            queryClient.invalidateQueries({ queryKey: ["admin_stats"] });

            // Invalidate ALL product queries (including inactive ones on other routes)
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "products",
                refetchType: "all"
            });
        }
    });
};
// --- CUSTOMERS ---
export const useAdminCustomers = () => {
    return useQuery({
        queryKey: ["admin_customers"],
        queryFn: async () => {
            const { data } = await api.get("/admin/customers");
            return data.data;
        }
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, role }: { id: string, role: string }) => {
            const { data } = await api.put(`/admin/users/${id}/role`, { role });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_customers"] });
            queryClient.invalidateQueries({ queryKey: ["admin_vendors"] });
        }
    });
};

// --- VENDORS ---
export const useAdminVendors = () => {
    return useQuery({
        queryKey: ["admin_vendors"],
        queryFn: async () => {
            const { data } = await api.get("/admin/vendors");
            return data.data;
        }
    });
};

// --- VENDOR REQUESTS ---
export const useAdminVendorRequests = () => {
    return useQuery({
        queryKey: ["admin_vendor_requests"],
        queryFn: async () => {
            const { data } = await api.get("/admin/vendor-requests");
            return data.data;
        }
    });
};

export const useHandleVendorRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, action }: { id: string, action: 'approve' | 'reject' }) => {
            const { data } = await api.put(`/admin/vendor-requests/${id}`, { action });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_vendor_requests"] });
            queryClient.invalidateQueries({ queryKey: ["admin_vendors"] });
        }
    });
};
