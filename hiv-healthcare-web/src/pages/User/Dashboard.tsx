import React, { useEffect, useState } from "react";
import {
  Calendar,
  Bell,
  ArrowRight,
  Clock,
  User,
  Stethoscope,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { useNotification } from "../../context/NotificationContext";
import type { Booking } from "../../types/booking";
import type { Notification } from "../../types/notification";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getByUserId } = useBooking();
  const { notifications, getNotificationsByUserIdHandler } = useNotification();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Booking[]>([]);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ Lịch hẹn
        const userBookings = await getByUserId(user._id);
          // Sắp xếp giảm dần theo updatedAt (mới nhất lên trên)
          const sortedBookings = userBookings.sort((a, b) =>
            new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime()
          );
          setUpcomingAppointments(sortedBookings || []);

        // ✅ Thông báo
        const fetchedNotifications = await getNotificationsByUserIdHandler(user._id); // 🔥 lấy trực tiếp
        const sorted = [...fetchedNotifications]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setDisplayedNotifications(sorted); // 🔥 dùng state local
      } catch (err) {
        setError("Không thể tải dữ liệu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id, getByUserId, getNotificationsByUserIdHandler]);


  const stats = [
    {
      title: "Lịch hẹn sắp tới",
      value: upcomingAppointments.length.toString(),
      icon: Calendar,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Lịch hẹn tháng này",
      value: upcomingAppointments.length.toString(), //chưa xử lý lịch hẹn tháng này
      icon: Clock,
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Thông báo mới",
      value: displayedNotifications.length.toString(), // Sử dụng state local
      icon: Bell,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const quickActions = [
    {
      title: "Đặt lịch mới",
      description: "Đặt lịch khám với bác sĩ",
      icon: Calendar,
      color: "from-teal-600 to-blue-600",
      action: () => navigate("/services"),
    },
    {
      title: "Xem hồ sơ bệnh án",
      description: "Lịch sử khám & kết quả",
      icon: FileText,
      color: "from-purple-600 to-pink-600",
      action: () => navigate("/user/medical-records"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
          <p className="text-gray-600">Chào mừng bạn quay lại. Cùng kiểm tra lịch & thông báo nhé!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointments */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <Calendar className="text-blue-600" />
                <h2 className="text-lg font-semibold">Lịch hẹn sắp tới</h2>
              </div>
              <button
                onClick={() => navigate("/user/appointments")}
                className="text-blue-600 hover:underline text-sm"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Không có lịch hẹn nào</p>
              ) : (
                <>
                  {upcomingAppointments.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => navigate("/user/appointments")}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <Calendar className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {item.serviceId?.serviceName ?? "Dịch vụ"}
                        </h4>
                        <div className="text-sm text-gray-500 flex gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(item.bookingDate).toLocaleDateString("vi-VN")} - {item.startTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {item.doctorName}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${item.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                          }`}
                      >
                        {item.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                      </div>
                    </div>
                  ))}
                  {upcomingAppointments.length > 5 && (
                    <button
                      onClick={() => navigate("/user/appointments")}
                      className="w-full mt-2 text-blue-600 hover:underline text-sm text-center"
                    >
                      Xem thêm lịch hẹn
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <Bell className="text-amber-600" />
                <h2 className="text-lg font-semibold">Thông báo</h2>
              </div>
              <button
                onClick={() => navigate("/user/notifications")}
                className="text-amber-600 hover:underline text-sm"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {displayedNotifications.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Không có thông báo</p>
              ) : (
                <>
                  {displayedNotifications.map((noti: Notification) => (
                    <div
                      key={noti._id}
                      className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Bell className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{noti.notiName}</p>
                        <p className="text-sm text-gray-600">{noti.notiDescription}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(noti.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {notifications.length > 5 && (
                    <button
                      onClick={() => navigate("/user/notifications")}
                      className="w-full mt-2 text-amber-600 hover:underline text-sm text-center"
                    >
                      Xem thêm thông báo
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, i) => (
              <div
                key={i}
                onClick={action.action}
                className="p-6 bg-white rounded-2xl shadow border hover:shadow-lg transition cursor-pointer flex items-center gap-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                  <action.icon className="text-white w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;