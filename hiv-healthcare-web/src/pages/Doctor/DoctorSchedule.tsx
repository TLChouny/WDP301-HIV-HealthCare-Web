import React from "react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  CalendarDays,
  UserCheck,
  X,
  CheckCircle,
} from "lucide-react"
import { getUserById } from "../../api/authApi"
import { useAuth } from "../../context/AuthContext"
import { useBooking } from "../../context/BookingContext"
import type { User as UserType } from "../../types/user"
import type { Booking } from "../../types/booking"

const DoctorSchedule: React.FC = () => {
  const { user, isDoctor } = useAuth()
  const [doctor, setDoctor] = useState<UserType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { getByDoctorName } = useBooking()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Days of week in Vietnamese
  const daysOfWeek = [
    { en: "Monday", vi: "Thứ Hai", short: "T2" },
    { en: "Tuesday", vi: "Thứ Ba", short: "T3" },
    { en: "Wednesday", vi: "Thứ Tư", short: "T4" },
    { en: "Thursday", vi: "Thứ Năm", short: "T5" },
    { en: "Friday", vi: "Thứ Sáu", short: "T6" },
    { en: "Saturday", vi: "Thứ Bảy", short: "T7" },
    { en: "Sunday", vi: "Chủ Nhật", short: "CN" },
  ]

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!user || !isDoctor) {
        setError("Bạn cần đăng nhập với vai trò bác sĩ để xem lịch làm việc.")
        setLoading(false)
        return
      }

      try {
        const doctorDetails = await getUserById(user._id)
        setDoctor(doctorDetails)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Không thể lấy thông tin lịch làm việc.")
        setLoading(false)
        toast.error(err.message || "Lỗi khi tải lịch làm việc", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    }

    fetchDoctorSchedule()
  }, [user, isDoctor])

  useEffect(() => {
    const fetchBookings = async () => {
      if (doctor?.userName) {
        const data = await getByDoctorName(doctor.userName)
        setBookings(data)
      }
    }

    fetchBookings()
  }, [doctor, getByDoctorName])

  const getBookingForSlot = (date: Date, time: string) => {
    const dateString = date.toLocaleDateString("en-CA") // yyyy-mm-dd local timezone

    return bookings.find((b) => {
      if (!b.bookingDate.startsWith(dateString)) return false
      if (!b.startTime || !b.serviceId || !b.serviceId.duration) return false

      const [startHour, startMinute] = b.startTime.split(":").map(Number)
      const bookingStart = new Date(date)
      bookingStart.setHours(startHour, startMinute, 0, 0)

      const bookingEnd = new Date(bookingStart)
      bookingEnd.setMinutes(bookingStart.getMinutes() + b.serviceId.duration)

      const [slotHour, slotMinute] = time.split(":").map(Number)
      const slotTime = new Date(date)
      slotTime.setHours(slotHour, slotMinute, 0, 0)

      return slotTime >= bookingStart && slotTime < bookingEnd
    })
  }

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek)
      currentDate.setDate(startOfWeek.getDate() + i)
      week.push(currentDate)
    }
    return week
  }

  // Navigate weeks
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  // Check if doctor works on a specific day
  const isDoctorAvailable = (dayName: string) => {
    if (!doctor?.dayOfWeek) return false
    return doctor.dayOfWeek.some((workDay) => workDay.toLowerCase() === dayName.toLowerCase())
  }

  // Generate time slots
  const generateTimeSlots = () => {
    if (!doctor?.startTimeInDay || !doctor?.endTimeInDay) return []

    const slots = []
    const [startHour, startMinute] = doctor.startTimeInDay.split(":").map(Number)
    const [endHour, endMinute] = doctor.endTimeInDay.split(":").map(Number)

    const current = new Date()
    current.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date()
    endTime.setHours(endHour, endMinute, 0, 0)

    while (current <= endTime) {
      slots.push(
        `${current.getHours().toString().padStart(2, "0")}:${current.getMinutes().toString().padStart(2, "0")}`,
      )
      current.setMinutes(current.getMinutes() + 30) // 30-minute intervals
    }

    return slots
  }

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "from-green-500 to-green-600"
      case "pending":
        return "from-amber-500 to-amber-600"
      case "cancelled":
        return "from-red-500 to-red-600"
      default:
        return "from-blue-500 to-blue-600"
    }
  }

  const getBookingStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return CheckCircle
      case "pending":
        return Clock
      case "cancelled":
        return X
      default:
        return UserCheck
    }
  }

  const weekDates = getWeekDates(currentWeek)
  const timeSlots = generateTimeSlots()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải lịch làm việc...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin</h2>
          <p className="text-gray-600">Không tìm thấy thông tin bác sĩ.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Lịch Làm Việc</h1>
          </div>
          <p className="text-gray-600">Quản lý và xem lịch làm việc của bác sĩ</p>
        </div>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                {doctor.avatar ? (
                  <img
                    src={doctor.avatar || "/placeholder.svg"}
                    alt={doctor.userName}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <Stethoscope className="h-10 w-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{doctor.userName}</h2>
                <p className="text-blue-100 mb-3">{doctor.userDescription || "Bác sĩ chuyên khoa"}</p>
                <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                  {doctor.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{doctor.email}</span>
                    </div>
                  )}
                  {doctor.phone_number && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone_number}</span>
                    </div>
                  )}
                  {doctor.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours Summary */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-teal-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giờ làm việc</p>
                    <p className="font-bold text-gray-800">
                      {doctor.startTimeInDay || "Chưa xác định"} - {doctor.endTimeInDay || "Chưa xác định"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày làm việc</p>
                    <p className="font-bold text-gray-800">{doctor.dayOfWeek?.length || 0} ngày/tuần</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian áp dụng</p>
                    <p className="font-bold text-gray-800">
                      {doctor.startDay ? new Date(doctor.startDay).toLocaleDateString("vi-VN") : "Chưa xác định"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Tuần {weekDates[0].toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} -{" "}
                  {weekDates[6].toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </h3>
                <p className="text-gray-600">Lịch làm việc chi tiết theo tuần</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Date Picker filter */}
                <DatePicker
                  selected={currentWeek}
                  onChange={(date: Date | null) => {
                    if (date !== null) {
                      setCurrentWeek(date)
                    }
                  }}
                  className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                />
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentWeek(new Date())}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => navigateWeek("next")}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Days Header */}
            <div className="grid grid-cols-8 gap-4 mb-6">
              <div className="text-center font-semibold text-gray-600 py-3">
                <div className="text-sm">Giờ</div>
              </div>
              {daysOfWeek.map((day, index) => {
                const currentDate = weekDates[index]
                const isAvailable = isDoctorAvailable(day.en)
                const isToday = currentDate.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={day.en}
                    className={`text-center py-3 px-2 rounded-xl font-semibold transition-all duration-200 ${
                      isAvailable
                        ? isToday
                          ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg"
                          : "bg-teal-50 text-teal-700 border border-teal-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <div className="text-sm font-bold">{day.short}</div>
                    <div className="text-xs mt-1 opacity-90">
                      {currentDate.getDate()}/{currentDate.getMonth() + 1}
                    </div>
                    <div className="text-xs mt-1 opacity-75">{day.vi}</div>
                  </div>
                )
              })}
            </div>

            {/* Time Slots */}
            {timeSlots.length > 0 ? (
              <div className="space-y-3">
                {timeSlots.map((timeSlot) => {
                  return (
                    <div key={timeSlot} className="grid grid-cols-8 gap-4">
                      <div className="text-center py-4 px-2 font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {timeSlot}
                        </div>
                      </div>
                      {daysOfWeek.map((day, dayIndex) => {
                        const currentDate = weekDates[dayIndex]
                        const isAvailable = isDoctorAvailable(day.en)
                        const isToday = currentDate.toDateString() === new Date().toDateString()
                        const isPast = currentDate < new Date() && !isToday
                        const booking = getBookingForSlot(currentDate, timeSlot)

                        if (booking) {
                          const StatusIcon = getBookingStatusIcon(booking.status)
                          return (
                            <div
                              key={`${day.en}-${timeSlot}`}
                              onClick={() => setSelectedBooking(booking)}
                              className={`py-3 px-3 rounded-xl text-center text-sm font-medium transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-105 bg-gradient-to-r ${getBookingStatusColor(
                                booking.status,
                              )} text-white shadow-md`}
                            >
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <StatusIcon className="h-4 w-4" />
                                <span className="font-bold text-xs">{booking.bookingCode}</span>
                                <span className="text-xs opacity-90 truncate max-w-full">
                                  {booking.serviceId?.serviceName || "Dịch vụ"}
                                </span>
                                <span className="text-xs opacity-75">{booking.customerName || "Khách hàng"}</span>
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div
                            key={`${day.en}-${timeSlot}`}
                            className={`py-4 px-3 rounded-xl text-center text-sm font-medium transition-all duration-200 ${
                              isAvailable && !isPast
                                ? isToday
                                  ? "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 border-2 border-teal-300 shadow-sm"
                                  : "bg-teal-50 text-teal-600 hover:bg-teal-100 cursor-pointer border border-teal-200"
                                : isPast
                                  ? "bg-gray-50 text-gray-300 border border-gray-200"
                                  : "bg-gray-50 text-gray-400 border border-gray-200"
                            }`}
                          >
                            {isAvailable && !isPast ? (
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs font-semibold">Có thể đặt</span>
                              </div>
                            ) : isPast ? (
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <X className="h-4 w-4" />
                                <span className="text-xs">Đã qua</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <X className="h-4 w-4" />
                                <span className="text-xs">Không làm việc</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có lịch làm việc</h3>
                <p className="text-gray-500">Bác sĩ chưa thiết lập giờ làm việc cụ thể</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Chú thích</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
              <span className="text-sm text-gray-600">Lịch hẹn đã xác nhận</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded"></div>
              <span className="text-sm text-gray-600">Lịch hẹn chờ xác nhận</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-teal-100 to-blue-100 border-2 border-teal-300 rounded"></div>
              <span className="text-sm text-gray-600">Hôm nay - Có thể đặt lịch</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-teal-50 border border-teal-200 rounded"></div>
              <span className="text-sm text-gray-600">Ngày làm việc</span>
            </div>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${getBookingStatusColor(
                      selectedBooking.status,
                    )} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    {React.createElement(getBookingStatusIcon(selectedBooking.status), {
                      className: "h-8 w-8 text-white",
                    })}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Chi tiết lịch hẹn</h2>
                  <p className="text-gray-600">#{selectedBooking.bookingCode}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Thông tin dịch vụ</h3>
                    <p className="text-gray-600">{selectedBooking.serviceId?.serviceName || "Không xác định"}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Khách hàng:</span>
                      <span className="font-semibold">{selectedBooking.customerName || "Khách hàng ẩn danh"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Ngày:</span>
                      <span className="font-semibold">
                        {new Date(selectedBooking.bookingDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Giờ:</span>
                      <span className="font-semibold">{selectedBooking.startTime}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getBookingStatusColor(
                          selectedBooking.status,
                        )}`}
                      >
                        {selectedBooking.status === "confirmed"
                          ? "Đã xác nhận"
                          : selectedBooking.status === "pending"
                            ? "Chờ xác nhận"
                            : "Đã hủy"}
                      </span>
                    </div>
                    {selectedBooking.notes && (
                      <div className="flex justify-between items-start py-2">
                        <span className="text-gray-600">Ghi chú:</span>
                        <span className="font-semibold text-right max-w-48">{selectedBooking.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  )
}

export default DoctorSchedule
