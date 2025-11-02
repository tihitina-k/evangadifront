// src/utility/axios.js
import axios from "axios";
// console.log("🌍 Axios Base URL:", import.meta.env.VITE_API_URL);
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // dynamically switches between dev/prod
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Evangadi_Forum");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
