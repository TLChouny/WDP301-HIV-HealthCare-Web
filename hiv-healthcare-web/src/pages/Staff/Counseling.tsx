import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Video,
  Clock,
  User,
  Link,
  Copy,
  ExternalLink,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Eye,
  EyeOff,
  Phone,
  Mail,
  CalendarIcon,
  Loader,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import Calendar from "react-calendar"
import "react-toastify/dist/ReactToastify.css"
import "react-calendar/dist/Calendar.css"
import type { Booking } from "../../types/booking"
import { useBooking } from "../../context/BookingContext"
import { useServiceContext } from "../../context/ServiceContext"

// Định nghĩa interface cho tham số của tileContent
interface TileContentParams {
  date: Date
  view: string
}
type CalendarValue = Date | null

const StaffCounseling: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(null)
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [showPatientInfo, setShowPatientInfo] = useState<boolean>(false)

  // State cho modal
  const [showMeetLinkModal, setShowMeetLinkModal] = useState<boolean>(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [meetLinkInput, setMeetLinkInput] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const bookingContext = useBooking()
  const { services } = useServiceContext()

  // Hàm ẩn danh tên bệnh nhân
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

  // Hàm hiển thị thông tin bệnh nhân
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
      } else {
        if (showPatientInfo) {
          return {
            name: booking.customerName || "Không xác định",
            phone: booking.customerPhone || "Không có",
            email: booking.customerEmail || "Không có",
            doctorName: booking.doctorName || "Chưa phân công",
          }
        } else {
          return {
            name: anonymizeName(booking.customerName || ""),
            phone: "***-***-****",
            email: "***@***.***",
            doctorName: booking.doctorName || "",
          }
        }
      }
    },
    [anonymizeName, showPatientInfo],
  )

  // Lấy dữ liệu booking từ API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await bookingContext.getAll()
        setBookings(data || [])
      } catch (err: any) {
        console.error("Error fetching bookings:", err)
        setError(err.message || "Không thể tải dữ liệu")
        toast.error(err.message || "Không thể tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [bookingContext.getAll])

  // Lấy danh sách các ngày có lịch hẹn (dạng Date)
  const appointmentDates = useMemo(() => bookings.map((b) => new Date(b.bookingDate)), [bookings])

  // Lọc danh sách booking chỉ hiển thị "Tư vấn trực tuyến"
  const onlineConsultationService = useMemo(
    () => services.find((s) => s.serviceName === "Tư vấn trực tuyến"),
    [services],
  )

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const serviceId = typeof booking.serviceId === "object" ? booking.serviceId._id : booking.serviceId
        const matchesService = onlineConsultationService && serviceId === onlineConsultationService._id
        const matchesSearch =
          (booking.customerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (booking.doctorName?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (booking.bookingCode?.toLowerCase() || "").includes(search.toLowerCase())
        const matchesDate = selectedDate
          ? new Date(booking.bookingDate).toDateString() === selectedDate.toDateString()
          : true
        return matchesService && matchesSearch && matchesDate
      }),
    [bookings, search, selectedDate, onlineConsultationService],
  )

  // Sắp xếp danh sách booking theo ngày và giờ
  const sortedBookings = useMemo(
    () =>
      [...filteredBookings].sort((a, b) => {
        const dateA = new Date(a.bookingDate)
        const dateB = new Date(b.bookingDate)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime()
        }

        const timeA = a.startTime || ""
        const timeB = b.startTime || ""
        return timeA.localeCompare(timeB)
      }),
    [filteredBookings],
  )

  // Nhóm các booking theo ngày
  const groupedBookings = useMemo(
    () =>
      sortedBookings.reduce(
        (groups, booking) => {
          const date = new Date(booking.bookingDate).toLocaleDateString("vi-VN")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(booking)
          return groups
        },
        {} as Record<string, Booking[]>,
      ),
    [sortedBookings],
  )

  // Reset selected date
  const handleResetDate = useCallback(() => {
    setSelectedDate(null)
    setShowCalendar(false)
  }, [])

  // Hàm cập nhật link Google Meet (đã cải tiến)
  const handleUpdateMeetLink = async () => {
    if (!selectedBooking || !selectedBooking._id) {
      toast.warn("Không tìm thấy thông tin booking để cập nhật.")
      return
    }
    if (!meetLinkInput.trim()) {
      toast.warn("Vui lòng nhập link Google Meet hợp lệ.")
      return
    }
    // Kiểm tra định dạng URL cơ bản
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
    if (!urlPattern.test(meetLinkInput)) {
      toast.warn("Link Google Meet không hợp lệ. Vui lòng nhập URL hợp lệ.")
      return
    }

    setIsSubmitting(true)
    try {
      const updatedBooking = await bookingContext.update(selectedBooking._id, { meetLink: meetLinkInput.trim() })
      if (updatedBooking && updatedBooking.meetLink) {
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBooking._id ? { ...b, meetLink: updatedBooking.meetLink } : b)),
        )
        toast.success("Đã cập nhật link Google Meet thành công!")
      } else {
        throw new Error("Cập nhật không thành công, không nhận được dữ liệu từ server.")
      }
      setShowMeetLinkModal(false)
      setSelectedBooking(null)
      setMeetLinkInput("")
    } catch (err: any) {
      console.error("Error updating meet link:", err)
      const errorMessage = err.message || "Có lỗi xảy ra khi cập nhật link."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mở modal và set dữ liệu booking được chọn
  const openModal = useCallback((booking: Booking) => {
    setSelectedBooking(booking)
    setMeetLinkInput(booking.meetLink || "")
    setShowMeetLinkModal(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Tư Vấn Trực Tuyến</h1>
          </div>
          <p className="text-gray-600">
            Thêm link Google Meet và quản lý các buổi tư vấn. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã lịch hẹn, tên, bác sĩ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center gap-2"
              >
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString("vi-VN") : "Chọn ngày"}
                </span>
              </button>
              {showCalendar && (
                <div className="absolute right-0 mt-2 z-10 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <Calendar
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value)
                        setShowCalendar(false)
                      }
                    }}
                    value={selectedDate}
                    locale="vi-VN"
                    tileContent={({ date, view }: TileContentParams) => {
                      if (view === "month" && appointmentDates.some((d) => d.toDateString() === date.toDateString())) {
                        return (
                          <div className="flex justify-center">
                            <span className="h-1 w-1 bg-teal-600 rounded-full"></span>
                          </div>
                        )
                      }
                      return null
                    }}
                    className="react-calendar-custom"
                  />
                  {selectedDate && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleResetDate}
                        className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                      >
                        Xóa lọc ngày
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowPatientInfo(!showPatientInfo)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-md flex-shrink-0"
            >
              {showPatientInfo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {showPatientInfo ? "Ẩn thông tin" : "Hiện thông tin"}
            </button>
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
        {!loading && !error && sortedBookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="h-10 w-10 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {search || selectedDate
                ? "Không tìm thấy lịch hẹn nào"
                : "Chưa có lịch hẹn 'Tư vấn trực tuyến' nào được tạo"}
            </h3>
            <p className="text-gray-600">
              {search || selectedDate
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                : "Tất cả lịch hẹn tư vấn sẽ hiển thị tại đây."}
            </p>
          </div>
        )}
        {!loading && !error && sortedBookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            {Object.entries(groupedBookings).map(([date, dateBookings]) => (
              <div key={date} className="mb-0 last:mb-0">
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800">Ngày: {date}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">STT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Mã lịch hẹn & Thông tin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Dịch vụ & Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Link Google Meet
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dateBookings.map((booking, index) => {
                        const patientInfo = getPatientDisplayInfo(booking)
                        return (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-blue-600">{booking.bookingCode || "N/A"}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-teal-600" />
                                  <span>
                                    {patientInfo.name}
                                    {booking.isAnonymous && (
                                      <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded ml-1">
                                        Ẩn danh
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3 text-teal-600" />
                                  <span>{patientInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Mail className="w-3 h-3 text-teal-600" />
                                  <span> {patientInfo.email}</span>
                                </div>
                                <div className="mt-2 text-gray-700">
                                  <span>Bác sĩ: {patientInfo.doctorName}</span>
                                </div>
                                <div className="mt-1">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      booking.status === "checked-in"
                                        ? "bg-green-100 text-green-800"
                                        : booking.status === "pending"
                                          ? "bg-amber-100 text-amber-800"
                                          : booking.status === "cancelled"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {booking.status === "checked-in" && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {booking.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                    {booking.status === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                                    {booking.status === "checked-in"
                                      ? "Đã xác nhận"
                                      : booking.status === "pending"
                                        ? "Chờ xác nhận"
                                        : booking.status === "cancelled"
                                          ? "Đã hủy"
                                          : booking.status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-teal-600">
                                {booking.serviceId?.serviceName || "Không xác định"}
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {booking.bookingDate
                                  ? new Date(booking.bookingDate).toLocaleDateString("vi-VN")
                                  : "N/A"}{" "}
                                - {booking.startTime || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {booking.meetLink ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={booking.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate max-w-[150px] flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{booking.meetLink}</span>
                                  </a>
                                  <Copy
                                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-teal-600 transition-colors"
                                    onClick={() => {
                                      navigator.clipboard.writeText(booking.meetLink!)
                                      toast.info("Đã sao chép link!")
                                    }}
                                  />
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">Chưa có link</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => openModal(booking)}
                                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-md"
                              >
                                <Link className="w-4 h-4 mr-2" />
                                Thêm/Sửa Link
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Thêm/Sửa Link Google Meet */}
        {showMeetLinkModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Link className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Thêm Link Google Meet</h3>
                </div>
                <button
                  onClick={() => setShowMeetLinkModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Mã lịch hẹn:</strong> {selectedBooking.bookingCode || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Bệnh nhân:</strong> {getPatientDisplayInfo(selectedBooking).name}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>SĐT:</strong> {getPatientDisplayInfo(selectedBooking).phone}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Email:</strong> {getPatientDisplayInfo(selectedBooking).email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Bác sĩ:</strong> {getPatientDisplayInfo(selectedBooking).doctorName}
                  </p>
                </div>
                <div>
                  <label htmlFor="meetLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Đường dẫn Google Meet
                  </label>
                  <input
                    id="meetLink"
                    type="url"
                    value={meetLinkInput}
                    onChange={(e) => setMeetLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <button
                  onClick={() => setShowMeetLinkModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateMeetLink}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" /> Đang lưu...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="h-4 w-4 mr-2" /> Lưu và Gửi
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default StaffCounseling