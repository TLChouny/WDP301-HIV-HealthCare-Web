import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { User, Role } from "../types/user";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  verifyOTP as apiVerifyOTP,
  resendOTP as apiResendOTP,
  getAllUsers as apiGetAllUsers,
  forgotPassword as apiForgotPassword,
  verifyResetOTP as apiVerifyResetOTP,
  resetPassword as apiResetPassword,
  getUserById as apiGetUserById,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  getWorkSchedule as apiGetWorkSchedule,
  updateWorkSchedule as apiUpdateWorkSchedule,
  clearWorkSchedule as apiClearWorkSchedule,

  addCertification as apiAddCertification,
  updateCertification as apiUpdateCertification,
  deleteCertification as apiDeleteCertification,
  approveCertification as apiApproveCertification,
  rejectCertification as apiRejectCertification,
  
  addExperience as apiAddExperience,
  updateExperience as apiUpdateExperience,
  deleteExperience as apiDeleteExperience,
  approveExperience as apiApproveExperience,
  rejectExperience as apiRejectExperience,
} from "../api/authApi";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  user?: User;
  id?: string;
  _id?: string;
  userName?: string;
  email?: string;
  role?: Role;
  userDescription?: string;
  avatar?: string;
  phone_number?: string;
  dateOfBirth?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isStaff: boolean;
  register: (data: {
    userName?: string;
    email: string;
    password: string;
    phone_number?: string;
    role?: string;
  }) => Promise<void>;
  verifyOTP: (data: { email: string; otp: string }) => Promise<void>;
  resendOTP: (data: { email: string }) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  forgotPassword: (data: { email: string }) => Promise<void>;
  verifyResetOTP: (data: { email: string; otp: string }) => Promise<VerifyResetOTPResponse>;
  resetPassword: (data: { resetToken: string; newPassword: string }) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getWorkSchedule: (id: string) => Promise<any>;
  updateWorkSchedule: (id: string, data: any) => Promise<void>;
  clearWorkSchedule: (id: string) => Promise<void>;
  addCertification: (userId: string, data: { title: string; issuer: string; issueDate: string; expiryDate?: string, description?: string, fileUrl?: string, status?: string }) => Promise<void>;
  updateCertification: (userId: string, certId: string, data: {  title: string; issuer: string; issueDate: string; expiryDate?: string, description?: string, fileUrl?: string, status?: string  }) => Promise<void>;
  deleteCertification: (userId: string, certId: string) => Promise<void>;
  approveCertification: (userId: string, certId: string) => Promise<void>;
  rejectCertification: (userId: string, certId: string) => Promise<void>;
  addExperience: (userId: string, data: { hospital: string; position: string; startDate: string; endDate?: string; description?: string }) => Promise<void>;
  updateExperience: (userId: string, expId: string, data: { hospital?: string; position?: string; startDate?: string; endDate?: string; description?: string }) => Promise<void>;
  deleteExperience: (userId: string, expId: string) => Promise<void>;
  approveExperience: (userId: string, expId: string) => Promise<void>;
  rejectExperience: (userId: string, expId: string) => Promise<void>;

}

