// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 60000, // Increase to 60 seconds for file uploads
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle global error here
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
