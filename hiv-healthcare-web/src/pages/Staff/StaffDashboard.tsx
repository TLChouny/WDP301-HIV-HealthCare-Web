import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare,
  ClipboardList,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useServiceContext } from '../../context/ServiceContext';
import { useAuth } from '../../context/AuthContext';
import { getAllPayments } from '../../api/paymentApi';
import { getNotificationsByUserId } from '../../api/notificationApi';

const StaffDashboard: React.FC = () => {
  // Contexts
  const { getAll } = useBooking();
  const { services } = useServiceContext();
  const { getAllUsers, user } = useAuth();

  // State
  const [bookings, setBookings] = useState<any[]>([]);
  const [serviceStats, setServiceStats] = useState<{serviceName: string, count: number}[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Bookings
        let bookingsData: any[] = [];
        try {
          bookingsData = await getAll();
        } catch (e) {
          bookingsData = [];
        }
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        // Users (patients)
        let usersData: any[] = [];
        try {
          usersData = await getAllUsers();
        } catch (e) {
          usersData = [];
        }
        setPatients(Array.isArray(usersData) ? usersData.filter((u: any) => u && u.role === 'user') : []);
        // Payments
        let paymentsData: any[] = [];
        try {
          paymentsData = await getAllPayments();
        } catch (e) {
          paymentsData = [];
        }
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        // Notifications (recent activities)
        if (user && user._id) {
          try {
            const notiRes = await getNotificationsByUserId(user._id);
            setNotifications(Array.isArray(notiRes?.data) ? notiRes.data : []);
          } catch (e) {
            setNotifications([]);
          }
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setBookings([]);
        setPatients([]);
        setPayments([]);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Service stats (booking theo dịch vụ)
  useEffect(() => {
    const stats: { [serviceId: string]: Set<string> } = {};
    bookings.forEach(b => {
      if (b.serviceId && b.userId && b.userId._id) {
        const id = typeof b.serviceId === 'object' ? b.serviceId._id : b.serviceId;
        if (!stats[id]) stats[id] = new Set();
        stats[id].add(b.userId._id);
      }
    });
    const result = Object.entries(stats).map(([serviceId, userSet]) => {
      const service = services.find(s => s._id === serviceId);
      return {
        serviceName: service ? service.serviceName : serviceId,
        count: userSet.size
      };
    });
    setServiceStats(result);
  }, [bookings, services]);

  // Lấy danh sách booking hôm nay
  const today = new Date();
  const todayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.bookingDate);
    return (
      bookingDate.getFullYear() === today.getFullYear() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getDate() === today.getDate()
    );
  });
  const todayUsers = Array.from(
    new Map(
      todayBookings
        .filter(b => b.userId && b.userId._id)
        .map(b => [b.userId._id, b.userId])
    ).values()
  );
  const todayUserCount = todayUsers.length;

  // Tổng doanh thu
  const totalRevenue = payments
    .filter((p: any) => p.status === 'success')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  // Thống kê
  const stats = [
    {
      name: 'Tổng số bệnh nhân',
      value: patients.length,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: '',
      changeType: 'increase'
    },
    {
      name: 'Lịch hẹn hôm nay',
      value: todayUserCount,
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      change: '',
      changeType: 'increase'
    },
    {
      name: 'Tổng doanh thu',
      value: totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      change: '',
      changeType: 'increase'
    },
    {
      name: 'Tư vấn đang chờ',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: <MessageSquare className="w-6 h-6 text-yellow-600" />,
      change: '',
      changeType: 'increase'
    }
  ];

  // Hoạt động gần đây (notifications)
  const recentActivities = Array.isArray(notifications) ? notifications.slice(0, 5).map((noti: any) => ({
    id: noti?._id || Math.random(),
    type: 'notification',
    title: noti?.notiName || 'Hoạt động',
    description: noti?.notiDescription || '',
    time: noti?.createdAt ? new Date(noti.createdAt).toLocaleString('vi-VN') : '',
    icon: <Calendar className="w-5 h-5 text-blue-600" />
  })) : [];

  const getAppointmentStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: 'Đã xác nhận',
          color: 'bg-green-100 text-green-800'
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          text: 'Chờ xác nhận',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: 'Đã hủy',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: null,
          text: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Chào mừng trở lại! Đây là tổng quan về hoạt động của bạn
          </p>
          {loading && (
            <div className="text-blue-600 mt-2">Đang tải dữ liệu...</div>
          )}
          {!loading && (bookings.length === 0 && patients.length === 0 && payments.length === 0) && (
            <div className="text-red-600 mt-2">Không thể tải dữ liệu. Vui lòng thử lại hoặc kiểm tra kết nối.</div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">so với tuần trước</span>
              </div>
            </div>
          ))}
        </div>

        {/* Thống kê booking dịch vụ */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê số lượng Bệnh nhân đã đặt lịch từng gói dịch vụ</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng user đã booking</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceStats.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-gray-400">Chưa có dữ liệu booking.</td>
                  </tr>
                ) : (
                  serviceStats.map(stat => (
                    <tr key={stat.serviceName}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.serviceName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{stat.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lịch hẹn hôm nay */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Lịch hẹn hôm nay</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {todayBookings.length === 0 ? (
                <div className="p-6 text-gray-500">Không có lịch hẹn nào hôm nay.</div>
              ) : (
                todayBookings.map((booking) => (
                  <div key={booking._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.isAnonymous
                            ? 'Ẩn danh'
                            : (booking.userId?.userName || booking.customerName || 'Không xác định')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Bác sĩ: {booking.doctorName || 'Chưa phân công'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Giờ: {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                        </p>
                      </div>
                      {(() => {
                        const status = getAppointmentStatus(booking.status);
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                            {status.icon}
                            <span className="ml-1">{status.text}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 