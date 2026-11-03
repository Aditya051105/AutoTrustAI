import axios from 'axios';

// Dynamically determine the backend API base URL
// Works seamlessly in local dev, Render Blueprint, or manual Render Web Service.
const getBaseURL = () => {
    let envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        envUrl = envUrl.trim().replace(/\/+$/, '');
        if (!envUrl.endsWith('/api')) {
            envUrl = `${envUrl}/api`;
        }
        return `${envUrl}/`;
    }
    return 'http://localhost:8000/api/';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
