import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

type Gender = "male" | "female" | "other";
type Role = "user" | "admin" | "doctor" | "staff" | "manager";

interface User {
  _id: string;
  userName: string;
  email: string;
  phone_number?: string;
  gender?: Gender;
  address?: string;
  role: Role;
  avatar?: string;
  userDescription?: string;
  categoryId?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JwtPayload {
  user?: User;
  sub?: string;
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
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isStaff: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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
        _id: decoded.sub || decoded._id || "unknown",
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
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = decodeAndValidateToken(token);
        setUser(userData);
      } catch (error: any) {
        console.error("Error decoding token:", error.message);
        localStorage.removeItem("token");
        setUser(null);
        toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        if (!event.newValue) {
          setUser(null);
          toast.info("Đã đăng xuất.", toastConfig);
        } else {
          try {
            const userData = decodeAndValidateToken(event.newValue);
            setUser(userData);
          } catch (error: any) {
            console.error("Error decoding token from storage event:", error.message);
            localStorage.removeItem("token");
            setUser(null);
            toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", toastConfig);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token: string) => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Token is missing or invalid");
      }
      console.log("Token received for login:", token);

      const userData = decodeAndValidateToken(token);
      localStorage.setItem("token", token);
      setUser(userData);
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error during login:", error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Đã đăng xuất.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isDoctor: user?.role === "doctor",
        isStaff: user?.role === "staff",
        isManager: user?.role === "manager",
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