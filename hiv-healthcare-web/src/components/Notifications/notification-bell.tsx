import type React from "react"
import { useState } from "react"
import { Bell } from "lucide-react"
import NotificationDropdown from "./notification-dropdown"
import NotificationModal from "./notification-modal"

interface NotificationBellProps {
  notifications: any[]
  loading: boolean
  error: string | null
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, loading, error }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    setIsDropdownOpen(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
  }

  const unreadCount = notifications.length

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 rounded-full hover:bg-teal-600/20 transition-all duration-200 group transform hover:scale-105"
        aria-label="Thông báo"
      >
        <Bell
          className={`w-6 h-6 text-teal-100 group-hover:text-white transition-all duration-200 ${
            unreadCount > 0 ? "animate-pulse" : ""
          }`}
        />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-bounce">
            {loading ? (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            ) : unreadCount > 99 ? (
              "99+"
            ) : (
              unreadCount
            )}
          </span>
        )}

        {/* Ripple effect */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full animate-ping opacity-30"></span>
        )}
      </button>

      {/* Dropdown */}
      <NotificationDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        notifications={notifications}
        loading={loading}
        error={error}
        onNotificationClick={handleNotificationClick}
      />

      {/* Modal */}
      <NotificationModal isOpen={isModalOpen} onClose={handleCloseModal} notification={selectedNotification} />
    </div>
  )
}

export default NotificationBell
