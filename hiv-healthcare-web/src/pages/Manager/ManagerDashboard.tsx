import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Users, 
  Building2, 
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight
} from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('doctors');
  const [search, setSearch] = useState<string>('');

  const tabs: Tab[] = [
    { id: 'doctors', name: 'Quản lý Bác sĩ', icon: <User className="w-5 h-5" /> },
    { id: 'appointments', name: 'Quản lý Lịch hẹn', icon: <Calendar className="w-5 h-5" /> },
    { id: 'patients', name: 'Quản lý Bệnh nhân', icon: <Users className="w-5 h-5" /> },
    { id: 'clinics', name: 'Quản lý Phòng khám', icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý hệ thống</h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi toàn bộ hoạt động của hệ thống</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {/* Content Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {tabs.find(tab => tab.id === activeTab)?.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Thêm mới</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {activeTab === 'doctors' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Tổng số bác sĩ</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Bác sĩ đang làm việc</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">20</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Bác sĩ nghỉ phép</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">4</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Tổng số lịch hẹn</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Lịch hẹn hôm nay</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">23</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Lịch hẹn đang chờ</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">12</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'patients' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Tổng số bệnh nhân</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Bệnh nhân mới</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">45</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Đang điều trị</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">789</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'clinics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Tổng số phòng khám</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Đang hoạt động</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">7</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Đang bảo trì</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">1</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-2">
                    <Edit className="w-5 h-5" />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <Trash2 className="w-5 h-5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 