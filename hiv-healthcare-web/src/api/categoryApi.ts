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

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực");
    const res = await apiClient.put(API_ENDPOINTS.CATEGORY_BY_ID(id), data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update category");
    }
    throw new Error("An unexpected error occurred while updating category");
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực");
    await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
    throw new Error("An unexpected error occurred while deleting category");
  }
};