// src/utility/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5173/api/v1", // backend URL
});


