import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "../../styles/animation.css";

// Cấu hình toast chung
const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as const,
};

// Hàm tiện ích để hiển thị toast
const showToast = (message: string, type: "error" | "success" = "error") => {
  if (!toast.isActive(message)) {
    const config = { ...TOAST_CONFIG, toastId: message };
    if (type === "success") {
      toast.success(message, config);
    } else {
      toast.error(message, config);
    }
  }
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    console.log("Login payload:", { email, password });

    // Kiểm tra email rỗng
    if (!email) {
      showToast("Vui lòng nhập email!");
      setIsLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Email không đúng định dạng!");
      setIsLoading(false);
      return;
    }

    // Kiểm tra mật khẩu rỗng
    if (!password) {
      showToast("Vui lòng nhập mật khẩu!");
      setIsLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự!");
      setIsLoading(false);
      return;
    }

    try {
      await authLogin({ email, password });
      const token = localStorage.getItem("token");
      console.log("Token after login:", token);
      navigate("/");
      showToast("Đăng nhập thành công!", "success");
    } catch (error: any) {
      console.error("Login error:", error);

      // Kiểm tra lỗi sai mật khẩu
      if (
        error.message?.toLowerCase().includes("password") ||
        error.code === "auth/invalid-password" ||
        error.message?.toLowerCase().includes("invalid credential")
      ) {
        showToast("Sai mật khẩu!");
      } else {
        showToast(error.message || "Đăng nhập thất bại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-25 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-25 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-8 text-gray-800">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
              <span className="relative z-10">Đăng Nhập</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    placeholder="Nhập email của bạn"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Mail className="h-5 w-5 text-gray-400 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    placeholder="Nhập mật khẩu"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Lock className="h-5 w-5 text-gray-400 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-teal-600 hover:text-teal-700 text-sm transition-colors duration-300"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="animate-zoomIn">
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <span className="relative z-10">
                    {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-teal-600 hover:text-teal-700 font-medium transition-all duration-300 flex items-center justify-center group"
                >
                  <span>Đăng ký ngay</span>
                  <ArrowRight className="h-4 w-4 ml-1 transition-all duration-300 group-hover:ml-2" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;