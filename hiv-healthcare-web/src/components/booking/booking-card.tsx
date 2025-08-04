import type React from "react"
import { User, Phone, Mail, Stethoscope, CreditCard, Calendar, X } from "lucide-react"
import type { Booking } from "../../types/booking" // Assuming this path is correct
import { parseBookingDateLocal } from "../../utils/date"
import { translateBookingStatus, getBookingStatusColor } from "../../utils/status"
import { updateBooking } from "../../api/bookingApi"

interface BookingCardProps {
  booking: Booking
  getPatientDisplayInfo: (booking: Booking) => {
    name: string
    phone: string
    email: string
    doctorName: string
  }
  setSelectedBooking: (booking: Booking) => void
  setMedicalDate: (date: string) => void
  setMedicalType: (type: string) => void
  setOpenMedicalModal: (open: boolean) => void
  medicalRecordSent: { [bookingId: string]: boolean }
  hasResult: boolean
  onBookingUpdate?: () => void // Callback để refresh danh sách booking
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  getPatientDisplayInfo,
  setSelectedBooking,
  setMedicalDate,
  setMedicalType,
  setOpenMedicalModal,
  medicalRecordSent,
  hasResult,
  onBookingUpdate,
}) => {
  const patientInfo = getPatientDisplayInfo(booking)
  const serviceName = typeof booking.serviceId === "object" ? booking.serviceId.serviceName : "Không xác định"
  const serviceDescription =
    typeof booking.serviceId === "object" ? booking.serviceId.serviceDescription : "Không có mô tả"
  const servicePrice = typeof booking.serviceId === "object" ? booking.serviceId.price : undefined
  
  // Check if this is a lab test or ARV test
  const isLabTest = typeof booking.serviceId === "object" && booking.serviceId?.isLabTest
  const isArvTest = typeof booking.serviceId === "object" && booking.serviceId?.isArvTest
  
  // Determine button text based on service type
  const getButtonText = () => {
    if (isArvTest) return "Tạo hồ sơ ARV"
    if (isLabTest) return "Xem hồ sơ"
    return "Tạo hồ sơ"
  }

  // Check if button should be disabled
  const isButtonDisabled = () => {
    if (booking.status === "pending") return true
    return false
  }

  // Check if button should be hidden completely
  const shouldHideButton = () => {
    if (isArvTest && (booking.status === "completed" || booking.status === "re-examination")) return true
    return false
  }

  // Get button title based on disabled state
  const getButtonTitle = () => {
    if (booking.status === "pending") return "Không thể tạo hồ sơ khi trạng thái là Chờ xác nhận"
    return "Tạo hồ sơ bệnh án"
  }

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!booking._id) return
    
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")
    if (!isConfirmed) return

    try {
      console.log("Cancelling booking with ID:", booking._id)
      console.log("Current booking status:", booking.status)
      
      const updatedBooking = await updateBooking(booking._id, { status: "cancelled" })
      console.log("Updated booking:", updatedBooking)
      
      // Refresh the booking list if callback is provided
      if (onBookingUpdate) {
        onBookingUpdate()
      }
      alert("Hủy lịch hẹn thành công!")
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại!")
    }
  }

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
              <h3 className="text-lg font-bold text-gray-800">Mã lịch hẹn: {booking.bookingCode || "N/A"}</h3>
              <p className="text-sm text-gray-600">
                {parseBookingDateLocal(booking.bookingDate).toLocaleDateString("vi-VN")} - {booking.startTime || "N/A"}
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
              <span className="text-sm font-medium text-gray-600">Giá: </span>
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
          <div
            className={`px-4 py-2 rounded-xl font-semibold text-sm shadow text-white bg-gradient-to-r ${getBookingStatusColor(
              booking.status || "unknown",
            )}`}
            title={booking.status}
          >
            {translateBookingStatus(booking.status || "unknown")}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <span>
              Thanh toán:{" "}
              {booking.status === "checked-out" ||
              booking.status === "re-examination" ||
              booking.status === "checked-in" ||
              booking.status === "completed" ||
              booking.status === "cancelled" ? (
                <span className="font-semibold text-green-700">Đã thanh toán</span>
              ) : (
                <span className="font-semibold text-red-700">Chưa thanh toán</span>
              )}
            </span>
          </div>
          {!shouldHideButton() && (
            <button
              onClick={() => {
                setSelectedBooking(booking)
                setMedicalDate(new Date(booking.bookingDate).toISOString().slice(0, 10))
                setMedicalType(booking.serviceId?.serviceName || "")
                setOpenMedicalModal(true)
              }}
              title={getButtonTitle()}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md
                ${
                  isButtonDisabled()
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                }`}
              disabled={isButtonDisabled()}
            >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 inline mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg> */}
              {getButtonText()}
            </button>
          )}
          
          {/* Cancel Button - Only show for checked-in status */}
          {booking.status === "checked-in" && (
            <button
              onClick={handleCancelBooking}
              title="Hủy lịch hẹn"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Hủy lịch
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingCard
