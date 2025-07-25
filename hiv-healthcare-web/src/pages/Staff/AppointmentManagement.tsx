import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Booking } from '../../types/booking';
import { useBooking } from '../../context/BookingContext';
import { translateBookingStatus } from '../../utils/status'; // Điều chỉnh đường dẫn nếu cần

// Hàm so sánh ngày theo local
const isSameDayLocal = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Hàm parse ngày
const parseBookingDateLocal = (dateStr: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    const [datePart] = dateStr.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
};

// Component hiển thị trạng thái
const StatusButton: React.FC<{
  status: string;
  bookingId?: string;
  onStatusChange: (bookingId: string, newStatus: 'checked-in') => void;
}> = ({ status, bookingId, onStatusChange }) => {
  if (!bookingId) {
    return (
      <span
        className="w-full inline-block px-5 py-2 rounded-full shadow font-bold text-center cursor-default bg-gray-100 text-gray-800 border-2 border-gray-300"
        style={{ minWidth: 150 }}
      >
        Lỗi: Không có ID
      </span>
    );
  }
  if (status === 'pending' || status === 'checked-out') {
    return (
      <button
        onClick={() => onStatusChange(bookingId, 'checked-in')}
        className="w-full px-5 py-2 rounded-full shadow font-bold bg-yellow-100 text-yellow-800 border-2 border-yellow-300 hover:bg-yellow-200 hover:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-150 text-center cursor-pointer"
        style={{ minWidth: 150 }}
      >
        Điểm danh
      </button>
    );
  }
  const statusStyles: { [key: string]: string } = {
    'checked-in': 'bg-green-100 text-green-800 border-2 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-2 border-red-300',
    completed: 'bg-purple-100 text-purple-800 border-2 border-purple-300',
  };
  return (
    <span
      className={`w-full inline-block px-5 py-2 rounded-full shadow font-bold text-center cursor-default ${
        statusStyles[status] || 'bg-gray-100 text-gray-800 border-2 border-gray-300'
      }`}
      style={{ minWidth: 150 }}
    >
      {translateBookingStatus(status)}
    </span>
  );
};

