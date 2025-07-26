import type React from "react"
import { Bell, X, User, Calendar, Clock, MapPin, Phone, Mail, FileText, AlertCircle } from "lucide-react"
import { getBookingStatusColor, translateBookingStatus } from "../../utils/status"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notification: any
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notification }) => {
  if (!isOpen || !notification) return null

  const formatCurrency = (amount: string | number) => {
    if (!amount) return "Chưa xác định"
    return Number(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Chưa xác định"
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>
      case "checked-out":
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>
      case "checked-in":
        return <div className="w-3 h-3 rounded-full bg-teal-500"></div>
      case "confirmed":
        return <div className="w-3 h-3 rounded-full bg-purple-500"></div>
      case "cancelled":
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>
      case "re-examination":
        return <div className="w-3 h-3 rounded-full bg-orange-500"></div>
      case "pending":
      default:
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 text-white px-8 py-6 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-y-6"></div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 group backdrop-blur-sm"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Bell className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Chi tiết thông báo</h2>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDateTime(notification.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Notification Info */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {notification.notiName || "Thông báo đặt lịch"}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {notification.notiDescription || "Bạn có một thông báo mới về lịch hẹn khám bệnh."}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          {notification.bookingId && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${notification.bookingId?.status === "completed" || notification.bookingId?.status === "checked-out"
                        ? "bg-gradient-to-r from-green-100 to-green-200"
                        : notification.bookingId?.status === "cancelled"
                          ? "bg-gradient-to-r from-red-100 to-red-200"
                          : notification.bookingId?.status === "checked-in" ||
                            notification.bookingId?.status === "confirmed"
                            ? "bg-gradient-to-r from-purple-100 to-purple-200"
                            : notification.bookingId?.status === "re-examination"
                              ? "bg-gradient-to-r from-orange-100 to-orange-200"
                              : "bg-gradient-to-r from-yellow-100 to-yellow-200"
                      }`}
                  >
                    {getStatusIcon(notification.bookingId?.status)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 text-lg">Trạng thái đặt lịch</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Cập nhật lần cuối: {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-6 py-3 text-sm font-bold rounded-full text-white shadow-lg transform hover:scale-105 transition-transform duration-200 bg-gradient-to-r ${getBookingStatusColor(
                    notification.bookingId?.status,
                  )}`}
                >
                  {translateBookingStatus(notification.bookingId?.status)}
                </span>
              </div>

              {/* Service Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Thông tin dịch vụ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tên dịch vụ</label>
                      <p className="text-gray-800 font-semibold">
                        {notification.bookingId.serviceId?.serviceName || "Chưa xác định"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mô tả dịch vụ</label>
                      <p className="text-gray-600 text-sm">
                        {notification.bookingId.serviceId?.serviceDescription || "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Giá dịch vụ</label>
                      <p className="text-2xl font-bold text-green-600">
                        {notification.bookingId.serviceId?.price === 0
                          ? 'Miễn phí'
                          : formatCurrency(notification.bookingId.serviceId?.price)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời gian thực hiện</label>
                      <p className="text-gray-800">
                        {notification.bookingId.serviceId?.duration || "Chưa xác định"} phút
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Thông tin lịch hẹn
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày khám</label>
                      <p className="text-gray-800 font-semibold">
                        {notification.bookingId.bookingDate
                          ? new Date(notification.bookingId.bookingDate).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          : "Chưa xác định"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời gian</label>
                      <p className="text-gray-800 font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {notification.bookingId.startTime || "Chưa xác định"} -{" "}
                        {notification.bookingId.endTime || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bác sĩ phụ trách</label>
                      <p className="text-gray-800 font-semibold flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {notification.bookingId.doctorName || "Chưa phân công"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                      <p className="text-gray-600 text-sm">
                        {notification.bookingId.notes || "Không có ghi chú đặc biệt"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              {notification.bookingId.userId && (
                <div className="bg-purple-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Thông tin bệnh nhân
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                        <p className="text-gray-800 font-semibold">
                          {notification.bookingId.userId.userName || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-800 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          {notification.bookingId.userId.email || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                        <p className="text-gray-800 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          {notification.bookingId.userId.phone_number || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                        <p className="text-gray-800 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {notification.bookingId.userId.address || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    // Navigate to profile or booking details
                    window.location.href = "/user/profile"
                  }}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Xem trong hồ sơ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationModal
