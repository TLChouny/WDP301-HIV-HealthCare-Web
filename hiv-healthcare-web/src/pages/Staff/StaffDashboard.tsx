import type React from "react";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  MessageSquare,
  ClipboardList,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck,
  BarChart3,
  RefreshCw,
  Ticket
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useServiceContext } from "../../context/ServiceContext";
import { useAuth } from "../../context/AuthContext";
import { getAllPayments } from "../../api/paymentApi";
import { getAllBlogs } from "../../api/blogApi";
import { Blog } from "../../types/blog";
import { getBookingStatusColor, translateBookingStatus } from "../../utils/status";

// --- HÀM HELPER MỚI ĐƯỢC THÊM VÀO ---
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined' || !html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};
// --- KẾT THÚC HÀM HELPER MỚI ---

const StaffDashboard: React.FC = () => {
  const { getAll } = useBooking();
  const { services } = useServiceContext();
  const { getAllUsers, user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [serviceStats, setServiceStats] = useState<{ serviceName: string; count: number }[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let bookingsData: any[] = [];
        try {
          bookingsData = await getAll();
        } catch (e) {
          bookingsData = [];
        }
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);

        let usersData: any[] = [];
        try {
          usersData = await getAllUsers();
        } catch (e) {
          usersData = [];
        }
        setPatients(Array.isArray(usersData) ? usersData.filter((u: any) => u && u.role === "user") : []);

        let paymentsData: any[] = [];
        try {
          paymentsData = await getAllPayments();
        } catch (e) {
          paymentsData = [];
        }
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);

        try {
          const blogsData = await getAllBlogs();
          setBlogs(Array.isArray(blogsData) ? blogsData : []);
        } catch (e) {
          setBlogs([]);
        }
      } catch (err) {
        setBookings([]);
        setPatients([]);
        setPayments([]);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const stats: { [serviceId: string]: Set<string> } = {};
    bookings.forEach((b) => {
      if (b.serviceId && b.userId && b.userId._id) {
        const id = typeof b.serviceId === "object" ? b.serviceId._id : b.serviceId;
        if (!stats[id]) stats[id] = new Set();
        stats[id].add(b.userId._id);
      }
    });

    const result = Object.entries(stats).map(([serviceId, userSet]) => {
      const service = services.find((s) => s._id === serviceId);
      return {
        serviceName: service ? service.serviceName : serviceId,
        count: userSet.size,
      };
    });

    setServiceStats(result);
  }, [bookings, services]);

  const today = new Date();
  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.bookingDate);
    return (
      bookingDate.getFullYear() === today.getFullYear() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getDate() === today.getDate()
    );
  });

  const todayUsers = Array.from(
    new Map(todayBookings.filter((b) => b.userId && b.userId._id).map((b) => [b.userId._id, b.userId])).values(),
  );

  const todayUserCount = todayUsers.length;

  const totalRevenue = payments
    .filter((p: any) => p.status === "success")
    .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

  const stats = [
    {
      name: "Tổng số bệnh nhân",
      value: patients.length,
      icon: <Users className="w-8 h-8" />,
      change: "",
      changeType: "increase",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      name: "Lịch hẹn hôm nay",
      value: todayBookings.length,
      icon: <Calendar className="w-8 h-8" />,
      change: "",
      changeType: "increase",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      name: "Tổng doanh thu",
      value: totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      icon: <DollarSign className="w-8 h-8" />,
      change: "",
      changeType: "increase",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      name: "Tư vấn đang chờ",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: <MessageSquare className="w-8 h-8" />,
      change: "",
      changeType: "increase",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const recentBlogs = Array.isArray(blogs)
    ? blogs
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
      )
      .slice(0, 5)
      .map((blog) => ({
        id: blog._id || Math.random(),
        type: "blog",
        title: blog.blogTitle || "Tin tức",
        // --- PHẦN ĐƯỢC CHỈNH SỬA ---
        description: blog.blogContent ? stripHtml(blog.blogContent) : '',
        // --- KẾT THÚC PHẦN CHỈNH SỬA ---
        time: blog.createdAt ? new Date(blog.createdAt).toLocaleString("vi-VN") : "",
        icon: <ClipboardList className="w-5 h-5 text-purple-600" />,
      }))
    : [];

  const getAppointmentStatus = (status: string) => {
    const translatedStatus = translateBookingStatus(status);
    const gradientColor = getBookingStatusColor(status);

    switch (status) {
      case "confirmed":
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: translatedStatus,
          color: `bg-green-100 text-green-800 border-green-200`,
          dotColor: `bg-gradient-to-r ${gradientColor}`,
        };
      case "pending":
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: translatedStatus,
          color: `bg-yellow-100 text-yellow-800 border-yellow-200`,
          dotColor: `bg-gradient-to-r ${gradientColor}`,
        };
      case "cancelled":
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: translatedStatus,
          color: `bg-red-100 text-red-800 border-red-200`,
          dotColor: `bg-gradient-to-r ${gradientColor}`,
        };
      default:
        return {
          icon: null,
          text: translatedStatus,
          color: `bg-gray-100 text-gray-800 border-gray-200`,
          dotColor: `bg-gradient-to-r ${gradientColor}`,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Đang tải dữ liệu...</h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                Thống kê
              </h1>
              <p className="mt-2 text-gray-600">Chào mừng trở lại! Đây là tổng quan về hoạt động của bạn hôm nay</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Xin chào,</p>
                <p className="font-semibold text-gray-900">{user?.userName || "Staff"}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.userName?.charAt(0) || "S"}
              </div>
            </div>
          </div>

          {!loading && bookings.length === 0 && patients.length === 0 && payments.length === 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-800">Không thể tải dữ liệu</h3>
                  <p className="text-sm text-red-600">Vui lòng thử lại hoặc kiểm tra kết nối mạng</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${stat.lightBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={stat.textColor}>{stat.icon}</div>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${stat.bgColor} transition-all duration-1000`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Stats Table */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Thống kê dịch vụ</h2>
            </div>
            <p className="text-blue-100 mt-1">Số lượng bệnh nhân đã đặt lịch từng gói dịch vụ</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số lượng user đã booking
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tỷ lệ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceStats.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Chưa có dữ liệu booking</p>
                        <p className="text-sm text-gray-400">Dữ liệu sẽ xuất hiện khi có booking mới</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  serviceStats.map((stat, index) => {
                    const maxCount = Math.max(...serviceStats.map((s) => s.count));
                    const percentage = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;

                    return (
                      <tr key={stat.serviceName} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-900">{stat.serviceName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-900">{stat.count}</span>
                            <span className="text-xs text-gray-500">người</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 min-w-12">{percentage.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Lịch hẹn hôm nay</h2>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white font-semibold">{todayBookings.length}</span>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {todayBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Không có lịch hẹn nào hôm nay</p>
                  <p className="text-sm text-gray-400 mt-1">Hãy nghỉ ngơi hoặc chuẩn bị cho ngày mai</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {todayBookings.map((booking, index) => {
                    const status = getAppointmentStatus(booking.status);
                    return (
                      <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-3 h-3 rounded-full ${status.dotColor}`}
                                style={{ background: `linear-gradient(to right, ${status.dotColor})` }}
                              ></div>
                              <h3 className="font-semibold text-gray-900">
                                {booking.isAnonymous
                                  ? "Ẩn danh"
                                  : booking.userId?.userName || booking.customerName || "Không xác định"}
                              </h3>
                            </div>
                            <div className="ml-6 space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Ticket className="w-4 h-4 text-teal-600" />
                                <span>Code: {booking.bookingCode || "Chưa phân công"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <UserCheck className="w-4 h-4" />
                                <span>Bác sĩ: {booking.doctorName || "Chưa phân công"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Giờ: {booking.startTime || "N/A"} - {booking.endTime || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.dotColor}`}
                          >
                            {status.icon}
                            <span className="ml-1">{status.text}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Tin tức gần đây</h2>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white font-semibold">{recentBlogs.length}</span>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {recentBlogs.length === 0 ? (
                <div className="p-8 text-center">
                  <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Chưa có tin tức nào</p>
                  <p className="text-sm text-gray-400 mt-1">Các tin tức mới sẽ xuất hiện ở đây</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentBlogs.map((blog, index) => (
                    <div key={blog.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">{blog.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{blog.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.description}</p>
                          <div className="mt-3 flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {blog.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;