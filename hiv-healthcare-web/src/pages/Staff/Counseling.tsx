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
  Plus,
  Link,
  Copy,
  ExternalLink
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
  doctor?: {
    id: string;
    name: string;
    email: string;
  };
}

interface MeetLink {
  id: string;
  link: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'cancelled';
}

const StaffCounseling: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showMeetLinkModal, setShowMeetLinkModal] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [meetLink, setMeetLink] = useState<string>('');

  // Mock data for doctors
  const doctors = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      email: 'doctor.a@example.com'
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      email: 'doctor.b@example.com'
    }
  ];

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
      notes: 'Tư vấn về chế độ dinh dưỡng',
      doctor: doctors[0]
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
      notes: 'Tư vấn tâm lý',
      doctor: doctors[1]
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

  // Function to generate Google Meet link
  const generateMeetLink = async (session: CounselingSession) => {
    try {
      // In a real application, this would call your backend API
      // which would then call the Google Calendar API to create a meeting
      const mockMeetLink = `https://meet.google.com/${Math.random().toString(36).substring(7)}`;
      setMeetLink(mockMeetLink);
      
      // Update session with new meet link
      const updatedSession = {
        ...session,
        meetLink: mockMeetLink
      };
      
      // In a real application, you would save this to your database
      console.log('Generated meet link:', mockMeetLink);
      console.log('Updated session:', updatedSession);
      
      return mockMeetLink;
    } catch (error) {
      console.error('Error generating meet link:', error);
      throw error;
    }
  };

  // Function to copy meet link to clipboard
  const copyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  // Function to open meet link in new tab
  const openMeetLink = (link: string) => {
    window.open(link, '_blank');
  };

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
                            {session.doctor && (
                              <div className="text-sm text-gray-500">
                                Bác sĩ: {session.doctor.name}
                              </div>
                            )}
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
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedSession(session);
                                  setShowMeetLinkModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Tạo link Google Meet"
                              >
                                <Link className="w-5 h-5" />
                              </button>
                              {session.meetLink && (
                                <>
                                  <button 
                                    onClick={() => copyMeetLink(session.meetLink)}
                                    className="text-gray-600 hover:text-gray-900"
                                    title="Sao chép link"
                                  >
                                    <Copy className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => openMeetLink(session.meetLink)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Mở link"
                                  >
                                    <ExternalLink className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                            </>
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

        {/* Google Meet Link Modal */}
        {showMeetLinkModal && selectedSession && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tạo link Google Meet
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bệnh nhân
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSession.patientName} (Mã BN: {selectedSession.patientId})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời gian
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSession.date} - {selectedSession.time} ({selectedSession.duration})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bác sĩ
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue={selectedSession.doctor?.id || ''}
                  >
                    <option value="">Chọn bác sĩ</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowMeetLinkModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const link = await generateMeetLink(selectedSession);
                        setShowMeetLinkModal(false);
                        // You could add a success notification here
                      } catch (error) {
                        // You could add an error notification here
                        console.error('Error:', error);
                      }
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Tạo link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffCounseling; 