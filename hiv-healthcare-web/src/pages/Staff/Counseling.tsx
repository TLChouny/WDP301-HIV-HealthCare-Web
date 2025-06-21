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
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';

// Interface cho dữ liệu booking từ API
interface Booking {
  _id: string;
  bookingCode: string;
  customerName: string;
  serviceId: {
    serviceName: string;
  };
  bookingDate: string;
  startTime: string;
  doctorName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  meetLink?: string;
}

const StaffCounseling: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  
  // State cho modal
  const [showMeetLinkModal, setShowMeetLinkModal] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [meetLinkInput, setMeetLinkInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Lấy dữ liệu booking từ API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/bookings');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu lịch hẹn');
        }
        const data = await response.json();
        // Bỏ lọc để hiển thị tất cả các lịch hẹn
        setBookings(data);
      } catch (err: any) {
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
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Thêm Authorization header nếu API yêu cầu
          // 'Authorization': `Bearer ${your_token}`
        },
        body: JSON.stringify({ meetLink: meetLinkInput }),
      });

      if (!response.ok) {
        throw new Error('Cập nhật link thất bại.');
      }

      // Cập nhật lại state và đóng modal
      setBookings(prev =>
        prev.map(b => (b._id === selectedBooking._id ? { ...b, meetLink: meetLinkInput } : b))
      );
      toast.success('Đã cập nhật link Google Meet thành công!');
      setShowMeetLinkModal(false);
      setSelectedBooking(null);
      setMeetLinkInput('');

    } catch (err: any) {
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
    booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
    booking.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    booking.bookingCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tư vấn trực tuyến</h1>
          <p className="mt-2 text-sm text-gray-600">
            Thêm link Google Meet và quản lý các buổi tư vấn đã được xác nhận.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bệnh nhân, bác sĩ, hoặc mã lịch hẹn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {loading && <div className="text-center py-4">Đang tải dữ liệu...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân & Bác sĩ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ & Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link Google Meet</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{booking.customerName}</div>
                        <div className="text-sm text-gray-500 mt-1">BS: {booking.doctorName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-600">{booking.serviceId.serviceName}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(booking.bookingDate).toLocaleDateString('vi-VN')} - {booking.startTime}
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
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                  <div className="text-center p-6 text-gray-500">
                      Không tìm thấy lịch hẹn nào phù hợp.
                  </div>
              )}
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
                <p className="text-sm">
                  Cung cấp link Google Meet cho buổi tư vấn của bệnh nhân <span className="font-semibold">{selectedBooking.customerName}</span> với bác sĩ <span className="font-semibold">{selectedBooking.doctorName}</span>.
                </p>
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