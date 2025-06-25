import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Search, 
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Activity,
  Heart,
  AlertCircle,
  Pill
} from 'lucide-react';
import { BookingProvider, useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

const PatientManagement: React.FC = () => {
  const { getByDoctorName } = useBooking();
  const { user } = useAuth(); // user là doctor đang đăng nhập
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTreatmentStage, setSelectedTreatmentStage] = useState<string>('all');

  useEffect(() => {
    const fetchPatients = async () => {
      if (user && user.userName) {
        setLoading(true);
        try {
          // Lấy booking theo doctorName = userName của bác sĩ đăng nhập
          const bookings = await getByDoctorName(user.userName);
          setPatients(bookings);
        } catch (error) {
          setPatients([]);
        }
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user, getByDoctorName]);

  const statuses = ['all', 'active', 'inactive', 'critical'];
  const treatmentStages = [
    'all',
    'Đang điều trị ARV',
    'Cần theo dõi đặc biệt',
    'Đã ngừng điều trị',
    'Chờ kết quả xét nghiệm'
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search) ||
      patient.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    const matchesTreatmentStage = selectedTreatmentStage === 'all' || patient.treatmentStage === selectedTreatmentStage;
    return matchesSearch && matchesStatus && matchesTreatmentStage;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang điều trị';
      case 'inactive':
        return 'Không hoạt động';
      case 'critical':
        return 'Cần theo dõi';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4" />;
      case 'critical':
        return <Heart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi thông tin bệnh nhân HIV
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
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
              <select
                value={selectedTreatmentStage}
                onChange={(e) => setSelectedTreatmentStage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {treatmentStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage === 'all' ? 'Tất cả giai đoạn' : stage}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Thêm bệnh nhân</span>
            </button>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phác đồ ARV
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
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.age} tuổi - {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.treatmentStage}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {patient.arvProtocol ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Pill className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {patient.arvProtocol.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Bắt đầu: {patient.arvProtocol.startDate}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.arvProtocol.notes}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Chưa có phác đồ</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(patient.status)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(patient.status)}`}>
                          {getStatusText(patient.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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

export default PatientManagement;