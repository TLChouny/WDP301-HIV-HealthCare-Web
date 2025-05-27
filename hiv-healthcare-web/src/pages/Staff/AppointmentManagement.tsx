import React, { useState } from 'react';
import { 
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

const StaffAppointmentManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      patientPhone: '0123 456 789',
      patientEmail: 'nguyenvana@example.com',
      patientAddress: '123 Đường ABC, Quận 1, TP.HCM',
      date: '2024-03-20',
      time: '09:00',
      type: 'Khám định kỳ',
      doctor: 'BS. Trần Thị B',
      status: 'confirmed',
      notes: 'Bệnh nhân cần xét nghiệm máu trước khi khám'
    },
    {
      id: '2',
      patientName: 'Trần Thị C',
      patientPhone: '0987 654 321',
      patientEmail: 'tranthic@example.com',
      patientAddress: '456 Đường XYZ, Quận 2, TP.HCM',
      date: '2024-03-20',
      time: '10:30',
      type: 'Tư vấn',
      doctor: 'BS. Lê Văn D',
      status: 'pending',
      notes: 'Bệnh nhân yêu cầu tư vấn về chế độ dinh dưỡng'
    },
    {
      id: '3',
      patientName: 'Lê Văn E',
      patientPhone: '0912 345 678',
      patientEmail: 'levane@example.com',
      patientAddress: '789 Đường DEF, Quận 3, TP.HCM',
      date: '2024-03-20',
      time: '14:00',
      type: 'Khám mới',
      doctor: 'BS. Phạm Thị F',
      status: 'cancelled',
      notes: 'Bệnh nhân hủy lịch do bận việc đột xuất'
    }
  ];

  const appointmentTypes = [
    { value: 'all', label: 'Tất cả loại khám' },
    { value: 'Khám định kỳ', label: 'Khám định kỳ' },
    { value: 'Khám mới', label: 'Khám mới' },
    { value: 'Tư vấn', label: 'Tư vấn' },
    { value: 'Xét nghiệm', label: 'Xét nghiệm' }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: 'Đã xác nhận',
          color: 'bg-green-100 text-green-800'
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          text: 'Chờ xác nhận',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: 'Đã hủy',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: null,
          text: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.patientPhone.includes(search) ||
      appointment.patientEmail.toLowerCase().includes(search.toLowerCase());
    const matchesDate = appointment.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesType = selectedType === 'all' || appointment.type === selectedType;
    return matchesSearch && matchesDate && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi lịch hẹn của bệnh nhân
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
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {appointmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Thêm lịch hẹn</span>
            </button>
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
                    Bác sĩ
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
                {filteredAppointments.map((appointment) => {
                  const status = getStatusInfo(appointment.status);
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patientName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{appointment.patientEmail}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.patientAddress}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.doctor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          <div className="flex items-center space-x-1">
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Xác nhận
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Hủy
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAppointmentManagement; 