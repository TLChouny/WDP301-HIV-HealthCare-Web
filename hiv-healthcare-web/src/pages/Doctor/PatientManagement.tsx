import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit, Trash2, Calendar, Clock, FileText
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types/booking';

const PatientManagement: React.FC = () => {
  const { getByDoctorName } = useBooking();
  const { user } = useAuth(); // user là bác sĩ đăng nhập
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (user && user.userName) {
        setLoading(true);
        try {
          const res = await getByDoctorName(user.userName);
          setBookings(res);
        } catch (error) {
          setBookings([]);
        }
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, getByDoctorName]);

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = search.toLowerCase();
    return (
      booking.serviceId.serviceName?.toLowerCase().includes(searchLower) ||
      booking.bookingCode?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm theo mã đặt lịch hoặc tên dịch vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Thêm lịch hẹn</span>
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.userId.userName}</div>
                      <div className="text-sm text-gray-500">{booking.serviceId.serviceDescription}</div>
                      <div className="text-sm text-gray-400">Mã đặt: {booking.bookingCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-green-600" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        Thời lượng: {booking.duration} phút
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.serviceId.price} {booking.currency || 'VND'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      Không có lịch hẹn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
