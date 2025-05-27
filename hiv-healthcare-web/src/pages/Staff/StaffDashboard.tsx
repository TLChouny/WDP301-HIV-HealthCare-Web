import React from 'react';
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

const StaffDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Tổng số bệnh nhân',
      value: '150',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Lịch hẹn hôm nay',
      value: '25',
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Hồ sơ bệnh án mới',
      value: '8',
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      change: '-2%',
      changeType: 'decrease'
    },
    {
      name: 'Tư vấn đang chờ',
      value: '12',
      icon: <MessageSquare className="w-6 h-6 text-yellow-600" />,
      change: '+3%',
      changeType: 'increase'
    }
  ];

  const todayAppointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '09:00',
      type: 'Khám định kỳ',
      status: 'confirmed',
      doctor: 'BS. Trần Thị B'
    },
    {
      id: 2,
      patientName: 'Trần Thị C',
      time: '10:30',
      type: 'Tư vấn',
      status: 'pending',
      doctor: 'BS. Lê Văn D'
    },
    {
      id: 3,
      patientName: 'Lê Văn E',
      time: '14:00',
      type: 'Khám mới',
      status: 'cancelled',
      doctor: 'BS. Phạm Thị F'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      title: 'Lịch hẹn mới',
      description: 'Bệnh nhân Nguyễn Văn A đã đặt lịch hẹn',
      time: '10 phút trước',
      icon: <Calendar className="w-5 h-5 text-blue-600" />
    },
    {
      id: 2,
      type: 'medical_record',
      title: 'Cập nhật hồ sơ',
      description: 'Hồ sơ bệnh án của bệnh nhân Trần Thị B đã được cập nhật',
      time: '30 phút trước',
      icon: <FileText className="w-5 h-5 text-purple-600" />
    },
    {
      id: 3,
      type: 'medication',
      title: 'Cập nhật thuốc',
      description: 'Danh sách thuốc đã được cập nhật',
      time: '1 giờ trước',
      icon: <ClipboardList className="w-5 h-5 text-green-600" />
    }
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Lịch hẹn hôm nay</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {todayAppointments.map((appointment) => {
                const status = getAppointmentStatus(appointment.status);
                return (
                  <div key={appointment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500 mt-1">{appointment.type}</p>
                        <p className="text-sm text-gray-500">Bác sĩ: {appointment.doctor}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.time}
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          <div className="flex items-center space-x-1">
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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