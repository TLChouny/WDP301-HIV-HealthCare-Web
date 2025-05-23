import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-teal-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
              <span className="text-teal-700 font-bold text-xl">HC</span>
            </div>
            <span className="text-xl font-bold">HIV Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="py-2 text-white hover:text-teal-200 font-medium">
              Trang chủ
            </Link>
            <div className="relative group">
              <button className="py-2 text-white hover:text-teal-200 font-medium flex items-center">
                Dịch vụ <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <Link
                  to="/services/testing"
                  className="block px-4 py-2 text-gray-800 hover:bg-teal-50 hover:text-teal-700"
                >
                  Tư vấn & Xét nghiệm
                </Link>
                <Link
                  to="/services/treatment"
                  className="block px-4 py-2 text-gray-800 hover:bg-teal-50 hover:text-teal-700"
                >
                  Điều trị ARV
                </Link>
                <Link
                  to="/services/support"
                  className="block px-4 py-2 text-gray-800 hover:bg-teal-50 hover:text-teal-700"
                >
                  Hỗ trợ tâm lý
                </Link>
              </div>
            </div>
            <Link to="/doctors" className="py-2 text-white hover:text-teal-200 font-medium">
              Bác sĩ
            </Link>
            <Link to="/blog" className="py-2 text-white hover:text-teal-200 font-medium">
              Blog
            </Link>
            <Link to="/about" className="py-2 text-white hover:text-teal-200 font-medium">
              Giới thiệu
            </Link>
            <Link to="/contact" className="py-2 text-white hover:text-teal-200 font-medium">
              Liên hệ
            </Link>
          </nav>

          {/* Buttons (Book Appointment, Login, Register) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/appointment"
              className="bg-white text-teal-700 hover:bg-teal-50 px-5 py-2 rounded-lg font-medium transition duration-200"
            >
              Đặt lịch khám
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-teal-200 font-medium transition duration-200"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg font-medium transition duration-200"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-teal-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="py-2 text-white hover:text-teal-200 font-medium">
                Trang chủ
              </Link>
              <div className="py-2">
                <button className="text-white hover:text-teal-200 font-medium flex items-center">
                  Dịch vụ <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="pl-4 mt-2 space-y-2">
                  <Link to="/services/testing" className="block py-1 text-teal-100 hover:text-white">
                    Tư vấn & Xét nghiệm
                  </Link>
                  <Link to="/services/treatment" className="block py-1 text-teal-100 hover:text-white">
                    Điều trị ARV
                  </Link>
                  <Link to="/services/support" className="block py-1 text-teal-100 hover:text-white">
                    Hỗ trợ tâm lý
                  </Link>
                </div>
              </div>
              <Link to="/doctors" className="py-2 text-white hover:text-teal-200 font-medium">
                Bác sĩ
              </Link>
              <Link to="/blog" className="py-2 text-white hover:text-teal-200 font-medium">
                Blog
              </Link>
              <Link to="/about" className="py-2 text-white hover:text-teal-200 font-medium">
                Giới thiệu
              </Link>
              <Link to="/contact" className="py-2 text-white hover:text-teal-200 font-medium">
                Liên hệ
              </Link>
              <Link
                to="/appointment"
                className="bg-white text-teal-700 hover:bg-teal-50 px-5 py-2 rounded-lg font-medium transition duration-200 inline-block text-center mt-2"
              >
                Đặt lịch khám
              </Link>
              <Link
                to="/login"
                className="py-2 text-white hover:text-teal-200 font-medium mt-2"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg font-medium transition duration-200 mt-2 text-center"
              >
                Đăng ký
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;