import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Service } from "../types/service";


// Cấu hình Axios mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout 10 giây
  withCredentials: true, // Hỗ trợ gửi cookie/credentials cho CORS
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllServices = async (): Promise<Service[]> => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.SERVICES);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch services");
    }
    throw new Error("An unexpected error occurred while fetching services");
  }
};

export const createService = async (data: Partial<Service>): Promise<Service> => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.SERVICES, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create service");
    }
    throw new Error("An unexpected error occurred while creating service");
  }
};

export const getServiceById = async (id: string): Promise<Service> => {
  try {
    const res = await apiClient.get(`${API_ENDPOINTS.SERVICES}/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch service by ID");
    }
    throw new Error("An unexpected error occurred while fetching service by ID");
  }
};

export const getServicesByCategoryId = async (categoryId: string): Promise<Service[]> => {
  try {
    const res = await apiClient.get(`${API_ENDPOINTS.SERVICES}/category/${categoryId}`);
    return res.data.services || res.data; // Hỗ trợ cả trường hợp trả về mảng hoặc object
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch services by category");
    }
    throw new Error("An unexpected error occurred while fetching services by category");
  }
};