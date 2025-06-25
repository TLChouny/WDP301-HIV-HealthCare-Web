import React, { useEffect } from "react";
import {
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Twitter,
  X,
  Youtube,
  Bell,
} from "react-feather";
import { Link, useLocation, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { useCategoryContext } from "../context/CategoryContext";
import { useNotification } from "../context/NotificationContext";

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { categories } = useCategoryContext();
  const { notifications, getNotificationsByUserIdHandler, loading, error } = useNotification();

  const isAuthPage =
    location.pathname.startsWith("/auth") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  // Lấy notification theo userId khi user thay đổi
  useEffect(() => {
    if (user) {
      getNotificationsByUserIdHandler(user._id);
    }
  }, [user, getNotificationsByUserIdHandler]);

  // Đóng mobile menu khi route thay đổi
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle hiệu ứng scroll cho header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto-close dropdown after 3 seconds if no interaction
  useEffect(() => {
    if (activeDropdown === "userDesktop" || activeDropdown === "userMobile") {
      const timer = setTimeout(() => {
        setActiveDropdown(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or state change
    }
  }, [activeDropdown]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Header */}
      <header
        className={`bg-gradient-to-r from-teal-700 to-teal-800 text-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg py-4" : "py-6"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group transition-transform duration-300 hover:scale-105"
              aria-label="HIV Care Home"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <span className="text-teal-700 font-bold text-xl group-hover:text-teal-600 transition-colors duration-300">
                  HC
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight group-hover:text-teal-100 transition-colors duration-300">
                HIV Care
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`py-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-200 after:transition-all after:duration-300 ${
                  location.pathname === "/"
                    ? "text-teal-100 after:w-full"
                    : "text-white hover:text-teal-100"
                }`}
              >
                Trang chủ
              </Link>

              {/* Dropdown "Dịch vụ" */}
              <div className="relative group">
                <button
                  className={`py-2 font-medium flex items-center relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 group-hover:after:w-full after:bg-teal-200 after:transition-all after:duration-300 ${
                    location.pathname.includes("/services")
                      ? "text-teal-100 after:w-full"
                      : "text-white hover:text-teal-100"
                  }`}
                  onClick={() => toggleDropdown("servicesDesktop")}
                  type="button"
                >
                  Dịch vụ{" "}
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                      activeDropdown === "servicesDesktop" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 transition-all duration-300 origin-top-left ${
                    activeDropdown === "servicesDesktop"
                      ? "visible opacity-100 translate-y-0"
                      : "invisible opacity-0 -translate-y-2"
                  }`}
                >
                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-gray-500">Đang tải...</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/services/category/${cat._id}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {cat.categoryName}
                      </Link>
                    ))
                  )
                }
                </div>
              </div>

              <Link
                to="/doctors"
                className={`py-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-200 after:transition-all after:duration-300 ${
                  location.pathname === "/doctors"
                    ? "text-teal-100 after:w-full"
                    : "text-white hover:text-teal-100"
                }`}
              >
                Bác sĩ
              </Link>
              <Link
                to="/blog"
                className={`py-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-200 after:transition-all after:duration-300 ${
                  location.pathname === "/blog"
                    ? "text-teal-100 after:w-full"
                    : "text-white hover:text-teal-100"
                }`}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className={`py-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-200 after:transition-all after:duration-300 ${
                  location.pathname === "/about"
                    ? "text-teal-100 after:w-full"
                    : "text-white hover:text-teal-100"
                }`}
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className={`py-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-200 after:transition-all after:duration-300 ${
                  location.pathname === "/contact"
                    ? "text-teal-100 after:w-full"
                    : "text-white hover:text-teal-100"
                }`}
              >
                Liên hệ
              </Link>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/appointment"
                className="bg-white text-teal-700 hover:bg-teal-50 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
              >
                Đặt lịch khám
              </Link>
              <div className="h-6 w-px bg-teal-600"></div>
              {!isAuthPage && user ? (
                <div className="relative group flex items-center">
                  {/* Bell icon with badge and dropdown */}
                  <div className="relative">
                    <button
                      className="relative mr-3"
                      onClick={() => toggleDropdown("notificationDesktop")}
                      aria-label="Thông báo booking"
                    >
                      <span className="relative">
                        <Bell className="w-6 h-6 text-teal-100" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                          {loading ? "..." : notifications.length}
                        </span>
                      </span>
                    </button>
                    {/* Notification Dropdown */}
                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 mt-2 w-96 bg-white rounded-lg shadow-xl py-2 z-10 transition-all duration-300 ${
                        activeDropdown === "notificationDesktop"
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Thông báo đặt lịch</h3>
                        {/* Lời nhắc nhở cho user */}
                        <div className="flex items-center mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded-md">
                          <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                          <span className="text-yellow-800 text-sm font-medium">Bạn nên kiểm tra lịch hẹn trong hồ sơ cá nhân để không bỏ lỡ dịch vụ đã đặt.</span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                          <p className="px-4 py-3 text-gray-500 text-center">Đang tải...</p>
                        ) : error ? (
                          <p className="px-4 py-3 text-red-500 text-center">{error}</p>
                        ) : notifications.length === 0 ? (
                          <p className="px-4 py-3 text-gray-500 text-center">Chưa có thông báo nào</p>
                        ) : (
                          notifications.map((notification, idx) => (
                            <div key={notification._id || idx} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800">Thông báo: {notification.notiName || "Thông báo"}</p>
                                  <p className="text-sm text-gray-600">Dịch vụ: {notification.bookingId.serviceId.serviceName || "Chi tiết không có"}</p>
                                  <p className="text-sm text-gray-600">Time: {notification.bookingId.startTime || "Chi tiết không có"} 
                                    - {notification.bookingId.endTime || "Chi tiết không có"}</p>
                                  <p className="text-sm text-gray-600">Gía tiền: {notification.bookingId.serviceId.price || "Chi tiết không có"}</p>

                                  {/* <div className="flex items-center mt-1 text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                                  </div> */}
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  notification.bookingId.status === "checked-in"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {notification.bookingId.status || "Chờ xác nhận"}
                                </span>
                              </div>
                              <div className="mt-2 flex justify-end">
                                <Link
                                  to="#"
                                  className="text-teal-600 hover:text-teal-800 text-sm font-medium underline"
                                  onClick={() => {
                                    setSelectedNotification(notification);
                                    setShowModal(true);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Xem chi tiết
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <button
                          className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-lg uppercase cursor-pointer"
                    onClick={() => toggleDropdown("userDesktop")}
                  >
                    {user?.email?.charAt(0) ?? ""}
                  </div>
                  <div
                    className={`absolute left-1/2 top-full -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 transition-all duration-300 ${
                      activeDropdown === "userDesktop"
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <Link
                      to="/user/profile"
                      className="block px-5 py-3 text-gray-800 font-medium hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Hồ sơ
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setActiveDropdown(null);
                      }}
                      className="block w-full text-left px-5 py-3 text-gray-800 font-medium hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Đăng xuất
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                !isAuthPage && (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-white hover:text-teal-100 font-medium transition-colors duration-300 flex items-center"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-teal-600 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 py-4 bg-teal-800 shadow-inner">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`py-2.5 font-medium transition-colors duration-200 rounded-md px-3 ${
                  location.pathname === "/"
                    ? "bg-teal-700 text-white"
                    : "text-white hover:bg-teal-700/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>

              {/* Dropdown Mobile */}
              <div className="py-2">
                <button
                  className={`text-white font-medium flex items-center justify-between w-full rounded-md px-3 py-2 ${
                    activeDropdown === "servicesMobile" ? "bg-teal-700" : "hover:bg-teal-700/50"
                  }`}
                  onClick={() => toggleDropdown("servicesMobile")}
                >
                  <span>Dịch vụ</span>
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                      activeDropdown === "servicesMobile" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`mt-2 space-y-1 pl-4 overflow-hidden transition-all duration-300 ${
                    activeDropdown === "servicesMobile" ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {categories.length === 0 ? (
                    <p className="px-3 py-2 text-teal-200">Đang tải...</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/services/${cat._id}`}
                        className="block py-2 px-3 text-teal-100 hover:text-white hover:bg-teal-700/30 rounded-md transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {cat.categoryName}
                      </Link>
                    ))
                  )
                }
                </div>
              </div>

              <Link
                to="/doctors"
                className={`py-2.5 font-medium transition-colors duration-200 rounded-md px-3 ${
                  location.pathname === "/doctors"
                    ? "bg-teal-700 text-white"
                    : "text-white hover:bg-teal-700/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Bác sĩ
              </Link>
              <Link
                to="/blog"
                className={`py-2.5 font-medium transition-colors duration-200 rounded-md px-3 ${
                  location.pathname === "/blog"
                    ? "bg-teal-700 text-white"
                    : "text-white hover:bg-teal-700/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className={`py-2.5 font-medium transition-colors duration-200 rounded-md px-3 ${
                  location.pathname === "/about"
                    ? "bg-teal-700 text-white"
                    : "text-white hover:bg-teal-700/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className={`py-2.5 font-medium transition-colors duration-200 rounded-md px-3 ${
                  location.pathname === "/contact"
                    ? "bg-teal-700 text-white"
                    : "text-white hover:bg-teal-700/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <div className="pt-2 border-t border-teal-700/50 mt-2">
                <Link
                  to="/appointment"
                  className="bg-white text-teal-700 hover:bg-teal-50 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow inline-block text-center w-full mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đặt lịch khám
                </Link>
                {!isAuthPage && user ? (
                  <div className="py-2">
                    <button
                      className={`text-white font-medium flex items-center justify-between w-full rounded-md px-3 py-2 ${
                        activeDropdown === "userMobile" ? "bg-teal-700" : "hover:bg-teal-700/50"
                      }`}
                      onClick={() => toggleDropdown("userMobile")}
                    >
                      <span className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-lg uppercase">
                        {user?.email?.charAt(0) ?? ""}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                          activeDropdown === "userMobile" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`mt-2 space-y-1 pl-4 overflow-hidden transition-all duration-300 ${
                        activeDropdown === "userMobile" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <Link
                        to="/user/profile"
                        className="block py-2 px-3 text-teal-100 hover:text-white hover:bg-teal-700/30 rounded-md transition-colors duration-200"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Hồ sơ
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left py-2 px-3 text-teal-100 hover:text-white hover:bg-teal-700/30 rounded-md transition-colors duration-200"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  !isAuthPage && (
                    <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                      <Link
                        to="/login"
                        className="text-white hover:text-teal-100 font-medium transition-colors duration-200 bg-teal-700/50 hover:bg-teal-700 py-2.5 px-4 rounded-lg text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="bg-teal-600 hover:bg-teal-500 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-800 to-teal-900 text-white shadow-inner relative">
        {/* Wave Separator */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none h-12">
          <svg
            className="relative block w-full h-12"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-gray-50"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 shadow-md transform transition-transform duration-500 hover:rotate-12">
                  <span className="text-teal-700 font-bold text-xl">HC</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">HIV Care</span>
              </div>
              <p className="text-teal-100 mb-8 leading-relaxed">
                Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho người sống chung với HIV, với đội ngũ y bác
                sĩ chuyên nghiệp và tận tâm.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                  { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                  { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                  { icon: <Youtube className="h-5 w-5" />, label: "Youtube" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-teal-700/60 flex items-center justify-center hover:bg-teal-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-6 text-white relative inline-block">
                Dịch Vụ
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-teal-400"></span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Xét nghiệm HIV", path: "/services/testing" },
                  { name: "Điều trị ARV", path: "/services/treatment" },
                  { name: "Hỗ trợ tâm lý", path: "/services/support" },
                  { name: "Tư vấn dinh dưỡng", path: "/services/nutrition" },
                  { name: "Chăm sóc tại nhà", path: "/services/homecare" },
                ].map((service, index) => (
                  <li key={index}>
                    <Link
                      to={service.path}
                      className="text-teal-100 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2.5 group-hover:w-2 group-hover:h-2 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                        {service.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-6 text-white relative inline-block">
                Liên Kết Hữu Ích
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-teal-400"></span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Giới thiệu", path: "/about" },
                  { name: "Đội ngũ bác sĩ", path: "/doctors" },
                  { name: "Blog", path: "/blog" },
                  { name: "Câu hỏi thường gặp", path: "/faq" },
                  { name: "Liên hệ", path: "/contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-teal-100 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2.5 group-hover:w-2 group-hover:h-2 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-6 text-white relative inline-block">
                Liên Hệ
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-teal-400"></span>
              </h3>
              <ul className="space-y-5">
                {[
                  {
                    icon: <MapPin className="h-5 w-5 text-teal-300" />,
                    content: "123 Đường Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh",
                  },
                  { icon: <Phone className="h-5 w-5 text-teal-300" />, content: "1800-1234 (Miễn phí)" },
                  { icon: <Mail className="h-5 w-5 text-teal-300" />, content: "info@hivcare.vn" },
                  { icon: <Clock className="h-5 w-5 text-teal-300" />, content: "Thứ 2 - Thứ 7: 8:00 - 17:00" },
                ].map((item, index) => (
                  <li key={index} className="flex group">
                    <div className="mr-3 flex-shrink-0 p-2 bg-teal-800/50 rounded-full group-hover:bg-teal-700/50 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <span className="text-teal-100 group-hover:text-white transition-colors duration-300 mt-1.5">
                      {item.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-teal-950 py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-teal-200 text-sm">
                © 2025 <span className="font-semibold">HIV Care</span>. Tất cả quyền được bảo lưu.
              </p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-8 text-sm">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-teal-200 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-teal-200 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      Điều khoản sử dụng
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg hover:bg-teal-500 transition-all duration-300 transform hover:-translate-y-1 z-50 focus:outline-none"
          aria-label="Lên đầu trang"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>

      {showModal && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 relative flex flex-col items-center animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none transition-colors duration-200"
              onClick={() => setShowModal(false)}
              aria-label="Đóng"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-2 shadow">
                <Bell className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold mb-1 text-teal-700 text-center">Chi tiết thông báo</h2>
              <div className="text-gray-500 text-sm mb-2">{new Date(selectedNotification.createdAt).toLocaleString()}</div>
            </div>
            <div className="w-full space-y-3">
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Tên thông báo:</span>
                <span className="text-teal-700 font-medium">{selectedNotification.notiName}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Mô tả:</span>
                <span className="text-gray-800">{selectedNotification.notiDescription}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Trạng thái booking:</span>
                <span className={`font-semibold px-2 py-1 rounded-lg ${selectedNotification.bookingId?.status === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedNotification.bookingId?.status}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Dịch vụ:</span>
                <span className="text-blue-700 font-medium">{selectedNotification.bookingId?.serviceId?.serviceName}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Bác sĩ:</span>
                <span className="text-gray-800">{selectedNotification.bookingId?.doctorName}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Người đặt:</span>
                <span className="text-gray-800">{selectedNotification.bookingId?.userId?.userName}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Thời gian:</span>
                <span className="text-gray-800">{selectedNotification.bookingId?.startTime} - {selectedNotification.bookingId?.endTime}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-700">Giá tiền:</span>
                <span className="text-rose-600 font-semibold">{selectedNotification.bookingId?.serviceId?.price ? Number(selectedNotification.bookingId?.serviceId?.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="bg-white text-gray-800 rounded-lg shadow-lg border-l-4 border-teal-500 transform transition-all duration-300"
      />
    </div>
  );
};

export default Layout;