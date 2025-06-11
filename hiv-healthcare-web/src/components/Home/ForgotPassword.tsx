import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
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

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Reset mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { forgotPassword, verifyResetOTP, resetPassword } = useAuth();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error("Vui lòng nhập email!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email phải chứa @ và đúng định dạng!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    try {
      await forgotPassword({ email });
      setStep(2);
      setResendCooldown(60);
      toast.success("OTP đã được gửi đến email của bạn!", TOAST_CONFIG);
    } catch (error: any) {
      let errorMessage = "Gửi OTP thất bại!";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes("not found")) errorMessage = "Email không tồn tại!";
      }
      toast.error(errorMessage, TOAST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");

    const otpRegex = /^\d{6}$/;
    if (!otp || !otpRegex.test(otp)) {
      setOtpError(!otp ? "Vui lòng nhập mã OTP!" : "Mã OTP phải là 6 chữ số!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyResetOTP({ email, otp });
      if (!response.resetToken) {
        throw new Error("Reset token không được trả về từ server!");
      }
      setResetToken(response.resetToken);
      setStep(3);
      setOtp("");
      toast.success("Xác minh OTP thành công!", TOAST_CONFIG);
    } catch (error: any) {
      let errorMessage = "Xác minh OTP thất bại!";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes("expired")) {
          errorMessage = "Mã OTP đã hết hạn! Vui lòng nhấn 'Gửi lại OTP'.";
          setOtpError(errorMessage);
        } else if (errorMessage.includes("otp")) {
          errorMessage = "Mã OTP không đúng!";
          setOtpError(errorMessage);
        }
      } else if (error.message) {
        errorMessage = error.message;
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
      await forgotPassword({ email });
      setResendCooldown(60);
      setOtp("");
      setOtpError("");
      toast.success("Đã gửi lại OTP đến email của bạn!", TOAST_CONFIG);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gửi lại OTP thất bại!", TOAST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newPassword || newPassword.length < 6) {
      toast.error(!newPassword ? "Vui lòng nhập mật khẩu mới!" : "Mật khẩu phải có ít nhất 6 ký tự!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    try {
      if (!resetToken) {
        toast.error("Reset token không tồn tại! Vui lòng thử lại từ đầu.", TOAST_CONFIG);
        setStep(1);
        return;
      }
      await resetPassword({ resetToken, newPassword });
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.", TOAST_CONFIG);
      navigate("/login");
    } catch (error: any) {
      let errorMessage = "Đặt lại mật khẩu thất bại!";
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("token")) {
          errorMessage = "Phiên đặt lại mật khẩu đã hết hạn! Vui lòng thử lại.";
          setStep(1);
        } else {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage, TOAST_CONFIG);
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
              <span className="relative z-10">
                {step === 1 ? "Quên Mật Khẩu" : step === 2 ? "Xác Minh OTP" : "Đặt Lại Mật Khẩu"}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
            </h2>

            {step === 1 && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
                </p>
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
                <div className="animate-zoomIn">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Gửi OTP"}</span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTPSubmit} className="space-y-6">
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-gray-700 text-sm font-medium mb-1">
                    Mã OTP
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`w-full border ${
                        otpError ? "border-red-500" : "border-gray-300"
                      } rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 text-center tracking-widest`}
                      placeholder="Nhập mã OTP (6 chữ số)"
                      maxLength={6}
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Mail className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                  {otpError && <p className="mt-2 text-sm text-red-500 animate-fadeIn">{otpError}</p>}
                </div>
                <div className="animate-zoomIn">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Xác Minh OTP"}</span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className={`text-teal-600 hover:text-teal-700 text-sm font-medium transition-all duration-300 ${
                      resendCooldown > 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading || resendCooldown > 0}
                  >
                    Gửi lại OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                <div className="mb-4">
                  <label htmlFor="new-password" className="block text-gray-700 text-sm font-medium mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                      placeholder="Nhập mật khẩu mới"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Lock className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                      placeholder="Xác nhận mật khẩu"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Lock className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
                <div className="animate-zoomIn">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}</span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-700 font-medium transition-all duration-300 flex items-center justify-center group"
                >
                  <span>Đăng nhập ngay</span>
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

export default ForgotPassword;