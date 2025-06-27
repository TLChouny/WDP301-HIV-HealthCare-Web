import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Booking } from '../../types/booking';
import { useBooking } from '../../context/BookingContext';

function isSameDayLocal(date1: string | Date, date2: string | Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const AppointmentManagement: React.FC = () => {
  const { getAll, update } = useBooking();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingDates = bookings.map(b => new Date(b.bookingDate));

  const anonymizeName = (name: string): string => {
    if (!name) return 'Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return (
      words[0].charAt(0) + '*'.repeat(words[0].length - 1) + ' ' +
      words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1)
    );
  };

  const getPatientDisplayInfo = (booking: Booking) => {
    if (booking.isAnonymous) {
      return {
        name: anonymizeName(booking.customerName || ''),
        phone: '***-***-****',
        email: '***@***.***',
      };
    } else {
      return {
        name: booking.customerName || 'Không xác định',
        phone: booking.customerPhone || 'Không có',
        email: booking.customerEmail || 'Không có',
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAll();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu');
        toast.error(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    try {
      await update(id, { status: newStatus });
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: newStatus } : b)));
      toast.success('Cập nhật thành công!');
    } catch (err: any) {
      toast.error(err.message || 'Cập nhật thất bại');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchSearch =
      booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerPhone?.includes(search) ||
      booking.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      booking.bookingCode?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !selectedDate || isSameDayLocal(booking.bookingDate, selectedDate);
    const matchStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchSearch && matchDate && matchStatus;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) =>
    new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* LEFT - LIST */}
        <div className="flex-1 order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
            <p className="text-sm text-gray-600 mt-2">Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Mã & Thông tin</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Thời gian</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Loại khám</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-500">Trạng thái</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Meeting</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBookings.map(booking => {
                    const info = getPatientDisplayInfo(booking);
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-blue-600">{booking.bookingCode || 'N/A'}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            <div className="flex items-center gap-1"><User className="w-3 h-3" />{info.name}</div>
                            <div className="flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{info.phone}</div>
                            <div className="flex items-center gap-1 mt-1"><Mail className="w-3 h-3" />{info.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</div>
                          <div className="text-gray-500 text-xs">{booking.startTime} - {booking.endTime}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-blue-700">{booking.serviceId?.serviceName || 'Không xác định'}</div>
                          <div className="text-xs text-gray-500">{booking.serviceId?.serviceDescription || 'Không có mô tả'}</div>
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          {booking.status === 'pending' && <span className="text-yellow-600">Chờ xác nhận</span>}
                          {booking.status === 'confirmed' && <span className="text-blue-600">Đã xác nhận</span>}
                          {booking.status === 'checked-in' && <span className="text-indigo-600">Đã xác nhận</span>}
                          {booking.status === 'completed' && <span className="text-green-600">Hoàn tất</span>}
                          {booking.status === 'cancelled' && <span className="text-red-600">Đã hủy</span>}
                          {!['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'].includes(booking.status) && (
                            <span className="text-gray-500">Không xác định</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {booking.meetLink ? (
                            <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tham gia</a>
                          ) : (
                            <span className="text-gray-400">Chưa có link</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {booking.status === 'completed' ? (
                            <CheckCircle2 className="text-green-500 w-5 h-5 mx-auto" />
                          ) : (
                            <button
                              onClick={() => handleStatusChange(booking._id!, 'completed')}
                              title="Đánh dấu hoàn tất"
                            >
                              <CheckCircle2 className="text-gray-400 hover:text-green-500 w-5 h-5 mx-auto" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT - CALENDAR */}
        <div className="w-full md:w-72 order-1 md:order-2">
          <div className="bg-white rounded-lg shadow p-2 scale-90">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setCalendarDate(value);
                  setSelectedDate(value);
                } else {
                  setCalendarDate(null);
                  setSelectedDate(null);
                }
              }}
              value={calendarDate}
              className="text-xs [&_.react-calendar__tile]:py-1 [&_.react-calendar__tile]:text-[11px] [&_.react-calendar__month-view__weekdays]:text-[10px]"
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
  );
};

export default AppointmentManagement;
