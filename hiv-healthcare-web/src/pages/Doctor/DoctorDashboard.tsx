import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Users, 
  Pill,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  FileText,
  Activity,
  Heart
} from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface ARVProtocol {
  id: string;
  name: string;
  description: string;
  medications: string[];
  category: 'adult' | 'pregnant' | 'pediatric';
  status: 'active' | 'inactive';
}

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('patients');
  const [search, setSearch] = useState<string>('');

  const tabs: Tab[] = [
    { id: 'patients', name: 'Quản lý Bệnh nhân', icon: <Users className="w-5 h-5" /> },
    { id: 'appointments', name: 'Lịch hẹn', icon: <Calendar className="w-5 h-5" /> },
    { id: 'arv-protocols', name: 'Phác đồ ARV', icon: <Pill className="w-5 h-5" /> },
    { id: 'medical-records', name: 'Hồ sơ bệnh án', icon: <FileText className="w-5 h-5" /> },
  ];

  const arvProtocols: ARVProtocol[] = [
    {
      id: '1',
      name: 'TDF + 3TC + DTG',
      description: 'Phác đồ điều trị ARV chuẩn cho người lớn',
      medications: ['Tenofovir (TDF)', 'Lamivudine (3TC)', 'Dolutegravir (DTG)'],
      category: 'adult',
      status: 'active'
    },
    {
      id: '2',
      name: 'TDF + 3TC + EFV',
      description: 'Phác đồ thay thế cho phụ nữ mang thai',
      medications: ['Tenofovir (TDF)', 'Lamivudine (3TC)', 'Efavirenz (EFV)'],
      category: 'pregnant',
      status: 'active'
    },
    {
      id: '3',
      name: 'ABC + 3TC + LPV/r',
      description: 'Phác đồ điều trị cho trẻ em',
      medications: ['Abacavir (ABC)', 'Lamivudine (3TC)', 'Lopinavir/ritonavir (LPV/r)'],
      category: 'pediatric',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Bác sĩ điều trị</h1>
          <p className="text-gray-600 mt-2">Quản lý bệnh nhân và phác đồ điều trị ARV</p>
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
                {activeTab === 'arv-protocols' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {arvProtocols.map((protocol) => (
                        <div key={protocol.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{protocol.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              protocol.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {protocol.status === 'active' ? 'Đang sử dụng' : 'Không sử dụng'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{protocol.description}</p>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Thuốc trong phác đồ:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {protocol.medications.map((med, index) => (
                                <li key={index}>{med}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4 inline mr-1" />
                              Chỉnh sửa
                            </button>
                            <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4 inline mr-1" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
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
                        <h3 className="font-medium text-green-800">Đang điều trị ARV</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">789</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Cần theo dõi</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">45</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Lịch hẹn hôm nay</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">23</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Đã hoàn thành</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">15</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Đang chờ</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'medical-records' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Hồ sơ mới</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Đã cập nhật</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">45</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Cần xem xét</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 