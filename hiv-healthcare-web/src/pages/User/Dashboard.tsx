import type React from "react"
import { Calendar, Bell, ArrowRight, Clock, User, Stethoscope, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

const UserDashboard: React.FC = () => {
  const navigate = useNavigate()

  // Mock data - replace with actual data from your backend
  const upcomingAppointments = [
    {
      id: 1,
      date: "20/03/2024",
      time: "09:00",
      type: "Khám định kỳ",
      doctor: "BS. Trần Thị B",
      status: "confirmed",
    },
    {
      id: 2,
      date: "25/03/2024",
      time: "14:30",
      type: "Xét nghiệm",
      doctor: "BS. Lê Văn C",
      status: "pending",
    },
  ]

  const notifications = [
    {
      id: 1,
      title: "Lịch hẹn mới",
      message: "Lịch hẹn khám định kỳ đã được xác nhận",
      time: "5 phút trước",
      type: "appointment",
    },
    {
      id: 2,
      title: "Nhắc nhở",
      message: "Đừng quên uống thuốc ARV vào 8h sáng",
      time: "1 giờ trước",
      type: "reminder",
    },
  ]

  const stats = [
    {
      title: "Lịch hẹn sắp tới",
      value: "2",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Lịch hẹn tháng này",
      value: "5",
      icon: Clock,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      title: "Thông báo mới",
      value: "3",
      icon: Bell,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ]

  const quickActions = [
    {
      title: "Đặt lịch mới",
      description: "Đặt lịch khám với bác sĩ chuyên khoa",
      icon: Calendar,
      color: "from-teal-600 to-blue-600",
      action: () => navigate("/services"),
    },
    {
      title: "Xem hồ sơ bệnh án",
      description: "Theo dõi lịch sử khám bệnh và kết quả",
      icon: FileText,
      color: "from-purple-600 to-pink-600",
      action: () => navigate("/user/medical-records"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Tổng quan</h1>
          </div>
          <p className="text-gray-600">Chào mừng bạn trở lại! Đây là tổng quan về tình trạng sức khỏe của bạn.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Lịch hẹn sắp tới</h2>
              </div>
              <button
                onClick={() => navigate("/user/appointments")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có lịch hẹn nào sắp tới</p>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/user/appointments`)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{appointment.type}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.date} - {appointment.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {appointment.doctor}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {appointment.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
              </div>
              <button
                onClick={() => navigate("/user/notifications")}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có thông báo mới</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{notification.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
