import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Result } from "../types/result";
import type { NewResultPayload } from "../context/ResultContext";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
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

export const getAllResults = async (): Promise<Result[]> => {
  const res = await apiClient.get(API_ENDPOINTS.RESULTS);
  return res.data;
};

export const createResult = async (data: NewResultPayload): Promise<Result> => {
  const res = await apiClient.post(API_ENDPOINTS.CREATE_RESULT, data);
  return res.data;
};

export const editResult = async (id: string, data: Result): Promise<Result> => {
  const res = await apiClient.put(API_ENDPOINTS.EDIT_RESULT(id), data);
  return res.data;
};

export const getResultById = async (id: string): Promise<Result> => {
  const res = await apiClient.get(API_ENDPOINTS.RESULT_BY_ID(id));
  return res.data;
};

export const getResultsByUserId = async (userId: string): Promise<Result[]> => {
  const res = await apiClient.get(API_ENDPOINTS.RESULTS_BY_USER_ID(userId));
  return res.data;
};

export const getResultsByDoctorName = async (doctorName: string): Promise<Result[]> => {
  const res = await apiClient.get(API_ENDPOINTS.RESULTS_BY_DOCTOR_NAME(doctorName));
  return res.data;
};