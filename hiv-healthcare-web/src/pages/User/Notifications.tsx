import type React from "react"
import { useState, useEffect } from "react"
import { Bell, BellRing, Trash2, Settings, Calendar, Pill, FileText, Newspaper } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"

const UserNotifications: React.FC = () => {
  const { user } = useAuth()
  const { notifications, loading, error, getNotificationsByUserIdHandler, deleteNotificationByIdHandler } = useNotification()
  const [notificationSettings, setNotificationSettings] = useState([
    {
      id: "appointment",
      title: "Thông báo lịch hẹn",
      description: "Nhận thông báo khi có lịch hẹn mới hoặc thay đổi",
      enabled: true,
      icon: Calendar,
    },
    {
      id: "medication",
      title: "Nhắc nhở uống thuốc",
      description: "Nhận thông báo nhắc nhở uống thuốc ARV",
      enabled: true,
      icon: Pill,
    },
    {
      id: "test",
      title: "Kết quả xét nghiệm",
      description: "Nhận thông báo khi có kết quả xét nghiệm mới",
      enabled: true,
      icon: FileText,
    },
    {
      id: "news",
      title: "Tin tức y tế",
      description: "Nhận thông báo về tin tức y tế và sự kiện",
      enabled: false,
      icon: Newspaper,
    },
  ])

  // Fetch notifications when userId is available
  useEffect(() => {
    if (user?._id) {
      getNotificationsByUserIdHandler(user._id)
    }
  }, [user?._id, getNotificationsByUserIdHandler])

  const handleDeleteNotification = (id: string) => {
    if (user?._id && notifications.find((n) => n._id === id)) {
      deleteNotificationByIdHandler(id)
    }
  }

  const handleToggleSetting = (id: string) => {
    setNotificationSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting))
    )
  }

  const getNotificationIcon = (name: string) => {
    switch (true) {
      case /lịch hẹn/i.test(name):
        return Calendar
      case /thuốc|nhắc nhở/i.test(name):
        return Pill
      case /xét nghiệm|kết quả/i.test(name):
        return FileText
      case /tin tức|y tế/i.test(name):
        return Newspaper
      default:
        return Bell
    }
  }

  const getNotificationColor = (name: string) => {
    switch (true) {
      case /lịch hẹn/i.test(name):
        return "from-blue-500 to-blue-600"
      case /thuốc|nhắc nhở/i.test(name):
        return "from-green-500 to-green-600"
      case /xét nghiệm|kết quả/i.test(name):
        return "from-purple-500 to-purple-600"
      case /tin tức|y tế/i.test(name):
        return "from-orange-500 to-orange-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
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
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Thông báo</h1>
          </div>
          <p className="text-gray-600">Quản lý thông báo và cài đặt nhắc nhở của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Thông báo gần đây</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{notifications.length} tổng số</span> {/* Vì không có read, chỉ đếm tổng số */}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có thông báo</h3>
                <p className="text-gray-500">Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.notiName)
                  return (
                    <div
                      key={notification._id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${getNotificationColor(
                            notification.notiName
                          )} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-800">
                              {notification.notiName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteNotification(notification._id!)}
                                className="text-red-500 hover:text-red-600 p-1"
                                title="Xóa thông báo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="mb-2 text-gray-700">
                            {notification.notiDescription || "Không có mô tả"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Không có thời gian"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Cài đặt thông báo</h2>
            </div>

            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <setting.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{setting.title}</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.enabled}
                          onChange={() => handleToggleSetting(setting.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                            setting.enabled ? "bg-teal-600" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              setting.enabled ? "translate-x-5" : "translate-x-0"
                            } mt-0.5 ml-0.5`}
                          />
                        </div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Lưu ý</h4>
                  <p className="text-sm text-blue-700">
                    Thông báo sẽ được gửi qua email và hiển thị trong ứng dụng. Bạn có thể thay đổi cài đặt này bất kỳ
                    lúc nào.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserNotifications