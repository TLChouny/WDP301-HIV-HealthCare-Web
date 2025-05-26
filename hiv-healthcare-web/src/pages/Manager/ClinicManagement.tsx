import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Video,
  Link,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  currentPatients: number;
  status: 'active' | 'maintenance' | 'closed';
  operatingHours: string;
  doctors: string[];
  meetLink?: string;
  nextAvailableSlot?: string;
  notes?: string;
}

const ClinicManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const clinics: Clinic[] = [
    {
      id: '1',
      name: 'Phòng khám HIV - Quận 1',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '028 1234 5678',
      email: 'clinic1@hivhealthcare.com',
      capacity: 50,
      currentPatients: 35,
      status: 'active',
      operatingHours: '08:00 - 17:00 (Thứ 2 - Thứ 6)',
      doctors: ['BS. Trần Thị B', 'BS. Lê Văn D'],
      meetLink: 'https://meet.google.com/abc-defg-hij',
      nextAvailableSlot: '2024-03-25 09:00',
      notes: 'Phòng khám chính, có đầy đủ trang thiết bị'
    },
    {
      id: '2',
      name: 'Phòng khám HIV - Quận 2',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      phone: '028 8765 4321',
      email: 'clinic2@hivhealthcare.com',
      capacity: 30,
      currentPatients: 25,
      status: 'maintenance',
      operatingHours: '08:00 - 17:00 (Thứ 2 - Thứ 6)',
      doctors: ['BS. Phạm Thị F'],
      meetLink: 'https://meet.google.com/klm-nopq-rst',
      notes: 'Đang bảo trì hệ thống'
    },
    {
      id: '3',
      name: 'Phòng khám HIV - Quận 3',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      phone: '028 9876 5432',
      email: 'clinic3@hivhealthcare.com',
      capacity: 40,
      currentPatients: 0,
      status: 'closed',
      operatingHours: '08:00 - 17:00 (Thứ 2 - Thứ 6)',
      doctors: [],
      notes: 'Tạm đóng cửa do dịch bệnh'
    }
  ];

  const statuses = ['all', 'active', 'maintenance', 'closed'];

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch = 
      clinic.name.toLowerCase().includes(search.toLowerCase()) ||
      clinic.address.toLowerCase().includes(search.toLowerCase()) ||
      clinic.phone.includes(search) ||
      clinic.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || clinic.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'maintenance':
        return 'Đang bảo trì';
      case 'closed':
        return 'Đã đóng cửa';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const copyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // Có thể thêm thông báo đã copy thành công
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng khám</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi hoạt động của các phòng khám
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại hoặc email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tất cả trạng thái' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Thêm phòng khám</span>
            </button>
          </div>
        </div>

        {/* Clinics List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin phòng khám
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoạt động
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {clinic.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{clinic.address}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{clinic.operatingHours}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{clinic.email}</span>
                      </div>
                      {clinic.meetLink && (
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Video className="w-4 h-4" />
                          <button
                            onClick={() => copyMeetLink(clinic.meetLink!)}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <Link className="w-4 h-4" />
                            <span>Copy Meet Link</span>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{clinic.currentPatients}/{clinic.capacity} bệnh nhân</span>
                      </div>
                      {clinic.nextAvailableSlot && (
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Lịch trống: {clinic.nextAvailableSlot}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {clinic.doctors.length} bác sĩ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(clinic.status)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(clinic.status)}`}>
                          {getStatusText(clinic.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicManagement; 