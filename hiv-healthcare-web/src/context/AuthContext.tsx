import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import jwt_decode_ from "jwt-decode"; // import bình thường sẽ bị lỗi nếu TS không hiểu kiểu
import type { User } from "../types/user";

// Ép kiểu thủ công để tránh lỗi "no call signatures"
const jwt_decode = jwt_decode_ as unknown as (token: string) => any;

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded.user || decoded); // Tùy thuộc vào cấu trúc server trả JWT
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: any = jwt_decode(token);
    setUser(decoded.user || decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
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
