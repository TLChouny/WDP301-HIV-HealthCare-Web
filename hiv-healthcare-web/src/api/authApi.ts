import axios from "axios";
import type { User } from "../types/user";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";

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

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGIN, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng nhập");
  }
};

export const logout = async (token: string) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGOUT, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng xuất thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng xuất");
  }
};

export const register = async (data: {
  userName?: string;
  email: string;
  password: string;
  phone_number?: string;
  role?: string;
}) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.SIGNUP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng ký");
  }
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xác minh OTP thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xác minh OTP");
  }
};

export const resendOTP = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESEND_OTP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Gửi lại OTP thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi gửi lại OTP");
  }
};

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.GET_ALL_USERS);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Lấy danh sách người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi lấy danh sách người dùng");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi yêu cầu đặt lại mật khẩu");
  }
};

export const verifyResetOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFY_RESET_OTP, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xác minh OTP đặt lại mật khẩu thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xác minh OTP đặt lại mật khẩu");
  }
};

export const resetPassword = async (data: { resetToken: string; newPassword: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đặt lại mật khẩu thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đặt lại mật khẩu");
  }
};

export const getUserById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.get(`${API_ENDPOINTS.USER_BY_ID(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Lấy thông tin người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi lấy thông tin người dùng");
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.put(`${API_ENDPOINTS.UPDATE_USER(id)}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Cập nhật người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi cập nhật người dùng");
  }
};

export const uploadAvatar = async (
  userId: string,
  data: FormData | { avatarUrl: string }
) => {
  const isFileUpload = data instanceof FormData;

  return apiClient.put(
    API_ENDPOINTS.UPLOAD_AVATAR(userId), // chuẩn hóa endpoint
    data,
    {
      headers: {
        "Content-Type": isFileUpload
          ? "multipart/form-data"
          : "application/json",
      },
    }
  );
};

export const deleteUser = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.delete(`${API_ENDPOINTS.DELETE_USER(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xóa người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xóa người dùng");
  }
};

export const createUser = async (data: Partial<User>) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.post(API_ENDPOINTS.SIGNUP, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Thêm người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi thêm người dùng");
  }
};

export const getWorkSchedule = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.get(`${API_ENDPOINTS.GET_WORK_SCHEDULE(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Lấy lịch làm việc thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi lấy lịch làm việc");
  }
};

export const updateWorkSchedule = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.put(`${API_ENDPOINTS.UPDATE_WORK_SCHEDULE(id)}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Cập nhật lịch làm việc thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi cập nhật lịch làm việc");
  }
};

export const clearWorkSchedule = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.delete(`${API_ENDPOINTS.CLEAR_WORK_SCHEDULE(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xóa lịch làm việc thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xóa lịch làm việc");
  }
};

// Thêm chứng chỉ mới
export const addCertification = async (userId: string, data: { title: string; issuer: string; issueDate: string; expiryDate?: string, description?: string, fileUrl?: string, status?: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.ADD_CERTIFICATION(userId), data);
    return res.data.certifications;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Thêm chứng chỉ thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi thêm chứng chỉ");
  }
};

export const updateCertification = async (userId: string, certId: string, data: { title: string; issuer: string; issueDate: string; expiryDate?: string, description?: string, fileUrl?: string, status?: string }) => {
  try {
    const res = await apiClient.put(API_ENDPOINTS.UPDATE_CERTIFICATION(userId, certId), data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Cập nhật kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi cập nhật kinh nghiệm");
  }
};

export const deleteCertification = async (userId: string, certId: string) => {
  try {
    const res = await apiClient.delete(API_ENDPOINTS.DELETE_CERTIFICATION(userId, certId));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xoá kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xoá kinh nghiệm");
  }
};


// Admin duyệt chứng chỉ
export const approveCertification = async (userId: string, certId: string) => {
  try {
    const res = await apiClient.put(API_ENDPOINTS.APPROVE_CERTIFICATION(userId, certId));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Duyệt chứng chỉ thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi duyệt chứng chỉ");
  }
};

// Admin từ chối chứng chỉ
export const rejectCertification = async (userId: string, certId: string) => {
  try {
    const res = await apiClient.delete(API_ENDPOINTS.REJECT_CERTIFICATION(userId, certId));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Từ chối chứng chỉ thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi từ chối chứng chỉ");
  }
};

// Thêm kinh nghiệm mới
export const addExperience = async (userId: string, data: { hospital: string; position: string; startDate: string; endDate?: string; description?: string, status?: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.ADD_EXPERIENCE(userId), data);
    return res.data.experiences;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Thêm kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi thêm kinh nghiệm");
  }
};

// Cập nhật kinh nghiệm
export const updateExperience = async (userId: string, expId: string, data: { hospital?: string; position?: string; startDate?: string; endDate?: string; description?: string }) => {
  try {
    const res = await apiClient.put(API_ENDPOINTS.UPDATE_EXPERIENCE(userId, expId), data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Cập nhật kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi cập nhật kinh nghiệm");
  }
};

// Xoá kinh nghiệm
export const deleteExperience = async (userId: string, expId: string) => {
  try {
    const res = await apiClient.delete(API_ENDPOINTS.DELETE_EXPERIENCE(userId, expId));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xoá kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xoá kinh nghiệm");
  }
};

export const approveExperience = async (userId: string, expId: string) => {
   try {
    const res = await apiClient.put(API_ENDPOINTS.APPROVE_EXPERIENCE(userId, expId));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Duyệt kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi duyệt kinh nghiệm");
  }
}

export const rejectExperience = async (userId: string, expId: string) => {
  try {
    const res = await apiClient.delete(API_ENDPOINTS.REJECT_EXPERIENCE(userId, expId));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Từ chối kinh nghiệm thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi từ chối kinh nghiệm");
  }
};