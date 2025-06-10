import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { User, Gender, Role } from "../types/user";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  verifyOTP as apiVerifyOTP,
  resendOTP as apiResendOTP,
  getAllUsers as apiGetAllUsers,
  forgotPassword as apiForgotPassword,
  getUserById as apiGetUserById,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "../api/authApi";
import {useNavigate } from "react-router-dom";

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
  logout: () => void;
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
  getUserById: (id: string) => Promise<User>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const decodeAndValidateToken = (token: string): User => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Token is empty or not a string");
      }
      const decoded: JwtPayload = jwtDecode(token);
      console.log("Decoded token:", decoded);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token has expired");
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
      console.error("Token validation error:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Token from localStorage on initialize:", token); // Debug
      if (token) {
        try {
          const userData = decodeAndValidateToken(token);
          setUser(userData);
        } catch (error: any) {
          console.error("Error decoding token on initialize:", error.message);
          console.log("Removing token due to validation error");
          localStorage.removeItem("token");
          setUser(null);
          toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        console.log("No token found in localStorage on initialize");
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  // useEffect(() => {
  //   const handleStorageChange = (event: StorageEvent) => {
  //     if (event.key === "token") {
  //       console.log("Storage event triggered, new token value:", event.newValue); // Debug
  //       if (!event.newValue) {
  //         console.log("Token removed from storage, logging out");
  //         setUser(null);
  //         toast.info("Đã đăng xuất.", { position: "top-right", autoClose: 3000 });
  //       } else {
  //         try {
  //           const userData = decodeAndValidateToken(event.newValue);
  //           setUser(userData);
  //         } catch (error: any) {
  //           console.error("Error decoding token from storage event:", error.message);
  //           console.log("Removing token due to storage event validation error");
  //           localStorage.removeItem("token");
  //           setUser(null);
  //           toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", {
  //             position: "top-right",
  //             autoClose: 3000,
  //           });
  //         }
  //       }
  //     }
  //   };
  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      // Explicitly type the response to match the expected structure
      const res: { token: string } = await apiLogin(data);
      const token = res.token;
      if (!token || typeof token !== "string") throw new Error("Token is missing or invalid");
      console.log("Token after login:", token);
      const userData = decodeAndValidateToken(token);
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage after login:", localStorage.getItem("token"));
      setUser(userData);
      toast.success("Đăng nhập thành công!", { position: "top-right", autoClose: 3000 });
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (userData.role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error during login:", error.message);
      toast.error(error.message || "Đăng nhập thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiLogout(token as string);
    console.log("Logging out, removing token from localStorage");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Đã đăng xuất.", { position: "top-right", autoClose: 3000 });
  } catch (error : any) {
    console.error("Error during logout:", error.message);
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Đã đăng xuất.", { position: "top-right", autoClose: 3000 });
  }
};

  const register = async (data: { userName?: string; email: string; password: string; phone_number?: string; role?: string }) => {
    try {
      await apiRegister(data);
      toast.success("Đăng ký thành công! Vui lòng xác minh OTP.", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Error during registration:", error.message);
      toast.error(error.message || "Đăng ký thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const verifyOTP = async (data: { email: string; otp: string }) => {
    try {
      const res = await apiVerifyOTP(data);
      if (res.token) {
        const token = res.token;
        console.log("Token after verifyOTP:", token);
        const userData = decodeAndValidateToken(token);
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage after verifyOTP:", localStorage.getItem("token"));
        setUser(userData);
        toast.success("Xác minh OTP thành công!", { position: "top-right", autoClose: 3000 });
      } else {
        toast.success("Xác minh OTP thành công nhưng không có token!", { position: "top-right", autoClose: 3000 });
      }
    } catch (error: any) {
      console.error("Error during OTP verification:", error.message);
      toast.error(error.message || "Xác minh OTP thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const resendOTP = async (data: { email: string }) => {
    try {
      await apiResendOTP(data);
      toast.success("OTP đã được gửi lại!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Error during OTP resend:", error.message);
      toast.error(error.message || "Gửi lại OTP thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await apiGetAllUsers();
      return res;
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      toast.error(error.message || "Không thể lấy danh sách người dùng.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const forgotPassword = async (data: { email: string }) => {
    try {
      await apiForgotPassword(data);
      toast.success("Yêu cầu đặt lại mật khẩu đã được gửi!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Error during forgot password:", error.message);
      toast.error(error.message || "Yêu cầu đặt lại mật khẩu thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const getUserById = async (id: string) => {
    try {
      const res = await apiGetUserById(id);
      return res;
    } catch (error: any) {
      console.error("Error fetching user by ID:", error.message);
      toast.error(error.message || "Không thể lấy thông tin người dùng.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const updateUser = async (id: string, data: any) => {
    try {
      const res = await apiUpdateUser(id, data);
      if (user && user._id === id) setUser(res);
      toast.success("Cập nhật người dùng thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Error updating user:", error.message);
      toast.error(error.message || "Cập nhật người dùng thất bại.", { position: "top-right", autoClose: 3000 });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiDeleteUser(id);
      if (user && user._id === id) {
        console.log("Deleting current user, removing token");
        setUser(null);
        localStorage.removeItem("token");
      }
      toast.success("Xóa người dùng thành công!", { position: "top-right", autoClose: 3000 });
    } catch (error: any) {
      console.error("Error deleting user:", error.message);
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};