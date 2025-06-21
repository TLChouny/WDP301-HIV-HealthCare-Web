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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const StaffAppointmentManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Add new state for managing appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load appointments data
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/bookings');
        const data = await response.json();
        // Nếu backend trả về _id, map sang id
        const mapped = data;
        setAppointments(mapped);
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

  // Function to handle appointment status change (gọi API PATCH)
  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Cập nhật trạng thái thất bại');
      const updated = await response.json();
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      toast.success('Cập nhật trạng thái thành công!');
    } catch (err) {
      console.error('Error updating appointment status:', err);
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      (appointment.customerName && appointment.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (appointment.customerPhone && appointment.customerPhone.includes(search)) ||
      (appointment.customerEmail && appointment.customerEmail.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = appointment.bookingDate && new Date(appointment.bookingDate).toISOString().split('T')[0] === selectedDate;
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
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
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {appointment.customerName}
                          {appointment.isAnonymous && (
                            <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full font-semibold">Ẩn danh</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="inline w-4 h-4 mr-1" />
                          {appointment.customerPhone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="inline w-4 h-4 mr-1" />
                          {appointment.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appointment.bookingCode}</div>
                        <div className="text-sm text-gray-500">
                          {appointment.bookingDate ? new Date(appointment.bookingDate).toLocaleDateString('vi-VN') : ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-700">{appointment.serviceId?.serviceName}</div>
                        <div className="text-xs text-gray-500">{appointment.serviceId?.serviceDescription}</div>
                        <div className="text-xs text-gray-400">Bác sĩ: {appointment.doctorName || appointment.serviceId?.doctorName}</div>
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