import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";

export const login = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.LOGIN}`, data);
  return res.data;
};

export const register = async (data: { userName?: string; email: string; password: string; phone_number?:string; role?: string }) => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.SIGNUP}`, data);
  return res.data;
};

export const verifyOTP = async (data: {  email: string; otp: string }) => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.VERIFYOTP}`, data);
  return res.data;
};