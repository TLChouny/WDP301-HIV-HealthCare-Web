import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar as CalendarIcon, Loader, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Mail, Phone, User, Stethoscope } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import CalendarComponent from "../../components/CalendarComponent";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { translateBookingStatus } from "../../utils/status";

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
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    const [datePart] = dateStr.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
};

const StatusButton: React.FC<{
  status: string;
  bookingId?: string;
  onStatusChange: (bookingId: string, newStatus: "checked-in" | "completed" | "cancelled" | "confirmed" | "pending" | "re-examination" | "checked-out") => void;
  userRole?: string;
}> = ({ status, bookingId, onStatusChange, userRole = "user" }) => {
  if (!bookingId) {
    return (
      <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        Lỗi: Không có ID
      </span>
    );
  }
  if (["checked-in", "completed", "cancelled", "confirmed", "paid"].includes(status)) {
    const statusStyles: { [key: string]: string } = {
      "checked-in": "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-purple-100 text-purple-700 border-purple-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      paid: "bg-orange-100 text-orange-700 border-orange-200",
    };
    const getStatusIcon = (s: string) => {
      switch (s) {
        case "checked-in":
        case "completed":
          return <CheckCircle2 className="w-4 h-4 mr-2" />;
        case "pending":
          return <Clock className="w-4 h-4 mr-2" />;
        case "cancelled":
          return <XCircle className="w-4 h-4 mr-2" />;
        case "confirmed":
          return <CheckCircle2 className="w-4 h-4 mr-2" />;
        case "paid":
          return <CheckCircle2 className="w-4 h-4 mr-2" />;
        default:
          return null;
      }
    };
    return (
      <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
        {getStatusIcon(status)}
        {translateBookingStatus(status)}
      </span>
    );
  }
  // Doctor có thể chuyển từ pending sang completed cho tư vấn trực tuyến
  if (userRole === "doctor" && status === "pending") {
    return (
      <div
        onClick={() => onStatusChange(bookingId, "completed")}
        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-black hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Hoàn thành
      </div>
    );
  }
  return (
    <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-500 border border-gray-200 cursor-not-allowed">
      <Clock className="w-4 h-4 mr-2" />
      {translateBookingStatus(status)}
    </span>
  );
};

