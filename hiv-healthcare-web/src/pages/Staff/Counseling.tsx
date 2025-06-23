import React, { useState, useEffect } from 'react';
import {
  Video,
  Calendar,
  Clock,
  User,
  Link,
  Copy,
  ExternalLink,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Eye,
  EyeOff,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'react-toastify';

// Interface cho dữ liệu booking từ API
interface Booking {
  _id: string;
  bookingCode: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceId: {
    serviceName: string;
  };
  bookingDate: string;
  startTime: string;
  doctorName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  meetLink?: string;
  isAnonymous?: boolean;
}

const StaffCounseling: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [showPatientInfo, setShowPatientInfo] = useState<boolean>(false);
  
  // State cho modal
  const [showMeetLinkModal, setShowMeetLinkModal] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [meetLinkInput, setMeetLinkInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Hàm ẩn danh tên bệnh nhân
  const anonymizeName = (name: string): string => {
    if (!name) return 'Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return words[0].charAt(0) + '*'.repeat(words[0].length - 1) + ' ' + 
           words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1);
  };

  // Hàm ẩn danh tên bác sĩ
  const anonymizeDoctorName = (name: string): string => {
    if (!name) return 'BS. Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return 'BS. ' + words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return 'BS. ' + words[0].charAt(0) + '*'.repeat(words[0].length - 1) + ' ' + 
           words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1);
  };

  // Hàm hiển thị thông tin bệnh nhân
  const getPatientDisplayInfo = (booking: Booking) => {
    const isAnonymous = booking.isAnonymous;
    
    if (isAnonymous) {
      // Nếu là booking ẩn danh, luôn ẩn thông tin
      return {
        name: anonymizeName(booking.customerName || ''),
        phone: '***-***-****',
        email: '***@***.***',
        doctorName: anonymizeDoctorName(booking.doctorName || '')
      };
    } else {
      // Nếu không phải ẩn danh, hiển thị theo toggle
      if (showPatientInfo) {
        return {
          name: booking.customerName || 'Không xác định',
          phone: booking.customerPhone || 'Không có',
          email: booking.customerEmail || 'Không có',
          doctorName: booking.doctorName || 'Chưa phân công'
        };
      } else {
        return {
          name: anonymizeName(booking.customerName || ''),
          phone: '***-***-****',
          email: '***@***.***',
          doctorName: anonymizeDoctorName(booking.doctorName || '')
        };
      }
    }
  };

  // Lấy dữ liệu booking từ API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching bookings from API...');
        
        const response = await fetch('http://localhost:5000/api/bookings');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('API Error:', errorData);
          throw new Error(`Không thể tải dữ liệu lịch hẹn: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Data received:', data);
        
        setBookings(data);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Hàm cập nhật link Google Meet
  const handleUpdateMeetLink = async () => {
    if (!selectedBooking || !meetLinkInput) {
      toast.warn('Vui lòng nhập link Google Meet.');
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Updating meetLink for booking:', selectedBooking._id);
      console.log('New meetLink:', meetLinkInput);
      
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetLink: meetLinkInput }),
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update error:', errorData);
        throw new Error(`Cập nhật link thất bại: ${response.status} ${response.statusText}`);
      }

      const updatedBooking = await response.json();
      console.log('Updated booking:', updatedBooking);

      setBookings(prev =>
        prev.map(b => (b._id === selectedBooking._id ? { ...b, meetLink: meetLinkInput } : b))
      );
      toast.success('Đã cập nhật link Google Meet thành công!');
      setShowMeetLinkModal(false);
      setSelectedBooking(null);
      setMeetLinkInput('');

    } catch (err: any) {
      console.error('Error updating meetLink:', err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mở modal và set dữ liệu booking được chọn
  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setMeetLinkInput(booking.meetLink || '');
    setShowMeetLinkModal(true);
  };
  
  // Lọc danh sách booking
  const filteredBookings = bookings.filter(booking =>
    (booking.customerName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (booking.doctorName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (booking.bookingCode?.toLowerCase() || '').includes(search.toLowerCase())
  );

  // Sắp xếp danh sách booking theo ngày và giờ
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    // So sánh ngày trước
    const dateA = new Date(a.bookingDate);
    const dateB = new Date(b.bookingDate);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // Nếu cùng ngày, so sánh giờ bắt đầu
    const timeA = a.startTime || '';
    const timeB = b.startTime || '';
    return timeA.localeCompare(timeB);
  });

  // Nhóm các booking theo ngày
  const groupedBookings = sortedBookings.reduce((groups, booking) => {
    const date = new Date(booking.bookingDate).toLocaleDateString('vi-VN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {} as Record<string, Booking[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Tư vấn trực tuyến</h1>
              <p className="mt-2 text-sm text-gray-600">
                Thêm link Google Meet và quản lý các buổi tư vấn. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
              </p>
            </div>
            <button
              onClick={() => setShowPatientInfo(!showPatientInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showPatientInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPatientInfo ? 'Ẩn thông tin' : 'Hiện thông tin'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã lịch hẹn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu lịch hẹn...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">Lỗi tải dữ liệu</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!loading && !error && sortedBookings.length === 0 && (
          <div className="text-center p-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Không tìm thấy lịch hẹn nào</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có lịch hẹn nào được tạo'}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              {Object.entries(groupedBookings).map(([date, dateBookings]) => (
                <div key={date} className="mb-6">
                  <div className="bg-gray-100 px-6 py-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Ngày: {date}
                    </h3>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">STT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã lịch hẹn & Thông tin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ & Thời gian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link Google Meet</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dateBookings.map((booking, index) => {
                        const patientInfo = getPatientDisplayInfo(booking);
                        return (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-blue-600">{booking.bookingCode || 'N/A'}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>Bệnh nhân: {patientInfo.name}</span>
                                  {booking.isAnonymous && (
                                    <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">Ẩn danh</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3" />
                                  <span>SĐT: {patientInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Mail className="w-3 h-3" />
                                  <span>Email: {patientInfo.email}</span>
                                </div>
                                <div className="mt-2">
                                  <span>Bác sĩ: {patientInfo.doctorName}</span>
                                </div>
                                <div className="mt-1">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {booking.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                    {booking.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                                    {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                     booking.status === 'pending' ? 'Chờ xác nhận' :
                                     booking.status === 'cancelled' ? 'Đã hủy' :
                                     booking.status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-blue-600">
                                {booking.serviceId?.serviceName || 'Không xác định'}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {booking.bookingDate ? 
                                  new Date(booking.bookingDate).toLocaleDateString('vi-VN') : 'N/A'
                                } - {booking.startTime || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {booking.meetLink ? (
                                <div className="flex items-center gap-2">
                                  <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline truncate max-w-xs">
                                    {booking.meetLink}
                                  </a>
                                  <Copy className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-600" onClick={() => { navigator.clipboard.writeText(booking.meetLink!); toast.info("Đã sao chép link!"); }} />
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">Chưa có link</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => openModal(booking)}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium"
                              >
                                Thêm/Sửa Link
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Thêm/Sửa Link Google Meet */}
        {showMeetLinkModal && selectedBooking && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Thêm Link Google Meet
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Mã lịch hẹn:</strong> {selectedBooking.bookingCode || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Bệnh nhân:</strong> {getPatientDisplayInfo(selectedBooking).name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>SĐT:</strong> {getPatientDisplayInfo(selectedBooking).phone}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Email:</strong> {getPatientDisplayInfo(selectedBooking).email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Bác sĩ:</strong> {getPatientDisplayInfo(selectedBooking).doctorName}
                  </p>
                </div>
                <div>
                  <label htmlFor="meetLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Đường dẫn Google Meet
                  </label>
                  <input
                    id="meetLink"
                    type="url"
                    value={meetLinkInput}
                    onChange={(e) => setMeetLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMeetLinkModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateMeetLink}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu và Gửi'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffCounseling; 