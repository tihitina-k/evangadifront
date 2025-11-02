// src/hooks/useRegister.js (or wherever you call the API)
import { axiosInstance } from "../utility/axios";

const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/v1/user/register", payload);
    console.log("Register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export default registerUser;
