// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import TestResults from './pages/TestResults';
// import Doctor from './pages/Doctor';
import ARVTreatment from './pages/ARVTreatment';

// Fallback nếu component không load
const FallbackComponent: React.FC = () => <div className="text-center text-red-500">Component không tìm thấy. Vui lòng kiểm tra đường dẫn hoặc cài đặt.</div>;

// Định nghĩa type cho vai trò người dùng
type UserRole = 'Customer' | 'Doctor' | 'Admin' | 'Guest';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole: UserRole = 'Customer'; // Giả lập

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header */}
      <header className="bg-primary text-black sticky top-0 z-50 shadow-lg">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link to="/">HIV Care</Link>
          </h1>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
            </svg>
          </button>
          <ul className={`md:flex md:space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-primary md:bg-transparent p-4 md:p-0`}>
            <li><Link to="/" className="block py-2 hover:text-accent transition-colors">Trang Chủ</Link></li>
            {userRole === 'Customer' && (
              <>
                <li><Link to="/appointment" className="block py-2 hover:text-accent transition-colors">Đặt Lịch</Link></li>
                <li><Link to="/test-results" className="block py-2 hover:text-accent transition-colors">Kết Quả Xét Nghiệm</Link></li>
              </>
            )}
            {/* {userRole === 'Doctor' && (
              <li><Link to="/arv-treatment" className="block py-2 hover:text-accent transition-colors">Quản Lý Phác Đồ</Link></li>
            )}
            {userRole === 'Admin' && (
              <li><Link to="/doctor" className="block py-2 hover:text-accent transition-colors">Quản Lý Bác Sĩ</Link></li>
            )} */}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/test-results" element={<TestResults />} />
          {/* <Route path="/doctor" element={<Doctor />} /> */}
          <Route path="/arv-treatment" element={<ARVTreatment />} />
          <Route path="*" element={<FallbackComponent />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Về Chúng Tôi</h3>
            <p>Hệ thống hỗ trợ điều trị HIV, cung cấp dịch vụ y tế toàn diện và giảm kỳ thị.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-accent">Trang Chủ</Link></li>
              <li><Link to="/appointment" className="hover:text-accent">Đặt Lịch</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <p>Email: support@hivcare.vn</p>
            <p>Hotline: 0123 456 789</p>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>© {new Date().getFullYear()} Hệ Thống Dịch Vụ Y Tế và Điều Trị HIV. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer position="top-right" autoClose={5000} toastClassName="bg-primary text-white rounded-lg shadow-lg" />
    </div>
  );
};

export default App;