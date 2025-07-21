import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react';
import { getBookingStatusColor, translateBookingStatus } from '../../utils/status';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Booking } from '../../types/booking';
import { useBooking } from '../../context/BookingContext';
import { useArv } from '../../context/ArvContext';
import { useResult } from '../../context/ResultContext';

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
  const [reExaminationDate, setReExaminationDate] = useState('');
  const { getAll, update } = useBooking();
  const { getAll: getAllArv } = useArv();
  const { addResult } = useResult();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMedicalModal, setOpenMedicalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [medicalDate, setMedicalDate] = useState('');
  const [medicalType, setMedicalType] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [arvRegimen, setArvRegimen] = useState('');
  const [hivLoad, setHivLoad] = useState('');
  const [medicationTime, setMedicationTime] = useState('');
  const [arvRegimens, setArvRegimens] = useState<{ _id: string; arvName: string; arvDescription?: string }[]>([]);
  // Trạng thái đã gửi hồ sơ bệnh án
  const [medicalRecordSent, setMedicalRecordSent] = useState<{ [bookingId: string]: boolean }>({});
  // Trạng thái chọn để gửi
  const [selectedStatusForSubmit, setSelectedStatusForSubmit] = useState<'re-examination' | 'completed' | null>(null);
  // Kiểm tra booking đã có kết quả chưa
  const { results } = useResult();
  const hasResult = selectedBooking && results.some(r => r.bookingId && r.bookingId._id === selectedBooking._id);

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

  // Lấy danh sách phác đồ ARV khi mở modal
  useEffect(() => {
    if (openMedicalModal) {
      getAllArv()
        .then((data) => {
          // Chỉ nhận các regimen có _id là string
          setArvRegimens(
            data.filter(r => typeof r._id === 'string')
              .map(r => ({
                _id: r._id as string,
                arvName: r.arvName,
                arvDescription: r.arvDescription
              }))
          );
        })
        .catch(() => setArvRegimens([]));
    }
  }, [openMedicalModal, getAllArv]);

  const handleCloseMedicalModal = () => {
    setOpenMedicalModal(false);
    setDiagnosis('');
    setArvRegimen('');
    setHivLoad('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full flex flex-row gap-8 justify-end">
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
                          <span
                            className={`bg-clip-text text-transparent bg-gradient-to-r ${getBookingStatusColor(booking.status)}`}
                          >
                            {translateBookingStatus(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.meetLink ? (
                            <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tham gia</a>
                          ) : (
                            <span className="text-gray-400">Chưa có link</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setMedicalDate(new Date(booking.bookingDate).toISOString().slice(0, 10)); // Lấy ngày từ booking
                                setMedicalType(booking.serviceId?.serviceName || ''); // Lấy loại khám từ booking
                                setOpenMedicalModal(true);
                              }}
                              title="Tạo hồ sơ bệnh án"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
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
        <div className="w-full md:w-72 order-1 md:order-2 md:self-start md:ml-auto">
          <div className="bg-white rounded-lg shadow p-4">
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
              className="[&_.react-calendar__tile]:py-2 [&_.react-calendar__tile]:text-[14px] [&_.react-calendar__month-view__weekdays]:text-[12px] text-sm"
              tileContent={({ date, view }) => {
                if (view === 'month' && bookingDates.some(d => isSameDayLocal(d, date))) {
                  return (
                    <div className="flex justify-center">
                      <span className="block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    </div>
                  );
                }
                return null;
              }}
              locale="vi-VN"
            />
          </div>
        </div>
      </div>

      {/* Modal tạo hồ sơ bệnh án */}
      {openMedicalModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Tạo hồ sơ bệnh án</h2>
            <p><span className="font-semibold">Tên bệnh nhân:</span> {selectedBooking.customerName}</p>
            <p><span className="font-semibold">Mã booking:</span> {selectedBooking.bookingCode}</p>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const bookingId = selectedBooking?._id;
                if (!bookingId) {
                  toast.error('Thiếu thông tin booking!');
                  return;
                }
                if (hasResult) {
                  toast.error('Booking này đã có kết quả, không thể gửi thêm!');
                  return;
                }
                if (medicalRecordSent[bookingId]) {
                  toast.error('Hồ sơ bệnh án đã được gửi!');
                  return;
                }
                if (!selectedStatusForSubmit) {
                  toast.error('Vui lòng chọn trạng thái gửi!');
                  return;
                }
                try {
                  const arvregimenId = arvRegimens.find(r => r.arvName === arvRegimen)?._id;
                  if (!arvregimenId) {
                    toast.error('Thiếu phác đồ ARV!');
                    return;
                  }
                  await addResult({
                    resultName: diagnosis,
                    resultDescription: hivLoad,
                    bookingId,
                    arvregimenId,
                    reExaminationDate,
                    medicationTime,
                  });
                  // Đánh dấu đã gửi hồ sơ bệnh án
                  setMedicalRecordSent(prev => ({ ...prev, [bookingId]: true }));
                  // Gửi trạng thái đã chọn
                  await handleStatusChange(bookingId, selectedStatusForSubmit);
                  toast.success('Đã tạo hồ sơ bệnh án!');
                  setOpenMedicalModal(false);
                  setDiagnosis('');
                  setArvRegimen('');
                  setHivLoad('');
                  setMedicationTime('');
                  setReExaminationDate('');
                  setSelectedStatusForSubmit(null);
                } catch (err: any) {
                  toast.error('Lưu hồ sơ thất bại!');
                }
              }}
            >
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày khám</label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={medicalDate}
                    onChange={e => setMedicalDate(e.target.value)}
                    required
                    readOnly // thêm dòng này nếu muốn chỉ xem, không cho sửa
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loại khám</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    value={medicalType}
                    onChange={e => setMedicalType(e.target.value)}
                    required
                    readOnly // thêm nếu muốn chỉ xem, không cho sửa
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chẩn đoán</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phác đồ ARV</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={arvRegimen}
                    onChange={e => setArvRegimen(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn phác đồ ARV --</option>
                    {arvRegimens.map(regimen => (
                      <option key={regimen._id} value={regimen.arvName}>
                        {regimen.arvName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tải lượng HIV</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    value={hivLoad}
                    onChange={e => setHivLoad(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thời gian uống thuốc</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    value={medicationTime}
                    onChange={e => setMedicationTime(e.target.value)}
                    placeholder="Ví dụ: 08:00, 20:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày tái khám</label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={reExaminationDate}
                    onChange={e => setReExaminationDate(e.target.value)}
                    required
                  />
                </div>
                {/* Các nút trạng thái chuyển vào modal */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="mb-2 text-sm text-gray-600 font-medium">Chọn trạng thái gửi hồ sơ</div>
                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      className={`px-5 py-3 border-2 rounded-lg shadow flex items-center gap-2 text-base font-semibold transition-all duration-150
                        ${selectedStatusForSubmit === 're-examination'
                          ? 'border-purple-600 bg-purple-500 text-white ring-2 ring-purple-400'
                          : 'border-purple-400 bg-purple-100 text-purple-700 hover:bg-purple-200'}
                      `}
                      onClick={() => setSelectedStatusForSubmit('re-examination')}
                    >
                      <CalendarClock className="w-6 h-6" />
                      Tái khám
                    </button>
                    <button
                      type="button"
                      className={`px-5 py-3 border-2 rounded-lg shadow flex items-center gap-2 text-base font-semibold transition-all duration-150
                        ${selectedStatusForSubmit === 'completed'
                          ? 'border-green-600 bg-green-500 text-white ring-2 ring-green-400'
                          : 'border-green-400 bg-green-100 text-green-700 hover:bg-green-200'}
                      `}
                      onClick={() => setSelectedStatusForSubmit('completed')}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      Hoàn tất
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleCloseMedicalModal}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${selectedBooking && (medicalRecordSent[selectedBooking._id!] || !!hasResult) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={selectedBooking ? (medicalRecordSent[selectedBooking._id!] || !!hasResult) : true}
                >
                  {!!hasResult
                    ? 'Đã có kết quả, không thể gửi'
                    : selectedBooking && medicalRecordSent[selectedBooking._id!] ? 'Đã gửi hồ sơ' : 'Lưu hồ sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
