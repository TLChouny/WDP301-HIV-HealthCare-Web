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
  ChevronRight,
  FileText,
  Shield,
  CreditCard,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  date: string;
  time: string;
  type: 'first-test' | 'pre-test-counseling' | 'post-test-counseling' | 'regular-checkup' | 'arv-consultation';
  doctor: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  insurance: {
    hasInsurance: boolean;
    insuranceNumber?: string;
    insuranceType?: string;
  };
  counseling: {
    preTestDone: boolean;
    postTestDone: boolean;
    counselor?: string;
  };
  testType?: {
    rapid: boolean;
    elisa: boolean;
    pcr: boolean;
  };
  notes?: string;
  specialRequirements?: string;
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
      type: 'first-test',
      doctor: 'BS. Trần Thị B',
      status: 'confirmed',
      insurance: {
        hasInsurance: true,
        insuranceNumber: 'BH123456',
        insuranceType: 'Bảo hiểm y tế'
      },
      counseling: {
        preTestDone: true,
        postTestDone: false,
        counselor: 'TV. Lê Văn C'
      },
      testType: {
        rapid: true,
        elisa: false,
        pcr: false
      },
      notes: 'Bệnh nhân đến xét nghiệm lần đầu',
      specialRequirements: 'Cần phiên dịch tiếng Anh'
    },
    {
      id: '2',
      patientName: 'Trần Thị C',
      patientPhone: '0987 654 321',
      patientEmail: 'tranthic@example.com',
      patientAddress: '456 Đường XYZ, Quận 2, TP.HCM',
      date: '2024-03-20',
      time: '10:30',
      type: 'arv-consultation',
      doctor: 'BS. Lê Văn D',
      status: 'pending',
      insurance: {
        hasInsurance: true,
        insuranceNumber: 'BH789012',
        insuranceType: 'Bảo hiểm y tế'
      },
      counseling: {
        preTestDone: true,
        postTestDone: true,
        counselor: 'TV. Nguyễn Thị E'
      },
      notes: 'Tư vấn về phác đồ điều trị ARV mới'
    },
    {
      id: '3',
      patientName: 'Lê Văn E',
      patientPhone: '0912 345 678',
      patientEmail: 'levane@example.com',
      patientAddress: '789 Đường DEF, Quận 3, TP.HCM',
      date: '2024-03-20',
      time: '14:00',
      type: 'regular-checkup',
      doctor: 'BS. Phạm Thị F',
      status: 'confirmed',
      insurance: {
        hasInsurance: false
      },
      counseling: {
        preTestDone: false,
        postTestDone: false
      },
      testType: {
        rapid: false,
        elisa: true,
        pcr: false
      },
      notes: 'Khám định kỳ 3 tháng'
    },
    {
      id: '4',
      patientName: 'Phạm Thị G',
      patientPhone: '0934 567 890',
      patientEmail: 'phamthig@example.com',
      patientAddress: '321 Đường GHI, Quận 4, TP.HCM',
      date: '2024-03-20',
      time: '15:30',
      type: 'pre-test-counseling',
      doctor: 'BS. Nguyễn Văn H',
      status: 'pending',
      insurance: {
        hasInsurance: true,
        insuranceNumber: 'BH345678',
        insuranceType: 'Bảo hiểm y tế'
      },
      counseling: {
        preTestDone: false,
        postTestDone: false,
        counselor: 'TV. Trần Văn I'
      },
      notes: 'Tư vấn trước khi xét nghiệm',
      specialRequirements: 'Cần tư vấn riêng'
    },
    {
      id: '5',
      patientName: 'Hoàng Văn K',
      patientPhone: '0945 678 901',
      patientEmail: 'hoangvank@example.com',
      patientAddress: '654 Đường JKL, Quận 5, TP.HCM',
      date: '2024-03-20',
      time: '16:00',
      type: 'post-test-counseling',
      doctor: 'BS. Lê Thị L',
      status: 'confirmed',
      insurance: {
        hasInsurance: true,
        insuranceNumber: 'BH901234',
        insuranceType: 'Bảo hiểm y tế'
      },
      counseling: {
        preTestDone: true,
        postTestDone: false,
        counselor: 'TV. Phạm Văn M'
      },
      testType: {
        rapid: true,
        elisa: true,
        pcr: false
      },
      notes: 'Tư vấn sau khi có kết quả xét nghiệm',
      specialRequirements: 'Cần hỗ trợ tâm lý'
    },
    {
      id: '6',
      patientName: 'Vũ Thị N',
      patientPhone: '0956 789 012',
      patientEmail: 'vuthin@example.com',
      patientAddress: '987 Đường MNO, Quận 6, TP.HCM',
      date: '2024-03-21',
      time: '09:00',
      type: 'first-test',
      doctor: 'BS. Trần Văn O',
      status: 'cancelled',
      insurance: {
        hasInsurance: false
      },
      counseling: {
        preTestDone: false,
        postTestDone: false
      },
      notes: 'Bệnh nhân hủy lịch do bận việc đột xuất'
    },
    {
      id: '7',
      patientName: 'Đỗ Văn P',
      patientPhone: '0967 890 123',
      patientEmail: 'dovanp@example.com',
      patientAddress: '147 Đường PQR, Quận 7, TP.HCM',
      date: '2024-03-21',
      time: '10:30',
      type: 'arv-consultation',
      doctor: 'BS. Nguyễn Thị Q',
      status: 'confirmed',
      insurance: {
        hasInsurance: true,
        insuranceNumber: 'BH567890',
        insuranceType: 'Bảo hiểm y tế'
      },
      counseling: {
        preTestDone: true,
        postTestDone: true,
        counselor: 'TV. Lê Văn R'
      },
      notes: 'Tư vấn về tác dụng phụ của thuốc ARV'
    },
    {
      id: '8',
      patientName: 'Bùi Thị S',
      patientPhone: '0978 901 234',
      patientEmail: 'buithis@example.com',
      patientAddress: '258 Đường STU, Quận 8, TP.HCM',
      date: '2024-03-21',
      time: '14:00',
      type: 'regular-checkup',
      doctor: 'BS. Phạm Văn T',
      status: 'pending',
      insurance: {
        hasInsurance: true,
        insuranceNumber: 'BH234567',
        insuranceType: 'Bảo hiểm y tế'
      },
      counseling: {
        preTestDone: true,
        postTestDone: false,
        counselor: 'TV. Trần Thị U'
      },
      testType: {
        rapid: false,
        elisa: true,
        pcr: true
      },
      notes: 'Khám định kỳ và xét nghiệm tải lượng virus'
    }
  ];

  const appointmentTypes = [
    { value: 'all', label: 'Tất cả loại khám' },
    { value: 'first-test', label: 'Xét nghiệm lần đầu' },
    { value: 'pre-test-counseling', label: 'Tư vấn trước xét nghiệm' },
    { value: 'post-test-counseling', label: 'Tư vấn sau xét nghiệm' },
    { value: 'regular-checkup', label: 'Khám định kỳ' },
    { value: 'arv-consultation', label: 'Tư vấn điều trị ARV' }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'pending', label: 'Chờ xác nhận' },
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
            Quản lý và theo dõi lịch hẹn khám HIV
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
                    Bảo hiểm & Tư vấn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xét nghiệm
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
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Phone className="inline w-4 h-4 mr-1" />
                        {appointment.patientPhone}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Mail className="inline w-4 h-4 mr-1" />
                        {appointment.patientEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        {appointment.patientAddress}
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
                      <div className="text-sm text-gray-500 mt-1">
                        BS: {appointment.doctor}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {appointment.insurance.hasInsurance ? (
                            <>
                              {appointment.insurance.insuranceType}
                              <span className="text-xs text-gray-500 ml-1">
                                ({appointment.insurance.insuranceNumber})
                              </span>
                            </>
                          ) : (
                            'Không có bảo hiểm'
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Tư vấn: {appointment.counseling.preTestDone ? '✓' : '✗'} Trước / {appointment.counseling.postTestDone ? '✓' : '✗'} Sau
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {appointment.testType && (
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {appointment.testType.rapid && 'Rapid Test'}
                          </div>
                          <div className="flex items-center mt-1">
                            <FileText className="w-4 h-4 mr-1" />
                            {appointment.testType.elisa && 'ELISA'}
                          </div>
                          <div className="flex items-center mt-1">
                            <FileText className="w-4 h-4 mr-1" />
                            {appointment.testType.pcr && 'PCR'}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusInfo(appointment.status).color}`}>
                        {getStatusInfo(appointment.status).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

export default StaffAppointmentManagement; 