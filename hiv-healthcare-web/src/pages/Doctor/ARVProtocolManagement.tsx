import React, { useState } from 'react';
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Pill,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface ARVProtocol {
  id: string;
  name: string;
  description: string;
  medications: string[];
  category: 'adult' | 'pregnant' | 'pediatric';
  status: 'active' | 'inactive';
  contraindications?: string[];
  sideEffects?: string[];
  dosage?: {
    morning?: string;
    evening?: string;
    special?: string;
  };
}

const ARVProtocolManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProtocol, setEditingProtocol] = useState<ARVProtocol | null>(null);

  const protocols: ARVProtocol[] = [
    {
      id: '1',
      name: 'TDF + 3TC + DTG',
      description: 'Phác đồ điều trị ARV chuẩn cho người lớn',
      medications: ['Tenofovir (TDF)', 'Lamivudine (3TC)', 'Dolutegravir (DTG)'],
      category: 'adult',
      status: 'active',
      contraindications: [
        'Suy thận nặng',
        'Dị ứng với bất kỳ thành phần nào của thuốc'
      ],
      sideEffects: [
        'Buồn nôn',
        'Đau đầu',
        'Mệt mỏi'
      ],
      dosage: {
        morning: '1 viên TDF/3TC + 1 viên DTG',
        evening: '1 viên DTG'
      }
    },
    {
      id: '2',
      name: 'TDF + 3TC + EFV',
      description: 'Phác đồ thay thế cho phụ nữ mang thai',
      medications: ['Tenofovir (TDF)', 'Lamivudine (3TC)', 'Efavirenz (EFV)'],
      category: 'pregnant',
      status: 'active',
      contraindications: [
        'Rối loạn tâm thần',
        'Dị ứng với EFV'
      ],
      sideEffects: [
        'Chóng mặt',
        'Rối loạn giấc ngủ',
        'Phát ban'
      ],
      dosage: {
        evening: '1 viên TDF/3TC + 1 viên EFV'
      }
    },
    {
      id: '3',
      name: 'ABC + 3TC + LPV/r',
      description: 'Phác đồ điều trị cho trẻ em',
      medications: ['Abacavir (ABC)', 'Lamivudine (3TC)', 'Lopinavir/ritonavir (LPV/r)'],
      category: 'pediatric',
      status: 'active',
      contraindications: [
        'Dị ứng với ABC',
        'Suy gan nặng'
      ],
      sideEffects: [
        'Tiêu chảy',
        'Buồn nôn',
        'Tăng mỡ máu'
      ],
      dosage: {
        morning: 'Theo cân nặng',
        evening: 'Theo cân nặng'
      }
    }
  ];

  const categories = ['all', 'adult', 'pregnant', 'pediatric'];
  const statuses = ['all', 'active', 'inactive'];

  const filteredProtocols = protocols.filter((protocol) => {
    const matchesSearch = 
      protocol.name.toLowerCase().includes(search.toLowerCase()) ||
      protocol.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || protocol.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || protocol.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'adult':
        return 'Người lớn';
      case 'pregnant':
        return 'Phụ nữ mang thai';
      case 'pediatric':
        return 'Trẻ em';
      default:
        return category;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang sử dụng';
      case 'inactive':
        return 'Không sử dụng';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phác đồ ARV</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và tùy chỉnh các phác đồ điều trị ARV
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mô tả..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tất cả đối tượng' : getCategoryText(category)}
                  </option>
                ))}
              </select>
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
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => {
                setEditingProtocol(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Thêm phác đồ</span>
            </button>
          </div>
        </div>

        {/* Protocols List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProtocols.map((protocol) => (
            <div key={protocol.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(protocol.status)}`}>
                  {getStatusText(protocol.status)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{protocol.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Thuốc trong phác đồ:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {protocol.medications.map((med, index) => (
                      <li key={index}>{med}</li>
                    ))}
                  </ul>
                </div>

                {protocol.dosage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Liều dùng:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {protocol.dosage.morning && (
                        <li className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                          Sáng: {protocol.dosage.morning}
                        </li>
                      )}
                      {protocol.dosage.evening && (
                        <li className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                          Tối: {protocol.dosage.evening}
                        </li>
                      )}
                      {protocol.dosage.special && (
                        <li className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                          Đặc biệt: {protocol.dosage.special}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {protocol.contraindications && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Chống chỉ định:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {protocol.contraindications.map((contra, index) => (
                        <li key={index}>{contra}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {protocol.sideEffects && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tác dụng phụ:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {protocol.sideEffects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button 
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center"
                  onClick={() => {
                    setEditingProtocol(protocol);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Chỉnh sửa
                </button>
                <button 
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                  onClick={() => {
                    // TODO: Implement delete functionality
                    if (window.confirm('Bạn có chắc chắn muốn xóa phác đồ này?')) {
                      console.log('Delete protocol:', protocol.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit Protocol */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProtocol ? 'Chỉnh sửa phác đồ' : 'Thêm phác đồ mới'}
            </h2>
            
            <form className="space-y-4">
              {/* Tên phác đồ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên phác đồ *
                </label>
                <input
                  type="text"
                  defaultValue={editingProtocol?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: TDF + 3TC + DTG"
                  required
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  defaultValue={editingProtocol?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mô tả ngắn gọn về phác đồ"
                  required
                />
              </div>

              {/* Đối tượng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đối tượng *
                </label>
                <select
                  defaultValue={editingProtocol?.category || 'adult'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="adult">Người lớn</option>
                  <option value="pregnant">Phụ nữ mang thai</option>
                  <option value="pediatric">Trẻ em</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái *
                </label>
                <select
                  defaultValue={editingProtocol?.status || 'active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="active">Đang sử dụng</option>
                  <option value="inactive">Không sử dụng</option>
                </select>
              </div>

              {/* Thuốc trong phác đồ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thuốc trong phác đồ *
                </label>
                <div className="space-y-2">
                  {editingProtocol?.medications.map((med, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={med}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tên thuốc"
                        required
                      />
                      <button
                        type="button"
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm thuốc
                  </button>
                </div>
              </div>

              {/* Liều dùng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liều dùng
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Buổi sáng</label>
                    <input
                      type="text"
                      defaultValue={editingProtocol?.dosage?.morning}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ví dụ: 1 viên TDF/3TC + 1 viên DTG"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Buổi tối</label>
                    <input
                      type="text"
                      defaultValue={editingProtocol?.dosage?.evening}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ví dụ: 1 viên DTG"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Liều đặc biệt</label>
                    <input
                      type="text"
                      defaultValue={editingProtocol?.dosage?.special}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ví dụ: Theo cân nặng"
                    />
                  </div>
                </div>
              </div>

              {/* Chống chỉ định */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chống chỉ định
                </label>
                <div className="space-y-2">
                  {editingProtocol?.contraindications?.map((contra, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={contra}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Chống chỉ định"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm chống chỉ định
                  </button>
                </div>
              </div>

              {/* Tác dụng phụ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tác dụng phụ
                </label>
                <div className="space-y-2">
                  {editingProtocol?.sideEffects?.map((effect, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={effect}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tác dụng phụ"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm tác dụng phụ
                  </button>
                </div>
              </div>
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

export default ARVProtocolManagement; 