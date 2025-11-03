// src/services/registerUser.js
import { axiosInstance } from "../utility/axios";

// Vite-safe dev flag
const isDev = import.meta.env?.MODE !== "production";

export const registerUser = async (payload) => {
  if (isDev) console.log("Sending register payload:", payload);

  try {
    const response = await axiosInstance.post("/user/register", payload);
    if (isDev) console.log("Register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};
