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
} from "../api/authApi";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  user?: User;
  id?: string;
  _id?: string;
  userName?: string;
  email?: string;
  role?: Role;
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
        userName: decoded.userName || "Unknown User", // ✅ đã sửa
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