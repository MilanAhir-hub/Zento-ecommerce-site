import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auto-append /api if it's missing (helps prevent Vercel URL misconfigurations)
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
    baseURL = baseURL.endsWith('/') ? `${baseURL}api` : `${baseURL}/api`;
}

// Create a reusable Axios instance
const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                console.error("Unauthorized access - Perhaps token expired?");
            } else if (status === 500) {
                console.error("Server error:", data?.message || "Unknown error occurred on the server.");
            }
        } else if (error.request) {
            console.error("Network Error: No response received from server.");
        } else {
            console.error("Error setting up request:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;