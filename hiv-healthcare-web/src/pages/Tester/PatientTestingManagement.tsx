import type React from "react";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, Users, Phone, Mail, AlertTriangle, Loader, Info } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import type { Booking } from "../../types/booking";
import { getBookingStatusColor, translateBookingStatus } from "../../utils/status"; // Import cả hai hàm

const PatientTestingManagement: React.FC = () => {
  const { getAll } = useBooking();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAll();
        // Sort bookings by bookingDate and startTime
        const sortedBookings = res.sort((a, b) => {
          const dateA = new Date(a.bookingDate).getTime();
          const dateB = new Date(b.bookingDate).getTime();
          if (dateA !== dateB) {
            return dateA - dateB;
          }
          // If dates are the same, sort by start time
          const timeA = a.startTime || "";
          const timeB = b.startTime || "";
          return timeA.localeCompare(timeB);
        });
        setBookings(sortedBookings);
      } catch (err: any) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [getAll]);

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = search.toLowerCase();
    const serviceName = (booking.serviceId as any)?.serviceName?.toLowerCase() || "";
    const userName = (booking.userId as any)?.userName?.toLowerCase() || "";
    const bookingCode = booking.bookingCode?.toLowerCase() || "";

    return (
      serviceName.includes(searchLower) ||
      bookingCode.includes(searchLower) ||
      userName.includes(searchLower) ||
      booking.customerEmail?.toLowerCase().includes(searchLower) ||
      booking.customerPhone?.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Bệnh Nhân</h1>
          </div>
          <p className="text-gray-600">Xem và quản lý các lịch hẹn của bệnh nhân được phân công cho bạn</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đặt lịch, tên dịch vụ, tên bệnh nhân, SĐT, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 animate-spin text-teal-600" />
              <span className="mt-4 text-lg text-gray-600">Đang tải lịch hẹn...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-red-700 font-medium text-lg">Lỗi tải dữ liệu</p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-base font-semibold"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Info className="h-10 w-10 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Không tìm thấy lịch hẹn nào</h3>
                        <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Users className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <div className="text-base font-medium text-gray-900">
                                {(booking.userId as any)?.userName || "Không xác định"}
                              </div>
                              <div className="text-sm text-gray-500">Mã đặt: {booking.bookingCode || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium text-gray-900">
                            {(booking.serviceId as any)?.serviceName || "Không xác định"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(booking.serviceId as any)?.serviceDescription || "Không có mô tả"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4 text-teal-600" />
                            <span>{booking.customerEmail || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-4 h-4 text-teal-600" />
                            <span>{booking.customerPhone || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <span>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span>
                              {booking.startTime || "N/A"} - {booking.endTime || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getBookingStatusColor(
                              booking.status || "unknown"
                            )} text-white`}
                          >
                            {translateBookingStatus(booking.status || "unknown")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTestingManagement;