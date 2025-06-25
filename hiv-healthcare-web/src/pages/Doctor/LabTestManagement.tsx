import React, { useEffect, useState } from 'react';
import { Search, RotateCw } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types/booking';

const STATUS_LIST: (Booking['status'] | 'all')[] = [
  'all',
  'pending',
  'confirmed',
  'checked-in',
  'completed',
  'cancelled',
];

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'checked-in':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Đang chờ';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'checked-in':
      return 'Đã đến';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

const LabTestManagement: React.FC = () => {
  const { getByDoctorName, update } = useBooking();
  const { user } = useAuth();
  const doctorName = user?.userName || '';

  const [labTests, setLabTests] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Booking['status']>('all');
  const [loading, setLoading] = useState(false);

  const fetchLabTests = async () => {
    if (!doctorName) return;
    setLoading(true);
    try {
      const data = await getByDoctorName(doctorName);
      setLabTests(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xét nghiệm:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTest = async (id: string) => {
    try {
      await update(id, { status: 'completed' });
      fetchLabTests();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
    }
  };

  useEffect(() => {
    fetchLabTests();
  }, [doctorName]);

  const filteredTests = labTests.filter((test) => {
    const matchesSearch =
      test.customerName.toLowerCase().includes(search.toLowerCase()) ||
      test.serviceId?.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || test.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl w-full ml-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Xét nghiệm</h1>

        {/* Bộ lọc */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc loại xét nghiệm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {STATUS_LIST.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'Tất cả trạng thái' : getStatusText(status)}
              </option>
            ))}
          </select>

          <button
            onClick={fetchLabTests}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <RotateCw className="w-4 h-4" />
            Tải lại
          </button>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại xét nghiệm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày xét nghiệm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-blue-500 font-medium">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{test.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.serviceId?.serviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(test.bookingDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(test.status)}`}>
                        {getStatusText(test.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:underline mr-3"
                        onClick={() => alert(`Xem chi tiết xét nghiệm của ${test.customerName}`)}
                      >
                        Xem chi tiết
                      </button>
                      {test.status !== 'completed' && test.status !== 'cancelled' && (
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => completeTest(test._id!)}
                        >
                          Hoàn thành
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabTestManagement;
