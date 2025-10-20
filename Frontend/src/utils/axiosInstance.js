import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: 'https://localhost:7172/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Only auto-logout for 401 errors on non-login endpoints
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            // Token expired or invalid, logout user
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
