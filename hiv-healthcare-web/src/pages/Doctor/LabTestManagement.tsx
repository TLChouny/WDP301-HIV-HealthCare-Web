import React, { useState } from 'react';
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download
} from 'lucide-react';

interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  testDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  results?: {
    value: string;
    unit: string;
    referenceRange: string;
    interpretation: string;
  }[];
  notes?: string;
  doctorId: string;
  doctorName: string;
  priority: 'normal' | 'urgent';
  attachments?: string[];
}

const LabTestManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);

  const labTests: LabTest[] = [
    {
      id: '1',
      patientId: 'P001',
      patientName: 'Nguyễn Văn A',
      testType: 'CD4 Count',
      testDate: '2024-03-15',
      status: 'completed',
      results: [
        {
          value: '350',
          unit: 'cells/mm³',
          referenceRange: '500-1500',
          interpretation: 'Giảm nhẹ'
        }
      ],
      notes: 'Bệnh nhân cần theo dõi sát',
      doctorId: 'D001',
      doctorName: 'BS. Trần Văn B',
      priority: 'normal',
      attachments: ['cd4_result.pdf']
    },
    {
      id: '2',
      patientId: 'P002',
      patientName: 'Trần Thị C',
      testType: 'Viral Load',
      testDate: '2024-03-16',
      status: 'pending',
      doctorId: 'D001',
      doctorName: 'BS. Trần Văn B',
      priority: 'urgent'
    },
    {
      id: '3',
      patientId: 'P003',
      patientName: 'Lê Văn D',
      testType: 'Hepatitis B',
      testDate: '2024-03-14',
      status: 'completed',
      results: [
        {
          value: 'Negative',
          unit: '',
          referenceRange: 'Negative',
          interpretation: 'Không phát hiện'
        }
      ],
      doctorId: 'D001',
      doctorName: 'BS. Trần Văn B',
      priority: 'normal'
    }
  ];

  const testTypes = [
    'CD4 Count',
    'Viral Load',
    'Hepatitis B',
    'Hepatitis C',
    'Syphilis',
    'Tuberculosis',
    'Complete Blood Count',
    'Liver Function',
    'Kidney Function',
    'Lipid Profile'
  ];

  const statuses = ['all', 'pending', 'completed', 'cancelled'];
  const priorities = ['all', 'normal', 'urgent'];

  const filteredTests = labTests.filter((test) => {
    const matchesSearch = 
      test.patientName.toLowerCase().includes(search.toLowerCase()) ||
      test.testType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || test.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || test.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
        return 'Đang chờ kết quả';
      case 'completed':
        return 'Đã có kết quả';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Khẩn cấp';
      case 'normal':
        return 'Bình thường';
      default:
        return priority;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Xét nghiệm</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi các xét nghiệm của bệnh nhân
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên bệnh nhân hoặc loại xét nghiệm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tất cả trạng thái' : getStatusText(status)}
                  </option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority === 'all' ? 'Tất cả độ ưu tiên' : getPriorityText(priority)}
                  </option>
                ))}
              </select>
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => {
                setEditingTest(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Thêm xét nghiệm</span>
            </button>
          </div>
        </div>

        {/* Tests List */}
        <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{test.patientName}</div>
                    <div className="text-sm text-gray-500">ID: {test.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{test.testType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{test.testDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                      {getStatusText(test.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(test.priority)}`}>
                      {getPriorityText(test.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setEditingTest(test);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {test.status === 'completed' && (
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa xét nghiệm này?')) {
                            console.log('Delete test:', test.id);
                          }
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Test */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingTest ? 'Chỉnh sửa xét nghiệm' : 'Thêm xét nghiệm mới'}
            </h2>
            
            <form className="space-y-4">
              {/* Bệnh nhân */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nhân *
                </label>
                <select
                  defaultValue={editingTest?.patientId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn bệnh nhân</option>
                  <option value="P001">Nguyễn Văn A (P001)</option>
                  <option value="P002">Trần Thị C (P002)</option>
                  <option value="P003">Lê Văn D (P003)</option>
                </select>
              </div>

              {/* Loại xét nghiệm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại xét nghiệm *
                </label>
                <select
                  defaultValue={editingTest?.testType}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn loại xét nghiệm</option>
                  {testTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Ngày xét nghiệm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày xét nghiệm *
                </label>
                <input
                  type="date"
                  defaultValue={editingTest?.testDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Độ ưu tiên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ ưu tiên *
                </label>
                <select
                  defaultValue={editingTest?.priority || 'normal'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="normal">Bình thường</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  defaultValue={editingTest?.notes}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Nhập ghi chú nếu cần"
                />
              </div>

              {/* Kết quả xét nghiệm (chỉ hiển thị khi chỉnh sửa và đã có kết quả) */}
              {editingTest?.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kết quả xét nghiệm
                  </label>
                  <div className="space-y-2">
                    {editingTest.results?.map((result, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          defaultValue={result.value}
                          placeholder="Giá trị"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          defaultValue={result.unit}
                          placeholder="Đơn vị"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          defaultValue={result.referenceRange}
                          placeholder="Khoảng tham chiếu"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          defaultValue={result.interpretation}
                          placeholder="Diễn giải"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  // TODO: Implement save functionality
                  setIsModalOpen(false);
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTestManagement;