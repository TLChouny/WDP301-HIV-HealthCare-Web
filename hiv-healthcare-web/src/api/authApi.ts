import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { User } from "../types/user";
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

export const logout = async (token: string) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGOUT, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
    throw new Error("An unexpected error occurred during logout");
  }
};


export const register = async (data: {
  userName?: string;
  email: string;
  password: string;
  phone_number?: string;
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

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.GET_ALL_USERS); // /users
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get users");
    }
    throw new Error("An unexpected error occurred while fetching users");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Forgot password failed");
    }
    throw new Error("An unexpected error occurred during forgot password");
  }
};

export const verifyResetOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFY_RESET_OTP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Reset OTP verification failed");
    }
    throw new Error("An unexpected error occurred during reset OTP verification");
  }
};

export const resetPassword = async (data: { resetToken: string; newPassword: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Reset password failed");
    }
    throw new Error("An unexpected error occurred during password reset");
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await apiClient.get(`${API_ENDPOINTS.USER_BY_ID(id)}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get user");
    }
    throw new Error("An unexpected error occurred while fetching user");
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const res = await apiClient.put(`${API_ENDPOINTS.UPDATE_USER(id)}`, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
    throw new Error("An unexpected error occurred while updating user");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await apiClient.delete(`${API_ENDPOINTS.DELETE_USER(id)}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
    throw new Error("An unexpected error occurred while deleting user");
  }
};
