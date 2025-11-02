import { axiosInstance } from "../utility/axios";

export const registerUser = async (payload) => {
  console.log("Sending register payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axiosInstance.post("/api/v1/user/register", payload);
    console.log("Register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
