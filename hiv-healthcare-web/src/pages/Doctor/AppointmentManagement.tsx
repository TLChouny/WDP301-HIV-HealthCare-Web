import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Pill,
  Activity,
  Heart,
  Shield
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  type: 'first-test' | 'pre-test-counseling' | 'post-test-counseling' | 'regular-checkup' | 'arv-consultation';
  status: 'scheduled' | 'completed' | 'cancelled';
  hivTestHistory: {
    previousTest: boolean;
    lastTestDate?: string;
    lastTestResult?: 'negative' | 'positive' | 'unknown';
  };
  arvTreatment?: {
    isOnTreatment: boolean;
    startDate?: string;
    currentProtocol?: string;
    adherence?: 'good' | 'moderate' | 'poor';
  };
  symptoms?: string[];
  sideEffects?: string[];
  notes?: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  testResults?: {
    viralLoad?: string;
    cd4Count?: string;
    date?: string;
  };
}

const AppointmentManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      patientId: 'BN001',
      date: '2024-03-20',
      time: '09:00',
      type: 'first-test',
      status: 'scheduled',
      hivTestHistory: {
        previousTest: false
      },
      notes: 'Bệnh nhân đến xét nghiệm lần đầu',
      contactInfo: {
        phone: '0123 456 789',
        email: 'nguyenvana@example.com'
      }
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      patientId: 'BN002',
      date: '2024-03-20',
      time: '10:30',
      type: 'regular-checkup',
      status: 'scheduled',
      hivTestHistory: {
        previousTest: true,
        lastTestDate: '2024-02-15',
        lastTestResult: 'positive'
      },
      arvTreatment: {
        isOnTreatment: true,
        startDate: '2024-01-01',
        currentProtocol: 'TDF/3TC/DTG',
        adherence: 'good'
      },
      symptoms: ['Mệt mỏi', 'Sốt nhẹ'],
      sideEffects: ['Buồn nôn'],
      testResults: {
        viralLoad: '20 copies/mL',
        cd4Count: '450 cells/mm³',
        date: '2024-02-15'
      },
      contactInfo: {
        phone: '0987 654 321',
        email: 'tranthib@example.com'
      }
    }
  ];

  const types = [
    { value: 'all', label: 'Tất cả loại khám' },
    { value: 'first-test', label: 'Xét nghiệm lần đầu' },
    { value: 'pre-test-counseling', label: 'Tư vấn trước xét nghiệm' },
    { value: 'post-test-counseling', label: 'Tư vấn sau xét nghiệm' },
    { value: 'regular-checkup', label: 'Khám định kỳ' },
    { value: 'arv-consultation', label: 'Tư vấn điều trị ARV' }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'first-test':
        return 'bg-purple-100 text-purple-800';
      case 'pre-test-counseling':
        return 'bg-blue-100 text-blue-800';
      case 'post-test-counseling':
        return 'bg-green-100 text-green-800';
      case 'regular-checkup':
        return 'bg-yellow-100 text-yellow-800';
      case 'arv-consultation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'first-test':
        return 'Xét nghiệm lần đầu';
      case 'pre-test-counseling':
        return 'Tư vấn trước xét nghiệm';
      case 'post-test-counseling':
        return 'Tư vấn sau xét nghiệm';
      case 'regular-checkup':
        return 'Khám định kỳ';
      case 'arv-consultation':
        return 'Tư vấn điều trị ARV';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || appointment.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesDate = appointment.date === selectedDate;
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi lịch hẹn khám bệnh HIV
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại khám
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiền sử & Điều trị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kết quả xét nghiệm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {appointment.patientId}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Phone className="inline w-4 h-4 mr-1" />
                            {appointment.contactInfo.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                        {getTypeText(appointment.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {appointment.hivTestHistory.previousTest ? (
                          <>
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              Đã xét nghiệm: {appointment.hivTestHistory.lastTestDate}
                            </div>
                            {appointment.arvTreatment?.isOnTreatment && (
                              <>
                                <div className="flex items-center mt-1">
                                  <Pill className="w-4 h-4 mr-1" />
                                  ARV: {appointment.arvTreatment.currentProtocol}
                                </div>
                                <div className="flex items-center mt-1">
                                  <Activity className="w-4 h-4 mr-1" />
                                  Tuân thủ: {appointment.arvTreatment.adherence}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            Chưa xét nghiệm
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {appointment.testResults && (
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-1" />
                            VL: {appointment.testResults.viralLoad}
                          </div>
                          <div className="flex items-center mt-1">
                            <Heart className="w-4 h-4 mr-1" />
                            CD4: {appointment.testResults.cd4Count}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {appointment.testResults.date}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
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

export default AppointmentManagement;