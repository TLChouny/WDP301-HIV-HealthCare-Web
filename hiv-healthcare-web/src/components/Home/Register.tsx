import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "../../styles/animation.css";

const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const Register: React.FC = () => {
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { register, verifyOTP, resendOTP } = useAuth();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userName || userName.length < 2) {
      toast.error(!userName ? "Vui lòng nhập họ và tên!" : "Họ và tên phải có ít nhất 2 ký tự!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error(!email ? "Vui lòng nhập email!" : "Email phải chứa @ và đúng định dạng!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      toast.error(!phoneNumber ? "Vui lòng nhập số điện thoại!" : "Số điện thoại không hợp lệ! Phải có 10-15 chữ số.", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      toast.error(!password ? "Vui lòng nhập mật khẩu!" : "Mật khẩu phải có ít nhất 6 ký tự!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    try {
      await register({ userName, email, password, phone_number: phoneNumber });
      setShowOTPForm(true);
      setResendCooldown(60);
    } catch (error: any) {
      let errorMessage = "Đăng ký thất bại!";
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("email")) errorMessage = "Email đã được sử dụng!";
        else if (error.response.data.message.includes("phone")) errorMessage = "Số điện thoại đã được sử dụng!";
        else errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, TOAST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const otpRegex = /^\d{6}$/;
    if (!otp || !otpRegex.test(otp)) {
      toast.error(!otp ? "Vui lòng nhập mã OTP!" : "Mã OTP phải là 6 chữ số!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    try {
      await verifyOTP({ email, otp });
      // Chuyển hướng sau khi AuthContext cập nhật user
      navigate("/");
    } catch (error: any) {
      let errorMessage = "Xác minh OTP thất bại!";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message.includes("otp") ? "Mã OTP không đúng!" : error.response.data.message;
      }
      toast.error(errorMessage, TOAST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) {
      toast.info(`Vui lòng chờ ${resendCooldown} giây để gửi lại OTP!`, TOAST_CONFIG);
      return;
    }

    setIsLoading(true);
    try {
      await resendOTP({ email });
      setResendCooldown(60);
      toast.success("Đã gửi lại mã OTP qua email!", TOAST_CONFIG);
    } catch (error: any) {
      toast.error(error.message || "Gửi lại OTP thất bại!", TOAST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-8 text-gray-800">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
              <span className="relative z-10">{showOTPForm ? "Xác minh OTP" : "Đăng Ký"}</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
            </h2>
            {!showOTPForm ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Họ và tên</label>
                  <div className="relative group">
                    <input type="text" id="name" value={userName} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300" placeholder="Nhập họ và tên" disabled={isLoading} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><User className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" /></div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <div className="relative group">
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300" placeholder="Nhập email của bạn" disabled={isLoading} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><Mail className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" /></div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="phone-number" className="block text-gray-700 text-sm font-medium mb-1">Số điện thoại</label>
                  <div className="relative group">
                    <input type="tel" id="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300" placeholder="Nhập số điện thoại (VD: 0123456789)" disabled={isLoading} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><Phone className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" /></div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label>
                  <div className="relative group">
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300" placeholder="Nhập mật khẩu" disabled={isLoading} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><Lock className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" /></div>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300" placeholder="Xác nhận mật khẩu" disabled={isLoading} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><Lock className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" /></div>
                  </div>
                </div>
                <div className="animate-zoomIn">
                  <button type="submit" className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 relative overflow-hidden group" disabled={isLoading}>
                    <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Đăng Ký"}</span>
                    {isLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-gray-700 text-sm font-medium mb-1">Mã OTP</label>
                  <div className="relative group">
                    <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 text-center tracking-widest" placeholder="Nhập mã OTP (6 chữ số)" maxLength={6} disabled={isLoading} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><Mail className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" /></div>
                  </div>
                </div>
                <div className="animate-zoomIn">
                  <button type="submit" className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 relative overflow-hidden group" disabled={isLoading}>
                    <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Xác minh OTP"}</span>
                    {isLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                  </button>
                </div>
                <div className="text-center">
                  <button type="button" onClick={handleResendOTP} className={`text-teal-600 hover:text-teal-700 text-sm font-medium transition-all duration-300 ${resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading || resendCooldown > 0}>
                    Gửi lại OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
                  </button>
                </div>
              </form>
            )}
            <div className="mt-6 text-center">
              <p className="text-gray-600">Đã có tài khoản? <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium transition-all duration-300 flex items-center justify-center group"><span>Đăng nhập ngay</span><ArrowRight className="h-4 w-4 ml-1 transition-all duration-300 group-hover:ml-2" /></Link></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;