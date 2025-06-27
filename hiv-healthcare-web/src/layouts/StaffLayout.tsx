import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Users, 
  FileText,
  LogOut,
  Menu,
  X,
  ClipboardList,
  MessageSquare,
  Settings,
  Home,
  Bell
} from 'lucide-react';
import { logout } from '../api/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }
      
      await logout(token);
      
      // Xóa token và thông tin user khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chuyển về trang chủ và reload lại trang
      navigate('/');
      window.location.reload();
      
      toast.success('Đăng xuất thành công');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Đăng xuất thất bại');
      
      // Nếu có lỗi vẫn xóa token và chuyển về trang chủ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
      window.location.reload();
    }
  };

  const navigation = [
    {
      name: 'Tổng quan',
      path: '/staff/dashboard',
      icon: <User className="w-5 h-5" />
    },
    {
      name: 'Quản lý Bệnh nhân',
      path: '/staff/patients',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Quản lý gói dịch vụ',
      path: '/staff/services',
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      name: 'Xác nhận Lịch hẹn',
      path: '/staff/appointments',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      name: 'Tư vấn',
      path: '/staff/counseling',
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/staff/dashboard" className="flex items-center space-x-2">
              <User className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">HIV Care</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Staff
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Nhân viên
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button (always visible at left edge when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-60 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-blue-50 transition-colors lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6 text-blue-600" />
        </button>
      )}

      {/* Main Content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? '' : 'pl-0'}`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle Button (always visible on mobile, hidden on desktop) */}
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-600"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <Link 
                to="/"
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">Trang chủ</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Icon thông báo cố định */}
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
              </div>
              <Link 
                to="/staff/settings"
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600"
              >
                <Settings className="w-6 h-6" />
                <span className="hidden md:inline">Cài đặt</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600"
              >
                <LogOut className="w-6 h-6" />
                <span className="hidden md:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout; 