// src/utility/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // backend URL
});

