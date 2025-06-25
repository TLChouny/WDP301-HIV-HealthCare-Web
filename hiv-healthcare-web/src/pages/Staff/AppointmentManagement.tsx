import React, { useState, useEffect } from 'react';
import { 
  Search,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Booking } from '../../types/booking';
import { useBooking } from '../../context/BookingContext';
import { ToastContainer } from 'react-toastify';

// Định nghĩa type cho value của Calendar
type CalendarValue = Date | Date[] | null;

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
  const { getAll, update } = useBooking();
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // State cho danh sách bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách các ngày có lịch hẹn (dạng Date)
  const bookingDates = bookings.map(b => new Date(b.bookingDate));

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

  // Hàm hiển thị thông tin bệnh nhân
  const getPatientDisplayInfo = (booking: Booking) => {
    const isAnonymous = booking.isAnonymous;
    if (isAnonymous) {
      return {
        name: anonymizeName(booking.customerName || ''),
        phone: '***-***-****',
        email: '***@***.***',
        doctorName: (booking.doctorName || '')
      };
    } else {
      return {
        name: booking.customerName || 'Không xác định',
        phone: booking.customerPhone || 'Không có',
        email: booking.customerEmail || 'Không có',
        doctorName: booking.doctorName || 'Chưa phân công'
      };
    }
  };

  // Load bookings data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching bookings from API...');
        
        const data = await getAll();
        console.log('API Data received:', data);
        
        setBookings(data);
      } catch (err: any) {
        console.error('Error loading bookings:', err);
        setError(err.message || 'Không thể tải dữ liệu lịch hẹn');
        toast.error(err.message || 'Không thể tải dữ liệu lịch hẹn');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [getAll]);

  // Function to handle booking status change
  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'completed') => {
    try {
      console.log('Updating status for booking:', bookingId);
      console.log('New status:', newStatus);
      
      const updatedBooking = await update(bookingId, { status: newStatus });
      console.log('Updated booking:', updatedBooking);

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      toast.success('Cập nhật trạng thái thành công!');
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      toast.error(err.message || 'Cập nhật trạng thái thất bại');
    }
  };

  // Lọc lịch hẹn theo ngày được chọn trên calendar
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      (booking.customerName && booking.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (booking.customerPhone && booking.customerPhone.includes(search)) ||
      (booking.customerEmail && booking.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
      (booking.bookingCode && booking.bookingCode.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = booking.bookingDate && isSameDayLocal(booking.bookingDate, selectedDate);
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Sắp xếp lịch hẹn theo ngày và giờ
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.bookingDate);
    const dateB = new Date(b.bookingDate);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    const timeA = a.startTime || '';
    const timeB = b.startTime || '';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Quản lý Lịch hẹn */}
          <div className="flex-1 order-2 md:order-1">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Quản lý và theo dõi lịch hẹn khám HIV. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
                  </p>
                </div>
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
                      const [year, month, day] = e.target.value.split('-').map(Number);
                      setSelectedDate(new Date(year, month - 1, day));
                      setCalendarDate(new Date(year, month - 1, day));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="checked-in">Đã xác nhận</option>
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

            {/* Bookings List */}
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
                          Bác sĩ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedBookings.map((booking) => {
                        const patientInfo = getPatientDisplayInfo(booking);
                        console.log('Booking status:', booking.status, 'ID:', booking._id);
                        return (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-blue-600">{booking.bookingCode || 'N/A'}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>Bệnh nhân: {patientInfo.name}</span>
                                  {booking.isAnonymous && (
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
                                    booking.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {booking.status === 'checked-in' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                    {booking.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                    {booking.status === 'checked-in' ? 'Đã xác nhận' :
                                     booking.status === 'pending' ? 'Chờ xác nhận' :
                                     booking.status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-blue-700">
                                {booking.serviceId?.serviceName || 'Không xác định'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.serviceId?.serviceDescription || 'Không có mô tả'}
                              </div>
                              <div className="text-xs text-green-700 font-bold mt-1">
                                Giá: {booking.serviceId?.price ? Number(booking.serviceId.price).toLocaleString('vi-VN') + ' ₫' : 'Chưa cập nhật'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {patientInfo.doctorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {booking.status === 'pending' ? (
                                <button
                                  onClick={() => handleStatusChange(booking._id!, 'checked-in')}
                                  className="w-full px-5 py-2 rounded-full shadow font-bold bg-yellow-100 text-yellow-800 border-2 border-yellow-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-150 text-center cursor-pointer hover:bg-yellow-200 hover:border-yellow-400"
                                  style={{ minWidth: 150 }}
                                >
                                  Chờ xác nhận
                                </button>
                              ) : booking.status === 'checked-in' ? (
                                <span className="w-full inline-block px-5 py-2 rounded-full shadow font-bold bg-green-100 text-green-800 border-2 border-green-300 text-center cursor-default" style={{ minWidth: 150 }}>
                                  Đã xác nhận
                                </span>
                              ) : null}
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
            {!loading && !error && sortedBookings.length === 0 && (
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

          {/* Right: Calendar */}
          <div className="w-full md:w-80 order-1 md:order-2 mb-8 md:mb-0 flex justify-center">
            <div className="bg-white rounded-lg shadow p-4 w-full">
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setCalendarDate(value);
                    setSelectedDate(value);
                  }
                }}
                value={calendarDate}
                tileContent={({ date, view }) => {
                  if (view === 'month' && bookingDates.some(d => isSameDayLocal(d, date))) {
                    return <div className="flex justify-center"><span className="block w-2 h-2 bg-blue-500 rounded-full mt-1"></span></div>;
                  }
                  return null;
                }}
                locale="vi-VN"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAppointmentManagement;