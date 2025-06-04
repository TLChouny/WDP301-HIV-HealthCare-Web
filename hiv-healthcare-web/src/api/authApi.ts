import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";

// Cấu hình Axios mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout 10 giây
  withCredentials: true, // Hỗ trợ gửi cookie/credentials cho CORS
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGIN, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred during login");
  }
};

export const register = async (data: {
  userName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.SIGNUP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("An unexpected error occurred during registration");
  }
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFYOTP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "OTP verification failed");
    }
    throw new Error("An unexpected error occurred during OTP verification");
  }
};

export const resendOTP = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESENDOTP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Resend OTP failed");
    }
    throw new Error("An unexpected error occurred during OTP resend");
  }
};