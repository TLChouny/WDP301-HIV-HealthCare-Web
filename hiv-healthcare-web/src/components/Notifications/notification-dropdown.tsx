import type React from "react"
import { useEffect, useRef } from "react"
import { Bell, Clock, User } from "lucide-react"
import { Link } from "react-router-dom"
import { getBookingStatusColor, translateBookingStatus } from "../../utils/status"

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  notifications: any[]
  loading: boolean
  error: string | null
  onNotificationClick: (notification: any) => void
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  loading,
  error,
  onNotificationClick,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Auto close after 3 seconds of no interaction
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Sort notifications by creation date
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`
  }

  return (
    <div
      ref={dropdownRef}
      className={`absolute left-1/2 top-full -translate-x-1/2 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 transition-all duration-300 transform ${
        isOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible -translate-y-4 scale-95"
      }`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Thông báo</h3>
              <p className="text-xs text-gray-500">Cập nhật mới nhất về lịch hẹn</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-sm">
                {loading ? "..." : sortedNotifications.length}
              </span>
              <span className="text-xs text-gray-500 font-medium">thông báo</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group"
              aria-label="Đóng"
            >
              <span className="text-gray-400 group-hover:text-gray-600 text-xl font-bold">×</span>
            </button>
          </div>
        </div>

        {/* Reminder */}
        <div className="mt-4 flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-3 rounded-lg shadow-sm">
          <div className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
          <div>
            <p className="text-amber-800 text-sm font-semibold mb-1">Lưu ý quan trọng</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Kiểm tra hồ sơ cá nhân để xem chi tiết đầy đủ và không bỏ lỡ lịch hẹn đã đặt.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-500">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-red-500 text-xl">!</span>
            </div>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Chưa có thông báo nào</p>
            <p className="text-gray-400 text-sm mt-1">Thông báo sẽ xuất hiện khi có lịch hẹn mới</p>
          </div>
        ) : (
          <div className="py-2">
            {sortedNotifications.map((notification, idx) => {
              const status = notification.bookingId?.status
              return (
                <div
                  key={notification._id || idx}
                  className="px-6 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors duration-200 cursor-pointer group"
                  onClick={() => onNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        status === "completed" || status === "checked-out"
                          ? "bg-green-100"
                          : status === "cancelled"
                            ? "bg-red-100"
                            : status === "checked-in" || status === "confirmed"
                              ? "bg-purple-100"
                              : status === "re-examination"
                                ? "bg-orange-100"
                                : "bg-yellow-100"
                      }`}
                    >
                      <Bell
                        className={`w-5 h-5 ${
                          status === "completed" || status === "checked-out"
                            ? "text-green-600"
                            : status === "cancelled"
                              ? "text-red-600"
                              : status === "checked-in" || status === "confirmed"
                                ? "text-purple-600"
                                : status === "re-examination"
                                  ? "text-orange-600"
                                  : "text-yellow-600"
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm group-hover:text-teal-700 transition-colors duration-200">
                          {notification.notiName || "Thông báo đặt lịch"}
                        </h4>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(notification.createdAt)}
                          </span>
                          {/* Status Badge - Hiển thị rõ ràng */}
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full text-white shadow-sm bg-gradient-to-r ${getBookingStatusColor(
                              notification.bookingId?.status,
                            )}`}
                          >
                            {translateBookingStatus(notification.bookingId?.status)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {notification.notiDescription || "Bạn có một thông báo mới về lịch hẹn"}
                      </p>

                      {/* Service Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          <User className="w-3 h-3 text-teal-600" />
                          <span className="truncate font-medium">
                            {notification.bookingId?.serviceId?.serviceName || "Dịch vụ không xác định"}
                          </span>
                        </div>

                        {notification.bookingId?.startTime && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span className="font-medium">
                              {notification.bookingId.startTime} - {notification.bookingId.endTime}
                            </span>
                          </div>
                        )}

                        {notification.bookingId?.serviceId?.price && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded-md">
                            <span className="w-3 h-3 text-green-600 font-bold">₫</span>
                            <span className="font-medium text-green-700">
                              {Number(notification.bookingId.serviceId.price).toLocaleString("vi-VN")} VND
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action hint */}
                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-xs text-teal-600 font-medium group-hover:underline flex items-center gap-1">
                          Xem chi tiết
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {sortedNotifications.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <Link
            to="/user/profile"
            className="block text-center text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
            onClick={onClose}
          >
            Xem tất cả trong hồ sơ cá nhân
          </Link>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
