import React, { useState, useEffect } from 'react';
import { 
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
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Định nghĩa type cho value của Calendar
// eslint-disable-next-line @typescript-eslint/no-type-alias
type CalendarValue = Date | Date[] | null;

interface Appointment {
  _id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: {
    _id: string;
    serviceName: string;
    serviceDescription: string;
    categoryId: string;
    serviceImage: string;
    timeSlot: string;
    duration: number;
    doctorName: string;
    __v: number;
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  notes?: string;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  isAnonymous: boolean;
  userId: string | null;
  updatedAt: string;
  __v: number;
}

// Hàm so sánh ngày theo local
function isSameDayLocal(date1: string | Date, date2: string | Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const StaffAppointmentManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showPatientInfo, setShowPatientInfo] = useState<boolean>(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Add new state for managing appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách các ngày có lịch hẹn (dạng Date)
  const appointmentDates = appointments.map(a => new Date(a.bookingDate));

  // Hàm ẩn danh tên bệnh nhân
  const anonymizeName = (name: string): string => {
    if (!name) return 'Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return words[0].charAt(0) + '*'.repeat(words[0].length - 1) + ' ' + 
           words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1);
  };

  // Hàm ẩn danh tên bác sĩ
  const anonymizeDoctorName = (name: string): string => {
    if (!name) return 'BS. Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return 'BS. ' + words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return 'BS. ' + words[0].charAt(0) + '*'.repeat(words[0].length - 1) + ' ' + 
           words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1);
  };

  // Hàm hiển thị thông tin bệnh nhân
  const getPatientDisplayInfo = (appointment: Appointment) => {
    const isAnonymous = appointment.isAnonymous;
    
    if (isAnonymous) {
      // Nếu là booking ẩn danh, luôn ẩn thông tin
      return {
        name: anonymizeName(appointment.customerName || ''),
        phone: '***-***-****',
        email: '***@***.***',
        doctorName: anonymizeDoctorName(appointment.doctorName || '')
      };
    } else {
      // Nếu không phải ẩn danh, hiển thị theo toggle
      if (showPatientInfo) {
        return {
          name: appointment.customerName || 'Không xác định',
          phone: appointment.customerPhone || 'Không có',
          email: appointment.customerEmail || 'Không có',
          doctorName: appointment.doctorName || 'Chưa phân công'
        };
      } else {
        return {
          name: anonymizeName(appointment.customerName || ''),
          phone: '***-***-****',
          email: '***@***.***',
          doctorName: anonymizeDoctorName(appointment.doctorName || '')
        };
      }
    }
  };

  // Load appointments data
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching appointments from API...');
        
        const response = await fetch('http://localhost:5000/api/bookings');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('API Error:', errorData);
          throw new Error(`Không thể tải dữ liệu lịch hẹn: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Data received:', data);
        
        setAppointments(data);
      } catch (err: any) {
        console.error('Error loading appointments:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  // Function to handle appointment status change (gọi API PATCH)
  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      console.log('Updating status for appointment:', appointmentId);
      console.log('New status:', newStatus);
      
      const response = await fetch(`http://localhost:5000/api/bookings/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update error:', errorData);
        throw new Error(`Cập nhật trạng thái thất bại: ${response.status} ${response.statusText}`);
      }

      const updated = await response.json();
      console.log('Updated appointment:', updated);

      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      toast.success('Cập nhật trạng thái thành công!');
    } catch (err: any) {
      console.error('Error updating appointment status:', err);
      toast.error(err.message);
    }
  };

  // Lọc lịch hẹn theo ngày được chọn trên calendar
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      (appointment.customerName && appointment.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (appointment.customerPhone && appointment.customerPhone.includes(search)) ||
      (appointment.customerEmail && appointment.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
      (appointment.bookingCode && appointment.bookingCode.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = appointment.bookingDate && isSameDayLocal(appointment.bookingDate, selectedDate);
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Calendar ở đầu trang */}
        <div className="mb-8 flex flex-col items-center">
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setCalendarDate(value);
                setSelectedDate(value);
              }
            }}
            value={calendarDate}
            tileContent={({ date, view }) => {
              // Đánh dấu chấm cho ngày có lịch hẹn (so sánh local)
              if (view === 'month' && appointmentDates.some(d => isSameDayLocal(d, date))) {
                return <div className="flex justify-center"><span className="block w-2 h-2 bg-blue-500 rounded-full mt-1"></span></div>;
              }
              return null;
            }}
            locale="vi-VN"
          />
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
              <p className="mt-2 text-sm text-gray-600">
                Quản lý và theo dõi lịch hẹn khám HIV. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
              </p>
            </div>
            <button
              onClick={() => setShowPatientInfo(!showPatientInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showPatientInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPatientInfo ? 'Ẩn thông tin' : 'Hiện thông tin'}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã lịch hẹn..."
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
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  // Chuyển yyyy-mm-dd thành Date local
                  const [year, month, day] = e.target.value.split('-').map(Number);
                  setSelectedDate(new Date(year, month , day));
                  setCalendarDate(new Date(year, month , day));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu lịch hẹn...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">Lỗi tải dữ liệu</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Thử lại
              </button>
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
                      Mã lịch hẹn & Thông tin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại khám
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
                  {filteredAppointments.map((appointment) => {
                    const patientInfo = getPatientDisplayInfo(appointment);
                    return (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-blue-600">{appointment.bookingCode || 'N/A'}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Bệnh nhân: {patientInfo.name}</span>
                              {appointment.isAnonymous && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">Ẩn danh</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>SĐT: {patientInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Mail className="w-3 h-3" />
                              <span>Email: {patientInfo.email}</span>
                            </div>
                            <div className="mt-2">
                              <span>Bác sĩ: {patientInfo.doctorName}</span>
                            </div>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {appointment.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {appointment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                {appointment.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                                {appointment.status === 'confirmed' ? 'Đã xác nhận' :
                                 appointment.status === 'pending' ? 'Chờ xác nhận' :
                                 appointment.status === 'cancelled' ? 'Đã hủy' :
                                 appointment.status}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {appointment.bookingDate ? new Date(appointment.bookingDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.startTime || 'N/A'} - {appointment.endTime || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-blue-700">
                            {appointment.serviceId?.serviceName || 'Không xác định'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.serviceId?.serviceDescription || 'Không có mô tả'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status === 'confirmed'
                              ? 'Đã xác nhận'
                              : appointment.status === 'pending'
                              ? 'Chờ xác nhận'
                              : 'Đã hủy'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment._id, e.target.value as 'confirmed' | 'pending' | 'cancelled')}
                            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="text-center p-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Không tìm thấy lịch hẹn nào</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có lịch hẹn nào được tạo'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAppointmentManagement; 