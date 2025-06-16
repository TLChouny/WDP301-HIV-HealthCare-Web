import React, { useState, useEffect } from 'react';
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

  // Add new state for managing appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add new state for adding a new appointment
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAddress: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'first-test',
    doctor: '',
    status: 'pending',
    insurance: {
      hasInsurance: false
    },
    counseling: {
      preTestDone: false,
      postTestDone: false
    },
    testType: {
      rapid: false,
      elisa: false,
      pcr: false
    }
  });

  // Mock data for appointments
  const mockAppointments: Appointment[] = [
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

  // Mock data for doctors
  const doctors = [
    { id: '1', name: 'BS. Trần Thị B' },
    { id: '2', name: 'BS. Lê Văn D' },
    { id: '3', name: 'BS. Phạm Thị F' },
    { id: '4', name: 'BS. Nguyễn Văn H' }
  ];

  // Load appointments data
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        // const response = await fetch('/api/appointments');
        // const data = await response.json();
        
        // For now, we'll use mock data
        setAppointments(mockAppointments);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu lịch hẹn');
        console.error('Error loading appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Function to handle appointment status change
  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      // In a real application, this would be an API call
      // await fetch(`/api/appointments/${appointmentId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });

      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err) {
      console.error('Error updating appointment status:', err);
      // You could add a toast notification here
    }
  };

  // Function to handle appointment deletion
  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      try {
        // In a real application, this would be an API call
        // await fetch(`/api/appointments/${appointmentId}`, {
        //   method: 'DELETE'
        // });

        // Update local state
        setAppointments(prevAppointments =>
          prevAppointments.filter(appointment => appointment.id !== appointmentId)
        );
      } catch (err) {
        console.error('Error deleting appointment:', err);
        // You could add a toast notification here
      }
    }
  };

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

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('insurance.')) {
      const field = name.split('.')[1];
      setNewAppointment(prev => ({
        ...prev,
        insurance: {
          ...prev.insurance!,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else if (name.startsWith('testType.')) {
      const field = name.split('.')[1];
      setNewAppointment(prev => ({
        ...prev,
        testType: {
          ...prev.testType!,
          [field]: (e.target as HTMLInputElement).checked
        }
      }));
    } else {
      setNewAppointment(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/appointments', {
      //   method: 'POST',
      //   body: JSON.stringify(newAppointment)
      // });
      // const data = await response.json();

      // For now, we'll just add it to the local state
      const newAppointmentWithId = {
        ...newAppointment,
        id: `app-${Date.now()}`,
      } as Appointment;

      setAppointments(prev => [...prev, newAppointmentWithId]);
      setShowAddModal(false);
      
      // Reset form
      setNewAppointment({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        patientAddress: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'first-test',
        doctor: '',
        status: 'pending',
        insurance: {
          hasInsurance: false
        },
        counseling: {
          preTestDone: false,
          postTestDone: false
        },
        testType: {
          rapid: false,
          elisa: false,
          pcr: false
        }
      });
    } catch (err) {
      console.error('Error creating appointment:', err);
      // You could add a toast notification here
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
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm lịch hẹn</span>
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Add Appointment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thêm lịch hẹn mới
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên bệnh nhân
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={newAppointment.patientName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="patientPhone"
                      value={newAppointment.patientPhone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="patientEmail"
                      value={newAppointment.patientEmail}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="patientAddress"
                      value={newAppointment.patientAddress}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày hẹn
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newAppointment.date}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giờ hẹn
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={newAppointment.time}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại khám
                    </label>
                    <select
                      name="type"
                      value={newAppointment.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {appointmentTypes.filter(type => type.value !== 'all').map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bác sĩ
                    </label>
                    <select
                      name="doctor"
                      value={newAppointment.doctor}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="border-t pt-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="insurance.hasInsurance"
                      checked={newAppointment.insurance?.hasInsurance}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Có bảo hiểm y tế
                    </label>
                  </div>
                  {newAppointment.insurance?.hasInsurance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số bảo hiểm
                        </label>
                        <input
                          type="text"
                          name="insurance.insuranceNumber"
                          value={newAppointment.insurance?.insuranceNumber || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loại bảo hiểm
                        </label>
                        <input
                          type="text"
                          name="insurance.insuranceType"
                          value={newAppointment.insurance?.insuranceType || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Test Types */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Loại xét nghiệm</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="testType.rapid"
                        checked={newAppointment.testType?.rapid}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Rapid Test
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="testType.elisa"
                        checked={newAppointment.testType?.elisa}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        ELISA
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="testType.pcr"
                        checked={newAppointment.testType?.pcr}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        PCR
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={newAppointment.notes || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Tạo lịch hẹn
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!loading && !error && (
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
                    <tr key={appointment.id} className="hover:bg-gray-50">
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
                        <div className="flex items-center space-x-2">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value as 'confirmed' | 'pending' | 'cancelled')}
                            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                          <button 
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
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
        )}

        {/* Empty State */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Không có lịch hẹn nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Hãy thử thay đổi bộ lọc hoặc tạo lịch hẹn mới
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAppointmentManagement; 