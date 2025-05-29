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
  MessageSquare
} from 'lucide-react';

const StaffLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add logout logic here (clear tokens, etc.)
    navigate('/auth/login');
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
      name: 'Lịch hẹn',
      path: '/staff/appointments',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      name: 'Hồ sơ bệnh án',
      path: '/staff/medical-records',
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: 'Danh sách thuốc',
      path: '/staff/medications',
      icon: <ClipboardList className="w-5 h-5" />
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
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
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