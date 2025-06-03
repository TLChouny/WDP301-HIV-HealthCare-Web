import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import "../../styles/animation.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Kiểm tra email trống
    if (!email) {
      toast.error("Vui lòng nhập email!", toastConfig);
      setIsLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email phải chứa @ và đúng định dạng!", toastConfig);
      setIsLoading(false);
      return;
    }

    // Kiểm tra mật khẩu trống
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu!", toastConfig);
      setIsLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!", toastConfig);
      setIsLoading(false);
      return;
    }

    try {
      // Gửi yêu cầu đăng nhập
      const response = await login({ email, password });
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", response.token);
      authLogin(response.token);

      const decoded: any = jwtDecode(response.token);
      const role = decoded.user?.role || decoded.role;

      // Thông báo đăng nhập thành công
      // toast.success("Đăng nhập thành công!", toastConfig);

      // Chuyển hướng dựa trên vai trò
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error: any) {
      let errorMessage = "Email hoặc mật khẩu không đúng!";
      if (error.response?.data?.message) {
        // Kiểm tra lỗi cụ thể từ API
        if (error.response.data.message.includes("password")) {
          errorMessage = "Mật khẩu không đúng!";
        } else if (error.response.data.message.includes("email")) {
          errorMessage = "Email không tồn tại!";
        }
      }
      toast.error(errorMessage, toastConfig);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl animate-pulse"
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
                    <Mail className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
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
                    <Lock className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
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