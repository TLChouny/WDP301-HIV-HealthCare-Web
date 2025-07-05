import axios from "axios";
import type { ARVRegimen } from "../types/arvRegimen";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";

// Cấu hình Axios mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gắn token nếu có
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

// Lấy tất cả AR/VR Regimens
export const getAllARVRRegimens = async (): Promise<ARVRegimen[]> => {
  const res = await apiClient.get(API_ENDPOINTS.ARVR_REGIMENS);
  return res.data;
};

// Lấy AR/VR Regimen theo ID
export const getARVRRegimenById = async (id: string): Promise<ARVRegimen> => {
  const res = await apiClient.get(API_ENDPOINTS.ARVR_REGIMEN_BY_ID(id));
  return res.data;
};

// Tạo mới AR/VR Regimen
export const createARVRRegimen = async (data: Partial<ARVRegimen>): Promise<ARVRegimen> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không tìm thấy token xác thực");
  const res = await apiClient.post(API_ENDPOINTS.CREATE_ARVR_REGIMEN, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Cập nhật AR/VR Regimen
export const updateARVRRegimen = async (
  id: string,
  data: Partial<ARVRegimen>
): Promise<ARVRegimen> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không tìm thấy token xác thực");
  const res = await apiClient.put(API_ENDPOINTS.UPDATE_ARVR_REGIMEN(id), data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Xóa AR/VR Regimen
export const deleteARVRRegimen = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không tìm thấy token xác thực");
  await apiClient.delete(API_ENDPOINTS.DELETE_ARVR_REGIMEN(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
};
