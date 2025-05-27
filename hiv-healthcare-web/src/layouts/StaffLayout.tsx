import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Users, 
  FileText,
  LogOut,
  Settings,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

const StaffLayout: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/staff/dashboard', icon: <User className="w-5 h-5" /> },
    { name: 'Quản lý Bệnh nhân', href: '/staff/patients', icon: <Users className="w-5 h-5" /> },
    { name: 'Lịch hẹn', href: '/staff/appointments', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Hồ sơ bệnh án', href: '/staff/medical-records', icon: <FileText className="w-5 h-5" /> },
    { name: 'Danh sách thuốc', href: '/staff/medications', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Tư vấn', href: '/staff/counseling', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-gray-800">Staff Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t">
            <Link
              to="/staff/settings"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-5 h-5" />
              <span className="ml-3">Cài đặt</span>
            </Link>
            <Link
              to="/auth/login"
              className="flex items-center px-4 py-2 mt-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Đăng xuất</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout; 