import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "../../styles/animation.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: authLogin } = useAuth();
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    // Validate
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      setIsLoading(false);
      return;
    }

    try {
      await authLogin({ email, password });
      showToast("Đăng nhập thành công!", "success");
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-25 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-25 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-8 text-gray-800">
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Đăng Nhập</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1" />
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nhập email của bạn"
                    disabled={isLoading}
                  />
                  <Mail className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nhập mật khẩu"
                    disabled={isLoading}
                  />
                  <div
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-gray-400" />
                    ) : (
                      <Eye className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link
                  to="/forgot-password"
                  className="text-teal-600 hover:text-teal-700 text-sm"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-teal-600 hover:underline font-medium">
                  Đăng ký ngay <ArrowRight className="inline w-4 h-4 ml-1" />
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
