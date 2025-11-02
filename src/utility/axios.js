import { axiosInstance } from "../utility/axios";

export const registerUser = async (payload) => {
  // Optional: keep logging in dev only
  if (import.meta.env.MODE !== "production") {
    console.log("Sending register payload:", JSON.stringify(payload, null, 2));
  }

  try {
    const response = await axiosInstance.post("/user/register", payload);
    if (import.meta.env.MODE !== "production") {
      console.log("Register successful:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};
