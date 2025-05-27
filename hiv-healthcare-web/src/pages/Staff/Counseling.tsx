import React, { useState } from 'react';
import { 
  Video,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plus
} from 'lucide-react';

interface CounselingSession {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetLink: string;
  notes?: string;
}

const StaffCounseling: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const sessions: CounselingSession[] = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      patientId: 'BN001',
      date: '2024-03-25',
      time: '09:00',
      duration: '30 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Tư vấn về chế độ dinh dưỡng'
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      patientId: 'BN002',
      date: '2024-03-25',
      time: '10:00',
      duration: '45 phút',
      status: 'in-progress',
      meetLink: 'https://meet.google.com/xyz-uvw-123',
      notes: 'Tư vấn tâm lý'
    }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'in-progress', label: 'Đang diễn ra' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          icon: <Calendar className="w-4 h-4 text-blue-600" />,
          text: 'Đã lên lịch',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'in-progress':
        return {
          icon: <Video className="w-4 h-4 text-green-600" />,
          text: 'Đang diễn ra',
          color: 'bg-green-100 text-green-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-gray-600" />,
          text: 'Đã hoàn thành',
          color: 'bg-gray-100 text-gray-800'
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

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = 
      session.patientName.toLowerCase().includes(search.toLowerCase()) ||
      session.patientId.toLowerCase().includes(search.toLowerCase());
    const matchesDate = !selectedDate || session.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || session.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tư vấn trực tuyến</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và thực hiện các buổi tư vấn trực tuyến với bệnh nhân
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Tạo lịch tư vấn mới</span>
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => {
                  const status = getStatusInfo(session.status);
                  return (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session.patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Mã BN: {session.patientId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{session.time} ({session.duration})</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          <div className="flex items-center space-x-1">
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {session.notes}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {session.status === 'scheduled' && (
                            <button className="text-green-600 hover:text-green-900">
                              <Video className="w-5 h-5" />
                            </button>
                          )}
                          {session.status === 'in-progress' && (
                            <button className="text-red-600 hover:text-red-900">
                              <Phone className="w-5 h-5" />
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-900">
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCounseling; 