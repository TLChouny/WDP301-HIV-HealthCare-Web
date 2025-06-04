import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Service } from "../types/service";

export const getAllServices = async (): Promise<Service[]> => {
  const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.SERVICES}`);
  return res.data;
};

export const createService = async (data: Partial<Service>): Promise<Service> => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.SERVICES}`, data);
  return res.data;
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.SERVICES}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return null;
  }
};

export const getServicesByCategoryId = async (categoryId: string): Promise<Service[]> => {
  try {
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.SERVICES_BY_CATEGORY(categoryId)}`);
    return res.data.services; // hoặc res.data nếu backend trả về mảng trực tiếp
  } catch (error) {
    console.error("Error fetching services by category ID:", error);
    return [];
  }
};