const OnlineConsulting: React.FC = () => {
  const { getAll, update } = useBooking();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll();
        // Chỉ lấy các booking dịch vụ tư vấn trực tuyến
        const filtered = data.filter((b: any) => b.serviceId?.serviceName?.includes("Tư vấn trực tuyến"));
        if (user && user.role === "doctor" && user.userName) {
          setBookings(filtered.filter((b: any) => b.doctorName === user.userName));
        } else {
          setBookings(filtered);
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu");
        toast.error(err.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll, user]);

  const handleStatusChange = useCallback(
    async (id: string, newStatus: "checked-in" | "completed" | "cancelled" | "confirmed" | "pending" | "re-examination" | "checked-out") => {
      try {
        await update(id, { status: newStatus });
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
      } catch (err: any) {
        toast.error(err.message || "Cập nhật thất bại");
      }
    },
    [update]
  );

  const bookingDates = useMemo(() => bookings.map((b) => parseBookingDateLocal(b.bookingDate)), [bookings]);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchSearch =
          booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          booking.customerPhone?.includes(search) ||
          booking.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
          booking.bookingCode?.toLowerCase().includes(search.toLowerCase());
        const matchDate =
          !selectedDate ||
          isSameDayLocal(parseBookingDateLocal(booking.bookingDate), selectedDate);
        const matchStatus =
          selectedStatus === "all" || booking.status === selectedStatus;
        return matchSearch && matchDate && matchStatus;
      }),
    [bookings, search, selectedDate, selectedStatus]
  );

  const sortedBookings = useMemo(
    () =>
      [...filteredBookings].sort(
        (a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
      ),
    [filteredBookings]
  );

  // Calendar change
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const handleCalendarChange = useCallback(
    (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
      if (value instanceof Date) {
        setCalendarDate(value);
        setSelectedDate(value);
      } else if (Array.isArray(value)) {
        const [start] = value;
        if (start instanceof Date) {
          setCalendarDate(start);
          setSelectedDate(start);
        }
      } else {
        setCalendarDate(null);
        setSelectedDate(null);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Lịch Tư Vấn Trực Tuyến</h1>
          </div>
          <p className="text-gray-600">Quản lý và theo dõi các lịch hẹn tư vấn trực tuyến của bác sĩ.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters and Bookings List */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tên, SĐT, email, mã booking..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="date"
                    value={
                      selectedDate
                        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setSelectedDate(new Date(val));
                        setCalendarDate(new Date(val));
                      } else {
                        setSelectedDate(null);
                        setCalendarDate(null);
                      }
                    }}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="checked-in">Đã điểm danh</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="flex flex-col items-center">
                  <Loader className="h-10 w-10 animate-spin text-teal-600" />
                  <span className="mt-4 text-gray-600">Đang tải dữ liệu...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <span className="text-red-600 font-semibold">{error}</span>
              </div>
            )}

            {/* Bookings List */}
            {!loading && !error && (
              <div className="space-y-6">
                {sortedBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow border p-8 text-center text-gray-500">Không có lịch tư vấn nào.</div>
                ) : (
                  sortedBookings.map((booking) => (
                    (() => {
                      // Patient info
                      const patientInfo = {
                        name: booking.isAnonymous
                          ? (booking.customerName ? booking.customerName[0] + "***" : "Ẩn danh")
                          : booking.customerName || "Không xác định",
                        phone: booking.isAnonymous ? "***-***-****" : booking.customerPhone || "Không có",
                        email: booking.isAnonymous ? "***@***.***" : booking.customerEmail || "Không có",
                        doctorName: booking.doctorName || "Chưa phân công",
                      };
                      const serviceName = booking.serviceId?.serviceName || "Không xác định";
                      const serviceDescription = booking.serviceId?.description || "";
                      const servicePrice = booking.serviceId?.price;
                      const isOnlineConsultation = serviceName.includes("Tư vấn trực tuyến");
                      return (
                        <div key={booking._id} className="bg-white rounded-2xl shadow border p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CalendarIcon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Mã lịch hẹn: {booking.bookingCode || "N/A"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {parseBookingDateLocal(booking.bookingDate).toLocaleDateString("vi-VN")} - {booking.startTime || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                <span>
                                  Bệnh nhân: {patientInfo.name} {booking.isAnonymous && (
                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">Ẩn danh</span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-teal-600" />
                                <span>SĐT: {patientInfo.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-teal-600" />
                                <span>Email: {patientInfo.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                <span>Bác sĩ: {patientInfo.doctorName}</span>
                              </div>
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ: {serviceName}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{serviceDescription}</p>
                              {isOnlineConsultation && booking.meetLink && (
                                <div className="mt-3"></div>
                              )}
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-sm font-medium text-gray-600">Giá:</span>
                                <span className="text-lg font-bold text-teal-600">
                                  {servicePrice ? Number(servicePrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "Miễn phí"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusButton
                              status={booking.status}
                              bookingId={booking._id}
                              onStatusChange={handleStatusChange}
                              userRole={user?.role}
                            />
                            <div className="flex flex-row gap-2 mt-2">
                              <button
                                onClick={() => {
                                  toast.success("Tạo hồ sơ bệnh án cho lịch hẹn này!");
                                }}
                                title={"Tạo hồ sơ bệnh án"}
                                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 inline mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Tạo ghi chú
                              </button>
                              {isOnlineConsultation && (
                                booking.meetLink ? (
                                  <a
                                    href={booking.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 flex items-center"
                                    title="Mở Google Meet"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4 inline mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
                                    </svg>
                                    Mở Google Meet
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md bg-gray-200 text-gray-500 flex items-center cursor-not-allowed"
                                    title="Không có link Google Meet"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4 inline mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
                                    </svg>
                                    Google Meet
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div className="order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Lịch tư vấn theo ngày</h3>
              <CalendarComponent
                onChange={handleCalendarChange}
                value={calendarDate}
                selectRange={false}
                locale="vi-VN"
                className="react-calendar-custom"
                tileContent={({ date, view }: { date: Date; view: string }) => {
                  if (
                    view === "month" &&
                    bookingDates.some((d) => isSameDayLocal(d, date))
                  ) {
                    return (
                      <div className="w-2 h-2 rounded-full bg-teal-500 mx-auto mt-1" />
                    );
                  }
                  return null;
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OnlineConsulting;
