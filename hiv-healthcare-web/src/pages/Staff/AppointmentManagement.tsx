import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Search,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Calendar,
  Loader,
  AlertTriangle,
  Stethoscope,
  CreditCard,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CalendarComponent from "react-calendar" // Renamed to avoid conflict with Lucide icon
import "react-calendar/dist/Calendar.css"
import type { Booking } from "../../types/booking"
import { useBooking } from "../../context/BookingContext"
import { useServiceContext } from "../../context/ServiceContext" // Fixed import statement
import { translateBookingStatus } from "../../utils/status"

// Hàm so sánh ngày theo local
const isSameDayLocal = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

// Hàm parse ngày
const parseBookingDateLocal = (dateStr: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    const [datePart] = dateStr.split("T")
    const [y, m, d] = datePart.split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(dateStr)
}

// Component hiển thị trạng thái
const StatusButton: React.FC<{
  status: string
  bookingId?: string
  onStatusChange: (bookingId: string, newStatus: "checked-in") => void
}> = ({ status, bookingId, onStatusChange }) => {
  if (!bookingId) {
    return (
      <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        Lỗi: Không có ID
      </span>
    )
  }

  if (status === "checked-out") {
    return (
      <button
        onClick={() => onStatusChange(bookingId, "checked-in")}
        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md"
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Điểm danh
      </button>
    )
  }

  const statusStyles: { [key: string]: string } = {
    "checked-in": "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    completed: "bg-purple-100 text-purple-700 border-purple-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200", // Added confirmed status style
    paid: "bg-orange-100 text-orange-700 border-orange-200", // Added paid status style
  }

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "checked-in":
      case "completed":
        return <CheckCircle2 className="w-4 h-4 mr-2" />
      case "pending":
        return <Clock className="w-4 h-4 mr-2" />
      case "cancelled":
        return <XCircle className="w-4 h-4 mr-2" />
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4 mr-2" />
      case "paid":
        return <CreditCard className="w-4 h-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {getStatusIcon(status)}
      {translateBookingStatus(status)}
    </span>
  )
}

