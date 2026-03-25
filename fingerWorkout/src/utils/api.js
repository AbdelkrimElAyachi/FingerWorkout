import axios from "axios";
import { useAuthStore } from "../stores/authStore";

/** Base URL for the back-end API (single source of truth). */
export const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:9999";

const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10000
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const auth = useAuthStore();
        if (error.response && error.response.status == 401 && auth.token) {
            auth.clear();

            window.location = "/login";
        }
        return Promise.reject(error);
    }
)


export default api;
