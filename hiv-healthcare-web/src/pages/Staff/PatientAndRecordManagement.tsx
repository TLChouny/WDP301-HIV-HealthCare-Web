import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, FileText, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResult } from '../../context/ResultContext';
import type { User } from '../../types/user';
import type { Result } from '../../types/result';

const StaffPatientAndRecordManagement: React.FC = () => {
  const { getAllUsers, isAuthenticated } = useAuth();
  const { results, getResultsByUserId, loading: resultsLoading } = useResult();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'patients' | 'records'>('patients');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError('Vui lòng đăng nhập để xem danh sách bệnh nhân.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const usersData = await getAllUsers();
        const filteredUsers = usersData.filter((user: User) => user.role === 'user');
        setUsers(filteredUsers);
        setError(null);
      } catch (err: any) {
        setError(`Không thể tải danh sách bệnh nhân: ${err.message}`);
        console.error('Lỗi khi lấy danh sách người dùng:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, getAllUsers]);

  // Fetch results khi chọn user và tab records
  useEffect(() => {
    let isMounted = true;
    if (activeTab === 'records' && selectedUser) {
      setLoading(true);
      setError(null);
      getResultsByUserId(selectedUser._id)
        .then(() => {
          if (isMounted) setLoading(false);
        })
        .catch((err: any) => {
          if (isMounted) {
            setError(`Không thể tải hồ sơ bệnh án: ${err.response?.data?.message || err.message}`);
            setLoading(false);
          }
        });
    } else if (activeTab === 'records' && !selectedUser) {
      setError('Vui lòng chọn một bệnh nhân để xem hồ sơ bệnh án.');
      if (isMounted) setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, selectedUser, getResultsByUserId]);

  const getRecordStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: 'Đang điều trị',
          color: 'bg-green-100 text-green-800',
        };
      case 'archived':
        return {
          icon: <FileText className="w-4 h-4 text-gray-600" />,
          text: 'Đã lưu trữ',
          color: 'bg-gray-100 text-gray-800',
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          text: 'Chờ xử lý',
          color: 'bg-yellow-100 text-yellow-800',
        };
      default:
        return {
          icon: null,
          text: status || 'Không xác định',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân và Hồ sơ Bệnh án</h1>
          <p className="mt-2 text-sm text-gray-600">Quản lý thông tin bệnh nhân và hồ sơ bệnh án</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('patients');
                  setSelectedUser(null); // Xóa selectedUser khi quay lại patients
                  setError(null);
                }}
                className={`${
                  activeTab === 'patients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Danh sách Bệnh nhân
              </button>
              <button
                onClick={() => setActiveTab('records')}
                disabled={!selectedUser}
                className={`${
                  activeTab === 'records' && selectedUser
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${!selectedUser ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Hồ sơ Bệnh án
              </button>
            </nav>
          </div>
        </div>

        {/* Loading and Error States */}
        {(loading || resultsLoading) && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <span className="mt-2 text-gray-600">Đang tải...</span>
          </div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 bg-red-50 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Patient List */}
        {!loading && !resultsLoading && !error && activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.userName || 'Không xác định'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone_number || 'N/A'}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              console.log("Selected user:", user);
                              setSelectedUser(user);
                              setActiveTab('records');
                              setError(null);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy bệnh nhân.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Record List */}
        {!loading && !resultsLoading && !error && activeTab === 'records' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chẩn đoán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phác đồ điều trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.length > 0 ? (
                    results.map((result) => {
                      const status = getRecordStatusInfo(result.bookingId?.status || 'pending');
                      return (
                        <tr key={result._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {selectedUser?.userName || 'Không xác định'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Mã BN: {result.bookingId?.userId?._id || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>Ngày khám: {new Date(result.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{result.resultName || 'Không có'}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              Mô tả: {result.resultDescription || 'Không có'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {result.arvregimenId?.arvName || 'Không có phác đồ'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                              <div className="flex items-center space-x-1">
                                {status.icon}
                                <span>{status.text}</span>
                              </div>
                            </span>
                            <div className="text-sm text-gray-500 mt-1">
                              Tái khám: {new Date(result.reExaminationDate).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        {selectedUser ? 'Không tìm thấy hồ sơ bệnh án.' : 'Vui lòng chọn một bệnh nhân để xem hồ sơ.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPatientAndRecordManagement;