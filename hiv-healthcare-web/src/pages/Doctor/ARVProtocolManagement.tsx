import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface ARVProtocol {
  id: string;
  name: string;
  description: string;
}

const ARVProtocolManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProtocol, setEditingProtocol] = useState<ARVProtocol | null>(null);

  const protocols: ARVProtocol[] = [
    {
      id: '1',
      name: 'TDF + 3TC + DTG',
      description: 'Phác đồ điều trị ARV chuẩn cho người lớn',
    },
    {
      id: '2',
      name: 'TDF + 3TC + EFV',
      description: 'Phác đồ thay thế cho phụ nữ mang thai',
    },
    {
      id: '3',
      name: 'ABC + 3TC + LPV/r',
      description: 'Phác đồ điều trị cho trẻ em',
    }
  ];

  const filteredProtocols = protocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(search.toLowerCase()) ||
    protocol.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phác đồ ARV</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và tùy chỉnh các phác đồ điều trị ARV
          </p>
        </div>

        {/* Search & Add */}
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

        {/* Protocols Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên phác đồ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProtocols.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">Không có phác đồ nào</td>
                  </tr>
                )}
                {filteredProtocols.map((protocol) => (
                  <tr key={protocol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{protocol.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{protocol.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setEditingProtocol(protocol);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa phác đồ này?')) {
                              // TODO: Xử lý xóa
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
      </div>

      {/* Modal for Add/Edit Protocol */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg">
            <h2 className="text-xl font-bold mb-6">
              {editingProtocol ? 'Chỉnh sửa phác đồ' : 'Thêm phác đồ mới'}
            </h2>
            <form className="space-y-5">
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
            </form>
            <div className="flex justify-end space-x-2 mt-8">
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