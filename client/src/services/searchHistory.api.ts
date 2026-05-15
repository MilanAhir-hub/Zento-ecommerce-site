import api from './api';

export const getSearchHistory = async () => {
    try {
        const response = await api.get('/user/search-history');
        return response.data?.history || [];
    } catch (error) {
        console.error("Failed to fetch search history", error);
        return [];
    }
};

export const addSearchHistory = async (keyword: string) => {
    try {
        const response = await api.post('/user/search-history', { keyword });
        return response.data?.history || [];
    } catch (error) {
        console.error("Failed to add search history", error);
        return [];
    }
};

export const syncSearchHistory = async (history: string[]) => {
    try {
        const response = await api.post('/user/search-history/sync', { history });
        return response.data?.history || [];
    } catch (error) {
        console.error("Failed to sync search history", error);
        return [];
    }
};

export const removeSearchHistory = async (keyword: string) => {
    try {
        const response = await api.delete(`/user/search-history/${encodeURIComponent(keyword)}`);
        return response.data?.history || [];
    } catch (error) {
        console.error("Failed to remove search history item", error);
        return [];
    }
};
