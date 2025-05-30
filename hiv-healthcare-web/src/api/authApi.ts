import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";

export const login = async (data: { username: string; password: string }) => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.LOGIN}`);
  return res.data;
};

export const register = async (data: { username: string; password: string; role?: string }) => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.SIGNUP}`);
  return res.data;
};
