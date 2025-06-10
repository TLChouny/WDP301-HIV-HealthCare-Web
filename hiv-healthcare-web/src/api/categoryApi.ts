import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Category } from "../types/category";

// Cấu hình Axios mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout 10 giây
  withCredentials: true, // Hỗ trợ gửi cookie/credentials cho CORS
  headers: {
    "Content-Type": "application/json",
  },
});

// Category APIs
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
    throw new Error("An unexpected error occurred while fetching categories");
  }
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.CATEGORIES, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create category");
    }
    throw new Error("An unexpected error occurred while creating category");
  }
};