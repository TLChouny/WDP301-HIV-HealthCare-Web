import React, { useState } from 'react';
import { useServiceContext } from '../../context/ServiceContext';

const StaffServicePackageManagement: React.FC = () => {
  const { services, refreshServices } = useServiceContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await refreshServices();
    } catch (err: any) {
      setError('Lỗi khi làm mới danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý gói dịch vụ</h1>
            <p className="mt-2 text-sm text-gray-600">
              Xem danh sách tất cả các gói dịch vụ hiện có trong hệ thống
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
            disabled={loading}
          >
            {loading ? 'Đang làm mới...' : 'Làm mới danh sách'}
          </button>
        </div>
        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        {/* Service Packages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">Không có gói dịch vụ nào.</td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.serviceName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{service.serviceDescription || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{service.price ? `${service.price} VNĐ` : '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {typeof service.categoryId === 'object' && service.categoryId?.categoryName
                          ? service.categoryId.categoryName
                          : typeof service.categoryId === 'string'
                          ? service.categoryId
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {service.price ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Có giá</span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Chưa có giá</span>
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
    </div>
  );
};

export default StaffServicePackageManagement; 