const StaffAppointmentManagement: React.FC = () => {
  const { getAll, update } = useBooking();
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized helper functions
  const anonymizeName = useCallback((name: string): string => {
    if (!name) return 'Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return (
      words[0].charAt(0) +
      '*'.repeat(words[0].length - 1) +
      ' ' +
      words[words.length - 1].charAt(0) +
      '*'.repeat(words[words.length - 1].length - 1)
    );
  }, []);

  const getPatientDisplayInfo = useCallback(
    (booking: Booking) => {
      const isAnonymous = booking.isAnonymous;
      if (isAnonymous) {
        return {
          name: anonymizeName(booking.customerName || ''),
          phone: '***-***-****',
          email: '***@***.***',
          doctorName: booking.doctorName || '',
        };
      }
      return {
        name: booking.customerName || 'Không xác định',
        phone: booking.customerPhone || 'Không có',
        email: booking.customerEmail || 'Không có',
        doctorName: booking.doctorName || 'Chưa phân công',
      };
    },
    [anonymizeName]
  );

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll();
        setBookings(data || []);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu lịch hẹn');
        toast.error(err.message || 'Không thể tải dữ liệu lịch hẹn');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [getAll]);

  // Handle status change
  const handleStatusChange = useCallback(
    async (bookingId: string, newStatus: 'checked-in') => {
      try {
        await update(bookingId, { status: newStatus });
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        toast.success('Cập nhật trạng thái thành công!');
      } catch (err: any) {
        toast.error(err.message || 'Cập nhật trạng thái thất bại');
      }
    },
    [update]
  );

  // Memoized booking dates
  const bookingDates = useMemo(
    () => bookings.map((b) => parseBookingDateLocal(b.bookingDate)),
    [bookings]
  );

  // Memoized filtered and sorted bookings
  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesSearch =
          (booking.customerName &&
            booking.customerName.toLowerCase().includes(search.toLowerCase())) ||
          (booking.customerPhone && booking.customerPhone.includes(search)) ||
          (booking.customerEmail &&
            booking.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
          (booking.bookingCode &&
            booking.bookingCode.toLowerCase().includes(search.toLowerCase()));
        const matchesDate =
          !selectedDate ||
          (booking.bookingDate &&
            isSameDayLocal(parseBookingDateLocal(booking.bookingDate), selectedDate));
        const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
        return matchesSearch && matchesDate && matchesStatus;
      }),
    [bookings, search, selectedDate, selectedStatus]
  );

  const sortedBookings = useMemo(
    () =>
      [...filteredBookings].sort((a, b) => {
        const dateA = new Date(a.bookingDate);
        const dateB = new Date(b.bookingDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return (a.startTime || '').localeCompare(b.startTime || '');
      }),
    [filteredBookings]
  );

  // Handle calendar change
  const handleCalendarChange = useCallback(
    (value: Date | null, _event: React.MouseEvent<HTMLButtonElement>) => {
      if (value instanceof Date) {
        setCalendarDate(value);
        setSelectedDate(value);
      } else if (value === null) {
        setCalendarDate(null);
        setSelectedDate(null);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Quản lý Lịch hẹn */}
          <div className="flex-1 order-2 md:order-1">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
              <p className="mt-2 text-sm text-gray-600">
                Quản lý và theo dõi lịch hẹn khám HIV. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
              </p>
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
                    value={
                      selectedDate
                        ? `${selectedDate.getFullYear()}-${String(
                            selectedDate.getMonth() + 1
                          ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
                        : ''
                    }
                    onChange={(e) => {
                      if (!e.target.value) {
                        setSelectedDate(null);
                        setCalendarDate(null);
                      } else {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        setSelectedDate(date);
                        setCalendarDate(date);
                      }
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
                    <option value="cancelled">Đã hủy</option>
                    <option value="completed">Hoàn thành</option>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thanh toán
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedBookings.map((booking) => {
                        const patientInfo = getPatientDisplayInfo(booking);
                        return (
                          <tr key={booking._id || Math.random()} className="hover:bg-gray-50">
                            <td className=" synchrony py-4">
                              <div className="font-semibold text-blue-600">
                                {booking.bookingCode || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{patientInfo.name}</span>
                                  {booking.isAnonymous && (
                                    <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">
                                      Ẩn danh
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{patientInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{patientInfo.email}</span>
                                </div>
                                <div className="mt-2">
                                  <span>Bác sĩ: {patientInfo.doctorName}</span>
                                </div>
                                <div className="mt-1">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      booking.status === 'checked-in'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : booking.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : booking.status === 'completed'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {booking.status === 'checked-in' && (
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                    )}
                                    {booking.status === 'pending' && (
                                      <Clock className="w-3 h-3 mr-1" />
                                    )}
                                    {booking.status === 'cancelled' && (
                                      <XCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {booking.status === 'completed' && (
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                    )}
                                    {translateBookingStatus(booking.status || 'unknown')}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {booking.bookingDate
                                  ? parseBookingDateLocal(booking.bookingDate).toLocaleDateString(
                                      'vi-VN'
                                    )
                                  : 'N/A'}
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
                                Giá:{' '}
                                {booking.serviceId?.price
                                  ? Number(booking.serviceId.price).toLocaleString('vi-VN') + ' ₫'
                                  : 'Chưa cập nhật'}
                              </div>
                            </td>
                            <td className="px-6 py-4">{patientInfo.doctorName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <StatusButton
                                status={booking.status || 'unknown'}
                                bookingId={booking._id}
                                onStatusChange={handleStatusChange}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {booking.serviceId && booking.serviceId.price ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Đã thanh toán
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Chưa cập nhật
                                </span>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                {booking.serviceId && booking.serviceId.price
                                  ? `Tổng: ${Number(booking.serviceId.price).toLocaleString('vi-VN')} ₫`
                                  : ''}
                              </div>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
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
          <div className="order-1 md:order-2 mb-8 md:mb-0 flex justify-center">
            <div>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setCalendarDate(value);
                    setSelectedDate(value);
                  } else if (value === null) {
                    setCalendarDate(null);
                    setSelectedDate(null);
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