const StaffAppointmentManagement: React.FC = () => {
  const { getAll, update } = useBooking()
  const { services } = useServiceContext() // Lấy services từ context
  const [search, setSearch] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Memoized helper functions
  const anonymizeName = useCallback((name: string): string => {
    if (!name) return "Không xác định"
    const words = name.trim().split(" ")
    if (words.length === 1) {
      return words[0].charAt(0) + "*".repeat(words[0].length - 1)
    }
    return (
      words[0].charAt(0) +
      "*".repeat(words[0].length - 1) +
      " " +
      words[words.length - 1].charAt(0) +
      "*".repeat(words[words.length - 1].length - 1)
    )
  }, [])

  const getPatientDisplayInfo = useCallback(
    (booking: Booking) => {
      const isAnonymous = booking.isAnonymous
      if (isAnonymous) {
        return {
          name: anonymizeName(booking.customerName || ""),
          phone: "***-***-****",
          email: "***@***.***",
          doctorName: booking.doctorName || "",
        }
      }
      return {
        name: booking.customerName || "Không xác định",
        phone: booking.customerPhone || "Không có",
        email: booking.customerEmail || "Không có",
        doctorName: booking.doctorName || "Chưa phân công",
      }
    },
    [anonymizeName],
  )

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAll()
        setBookings(data || [])
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu lịch hẹn")
        toast.error(err.message || "Không thể tải dữ liệu lịch hẹn")
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [getAll])

  // Handle status change
  const handleStatusChange = useCallback(
    async (bookingId: string, newStatus: "checked-in") => {
      try {
        await update(bookingId, { status: newStatus })
        setBookings((prev) =>
          prev.map((booking) => (booking._id === bookingId ? { ...booking, status: newStatus } : booking)),
        )
        toast.success("Cập nhật trạng thái thành công!")
      } catch (err: any) {
        toast.error(err.message || "Cập nhật trạng thái thất bại")
      }
    },
    [update],
  )

  // Memoized booking dates for calendar highlighting
  const bookingDates = useMemo(() => bookings.map((b) => parseBookingDateLocal(b.bookingDate)), [bookings])

  // Memoized filtered and sorted bookings
  const onlineConsultationService = useMemo(
    () => services.find((s) => s.serviceName === "Tư vấn trực tuyến"),
    [services],
  )

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const serviceId = typeof booking.serviceId === "object" ? booking.serviceId._id : booking.serviceId
        const matchesService =
          !onlineConsultationService || (onlineConsultationService && serviceId !== onlineConsultationService._id)
        const matchesSearch =
          (booking.customerName && booking.customerName.toLowerCase().includes(search.toLowerCase())) ||
          (booking.customerPhone && booking.customerPhone.includes(search)) ||
          (booking.customerEmail && booking.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
          (booking.bookingCode && booking.bookingCode.toLowerCase().includes(search.toLowerCase()))
        const matchesDate =
          !selectedDate ||
          (booking.bookingDate && isSameDayLocal(parseBookingDateLocal(booking.bookingDate), selectedDate))
        const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus
        return matchesService && matchesSearch && matchesDate && matchesStatus
      }),
    [bookings, search, selectedDate, selectedStatus, onlineConsultationService],
  )

  const sortedBookings = useMemo(
    () =>
      [...filteredBookings].sort((a, b) => {
        const dateA = new Date(a.bookingDate)
        const dateB = new Date(b.bookingDate)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime()
        }
        return (a.startTime || "").localeCompare(b.startTime || "")
      }),
    [filteredBookings],
  )

  // Handle calendar change
  const handleCalendarChange = useCallback((value: Date | null, _event: React.MouseEvent<HTMLButtonElement>) => {
    if (value instanceof Date) {
      setCalendarDate(value)
      setSelectedDate(value)
    } else if (value === null) {
      setCalendarDate(null)
      setSelectedDate(null)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Lịch Hẹn</h1>
          </div>
          <p className="text-gray-600">
            Quản lý và theo dõi lịch hẹn khám HIV. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters and Bookings List */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã lịch hẹn, tên, SĐT, email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
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
                      if (!e.target.value) {
                        setSelectedDate(null)
                        setCalendarDate(null)
                      } else {
                        const [year, month, day] = e.target.value.split("-").map(Number)
                        const date = new Date(year, month - 1, day)
                        setSelectedDate(date)
                        setCalendarDate(date)
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
                    <option value="cancelled">Đã hủy</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="paid">Đã thanh toán</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="flex flex-col items-center">
                  <Loader className="h-10 w-10 animate-spin text-teal-600" />
                  <span className="mt-4 text-lg text-gray-600">Đang tải dữ liệu lịch hẹn...</span>
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

            {/* Bookings List */}
            {!loading && !error && (
              <div className="space-y-6">
                {sortedBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow border p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {search || selectedDate || selectedStatus !== "all"
                        ? "Không tìm thấy lịch hẹn nào"
                        : "Chưa có lịch hẹn nào được tạo (ngoài 'Tư vấn trực tuyến')"}
                    </h3>
                    <p className="text-gray-600">
                      {search || selectedDate || selectedStatus !== "all"
                        ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                        : "Tất cả lịch hẹn sẽ hiển thị tại đây."}
                    </p>
                  </div>
                ) : (
                  sortedBookings.map((booking) => {
                    const patientInfo = getPatientDisplayInfo(booking)
                    const serviceName =
                      typeof booking.serviceId === "object" ? booking.serviceId.serviceName : "Không xác định"
                    const serviceDescription =
                      typeof booking.serviceId === "object" ? booking.serviceId.serviceDescription : "Không có mô tả"
                    const servicePrice = typeof booking.serviceId === "object" ? booking.serviceId.price : undefined

                    return (
                      <div
                        key={booking._id || Math.random()}
                        className="bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300 p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          {/* Booking Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Mã lịch hẹn: {booking.bookingCode || "N/A"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {parseBookingDateLocal(booking.bookingDate).toLocaleDateString("vi-VN")} -{" "}
                                  {booking.startTime || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-600" />
                                <span>
                                  Bệnh nhân: {patientInfo.name}{" "}
                                  {booking.isAnonymous && (
                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                      Ẩn danh
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-teal-600" />
                                <span>SĐT: {patientInfo.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-teal-600" />
                                <span>Email: {patientInfo.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-teal-600" />
                                <span>Bác sĩ: {patientInfo.doctorName}</span>
                              </div>
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ: {serviceName}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{serviceDescription}</p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-sm font-medium text-gray-600">Giá:</span>
                                <span className="text-lg font-bold text-teal-600">
                                  {servicePrice
                                    ? Number(servicePrice).toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                    : "Miễn phí"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex flex-col items-end gap-4 flex-shrink-0">
                            <StatusButton
                              status={booking.status || "unknown"}
                              bookingId={booking._id}
                              onStatusChange={handleStatusChange}
                            />
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CreditCard className="w-4 h-4 text-teal-600" />
                              <span>
                                Thanh toán:{" "}
                                {booking.status === "checked-out" || booking.status ==="checked-in" || booking.status ==="completed" || booking.status ==="re-examination"? (
                                  <span className="font-semibold text-green-700">Đã thanh toán</span>
                                ) : (
                                  <span className="font-semibold text-red-700">Chưa thanh toán</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div className="order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Lịch hẹn theo ngày</h3>
              <CalendarComponent
                onChange={(value) => {
                  if (value instanceof Date) {
                    setCalendarDate(value)
                    setSelectedDate(value)
                  } else if (value === null) {
                    setCalendarDate(null)
                    setSelectedDate(null)
                  }
                }}
                value={calendarDate}
                tileContent={({ date, view }) => {
                  if (view === "month" && bookingDates.some((d) => isSameDayLocal(d, date))) {
                    return (
                      <div className="flex justify-center">
                        <span className="block w-2 h-2 bg-teal-600 rounded-full mt-1"></span>
                      </div>
                    )
                  }
                  return null
                }}
                locale="vi-VN"
                className="react-calendar-custom" // Custom class for styling
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default StaffAppointmentManagement
