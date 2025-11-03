// src/utility/axios.js
import axios from "axios";

// Always safe to access import.meta.env at the top-level in Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// DEV flag
const isDev = import.meta.env.MODE !== "production";

// Optional: request interceptor for logging in dev
axiosInstance.interceptors.request.use((config) => {
  if (isDev) console.log("Axios Request:", config);
  return config;
});

// Optional: response interceptor for logging in dev
axiosInstance.interceptors.response.use(
  (response) => {
    if (isDev) console.log("Axios Response:", response);
    return response;
  },
  (error) => {
    if (isDev)
      console.error("Axios Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
