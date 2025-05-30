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