interface VerifyResetOTPResponse {
  resetToken: string;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const decodeAndValidateToken = (token: string): User => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Token không hợp lệ hoặc trống");
      }
      const decoded: JwtPayload = jwtDecode(token);
      console.log("Decoded token:", decoded); // Debug cấu trúc token
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token đã hết hạn");
      }
      const userData = decoded.user || {
        _id: decoded.id || decoded._id || "unknown",
        userName: decoded.userName || "Unknown User",
        email: decoded.email || "no-email@example.com",
        role: decoded.role || "user",
        isVerified: decoded.isVerified ?? false,
        createdAt: decoded.createdAt || new Date().toISOString(),
        updatedAt: decoded.updatedAt || new Date().toISOString(),
      };
      return userData as User;
    } catch (error: any) {
      console.error("Lỗi xác thực token:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token từ localStorage:", token);
        if (token) {
          const userData = decodeAndValidateToken(token);
          setUser(userData);
        }
      } catch (error: any) {
        console.error("Lỗi khởi tạo xác thực:", error.message);
        localStorage.removeItem("token");
        setUser(null);
        toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  if (loading) {
    return <div>Đang tải thông tin xác thực...</div>;
  }

  const login = async (data: { email: string; password: string }) => {
    try {
      const res: { token: string } = await apiLogin(data);
      const token = res.token;
      if (!token || typeof token !== "string") throw new Error("Token không hợp lệ");
      console.log("Token sau khi đăng nhập:", token);
      const userData = decodeAndValidateToken(token);
      localStorage.setItem("token", token);
      setUser(userData);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (userData.role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await apiLogout(token);
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
  };

  const register = async (data: { userName?: string; email: string; password: string; phone_number?: string; role?: string }) => {
    try {
      await apiRegister(data);
      toast.success("Đăng ký thành công! Vui lòng xác minh OTP.", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error.message);
      toast.error(error.message || "Đăng ký thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const verifyOTP = async (data: { email: string; otp: string }) => {
    try {
      const res = await apiVerifyOTP(data);
      if (res.token) {
        const token = res.token;
        console.log("Token sau khi xác minh OTP:", token);
        const userData = decodeAndValidateToken(token);
        localStorage.setItem("token", token);
        setUser(userData);
        toast.success("Xác minh OTP thành công!", { position: "top-right", autoClose: 3000 });
      } else {
        toast.success("Xác minh OTP thành công nhưng không có token!", { position: "top-right", autoClose: 3000 });
      }
    } catch (error: any) {
      console.error("Lỗi xác minh OTP:", error.message);
      toast.error(error.message || "Xác minh OTP thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const resendOTP = async (data: { email: string }) => {
    try {
      await apiResendOTP(data);
      toast.success("OTP đã được gửi lại!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi gửi lại OTP:", error.message);
      toast.error(error.message || "Gửi lại OTP thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await apiGetAllUsers();
      return res;
    } catch (error: any) {
      console.error("Lỗi lấy danh sách người dùng:", error.message);
      toast.error(error.message || "Không thể lấy danh sách người dùng.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const forgotPassword = async (data: { email: string }) => {
    try {
      await apiForgotPassword(data);
    } catch (error: any) {
      console.error("Lỗi yêu cầu đặt lại mật khẩu:", error.message);
      let errorMessage = "Yêu cầu đặt lại mật khẩu thất bại.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes("not found")) errorMessage = "Email không tồn tại!";
      }
      throw error;
    }
  };

  const verifyResetOTP = async (data: { email: string; otp: string }) => {
    try {
      const response = await apiVerifyResetOTP(data);
      return response;
    } catch (error: any) {
      console.error("Lỗi xác minh OTP đặt lại mật khẩu:", error.message);
      let errorMessage = "Xác minh OTP thất bại.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes("expired")) errorMessage = "Mã OTP đã hết hạn!";
        else if (errorMessage.includes("otp")) errorMessage = "Mã OTP không đúng!";
      }
      throw error;
    }
  };

  const resetPassword = async (data: { resetToken: string; newPassword: string }) => {
    try {
      const response = await apiResetPassword(data);
      if (response.token) {
        localStorage.setItem("token", response.token);
        const userData = decodeAndValidateToken(response.token);
        setUser(userData);
      }
    } catch (error: any) {
      let errorMessage = "Đặt lại mật khẩu thất bại!";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes("token")) {
          errorMessage = "Phiên đặt lại mật khẩu đã hết hạn! Vui lòng thử lại.";
        }
      }
      console.error("Lỗi đặt lại mật khẩu:", error.message);
      throw error;
    }
  };

  const getUserById = async (id: string) => {
    try {
      const res = await apiGetUserById(id);
      return res;
    } catch (error: any) {
      console.error("Lỗi lấy thông tin người dùng:", error.message);
      toast.error(error.message || "Không thể lấy thông tin người dùng.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const updateUser = async (id: string, data: any) => {
    try {
      const res = await apiUpdateUser(id, data);
      if (user && user._id === id) setUser(res);
      // toast.success("Cập nhật người dùng thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi cập nhật người dùng:", error.message);
      // toast.error(error.message || "Cập nhật người dùng thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiDeleteUser(id);
      if (user && user._id === id) {
        console.log("Xóa người dùng hiện tại, xóa token");
        setUser(null);
        localStorage.removeItem("token");
      }
      toast.success("Xóa người dùng thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi xóa người dùng:", error.message);
      toast.error(error.message || "Xóa người dùng thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const getWorkSchedule = async (id: string) => {
    try {
      const res = await apiGetWorkSchedule(id);
      return res;
    } catch (error: any) {
      console.error("Lỗi lấy lịch làm việc:", error.message);
      toast.error(error.message || "Không thể lấy lịch làm việc.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const updateWorkSchedule = async (id: string, data: any) => {
    try {
      const res = await apiUpdateWorkSchedule(id, data);
      if (user && user._id === id) setUser(res);
      toast.success("Cập nhật lịch làm việc thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi cập nhật lịch làm việc:", error.message);
      toast.error(error.message || "Cập nhật lịch làm việc thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const clearWorkSchedule = async (id: string) => {
    try {
      await apiClearWorkSchedule(id);
      if (user && user._id === id) {
        const updatedUser = { ...user, workSchedule: null };
        setUser(updatedUser);
      }
      toast.success("Xóa lịch làm việc thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi xóa lịch làm việc:", error.message);
      toast.error(error.message || "Xóa lịch làm việc thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const addCertification = async (userId: string, data: { title: string; issuer: string; issueDate: string; expiryDate?: string, description?: string, fileUrl?: string, status?: string }) => {
    try {
      await apiAddCertification(userId, data);
      // toast.success("Thêm chứng chỉ thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi thêm chứng chỉ:", error.message);
      // toast.error(error.message || "Thêm chứng chỉ thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

    const updateCertification = async (userId: string, certId: string, data: {  title: string; issuer: string; issueDate: string; expiryDate?: string, description?: string, fileUrl?: string, status?: string }) => {
    try {
      await apiUpdateCertification(userId, certId, data);
      // toast.success("Cập nhật chứng chỉ thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi cập nhật chứng chỉ:", error.message);
      // toast.error(error.message || "Cập nhật chứng chỉ thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

    const deleteCertification = async (userId: string, certId: string) => {
    try {
      await apiDeleteCertification(userId, certId);
      // toast.success("Xoá chứng chỉ thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi xoá chứng chỉ:", error.message);
      // toast.error(error.message || "Xoá chứng chỉ thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const approveCertification = async (userId: string, certId: string) => {
    try {
      await apiApproveCertification(userId, certId);
      // toast.success("Duyệt chứng chỉ thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi duyệt chứng chỉ:", error.message);
      // toast.error(error.message || "Duyệt chứng chỉ thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const rejectCertification = async (userId: string, certId: string) => {
    try {
      await apiRejectCertification(userId, certId);
      // toast.success("Từ chối chứng chỉ thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi từ chối chứng chỉ:", error.message);
      // toast.error(error.message || "Từ chối chứng chỉ thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const addExperience = async (userId: string, data: { hospital: string; position: string; startDate: string; endDate?: string; description?: string }) => {
    try {
      await apiAddExperience(userId, data);
      // toast.success("Thêm kinh nghiệm thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi thêm kinh nghiệm:", error.message);
      // toast.error(error.message || "Thêm kinh nghiệm thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const updateExperience = async (userId: string, expId: string, data: { hospital?: string; position?: string; startDate?: string; endDate?: string; description?: string }) => {
    try {
      await apiUpdateExperience(userId, expId, data);
      // toast.success("Cập nhật kinh nghiệm thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi cập nhật kinh nghiệm:", error.message);
      // toast.error(error.message || "Cập nhật kinh nghiệm thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const deleteExperience = async (userId: string, expId: string) => {
    try {
      await apiDeleteExperience(userId, expId);
      // toast.success("Xoá kinh nghiệm thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi xoá kinh nghiệm:", error.message);
      // toast.error(error.message || "Xoá kinh nghiệm thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const approveExperience = async (userId: string, expId: string) => {
    try {
      await apiApproveExperience(userId, expId);
      // toast.success("Duyệt kinh nghiệm thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi duyệt kinh nghiệm:", error.message);
      // toast.error(error.message || "Duyệt kinh nghiệm thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const rejectExperience = async (userId: string, expId: string) => {
    try {
      await apiRejectExperience(userId, expId);
      // toast.success("Từ chối kinh nghiệm thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Lỗi từ chối kinh nghiệmk:", error.message);
      // toast.error(error.message || "Từ chối kinh nghiệm thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isDoctor: user?.role === "doctor",
        isStaff: user?.role === "staff",
        register,
        verifyOTP,
        resendOTP,
        getAllUsers,
        forgotPassword,
        verifyResetOTP,
        resetPassword,
        getUserById,
        updateUser,
        deleteUser,
        getWorkSchedule,
        updateWorkSchedule,
        clearWorkSchedule,
        addCertification,
        updateCertification,
        deleteCertification,
        approveCertification,
        rejectCertification,
        addExperience,
        updateExperience,
        deleteExperience,
        approveExperience,
        rejectExperience,
      }}
      aria-live="polite"
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được sử dụng trong AuthProvider");
  return ctx;
};