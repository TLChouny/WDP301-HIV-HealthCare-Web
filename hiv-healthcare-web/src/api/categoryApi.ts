import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Category } from "../types/category";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
  return res.data;
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.CATEGORIES}`, data);
  return res.data;
};
