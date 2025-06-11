import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col py-10 px-4">
      <div className="w-full"> {/* Bỏ max-w-2xl mx-auto */}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Phác đồ ARV</h1>
          <p className="mt-2 text-base text-gray-600">
            Quản lý và tùy chỉnh các phác đồ điều trị ARV
          </p>
        </div>

        {/* Search & Add */}
        <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center space-x-2"
            onClick={() => {
              setEditingProtocol(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Thêm phác đồ</span>
          </button>
        </div>

        {/* Protocols Table */}
        <div className="bg-white rounded-xl shadow p-5">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên phác đồ</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProtocols.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">Không có phác đồ nào</td>
                </tr>
              )}
              {filteredProtocols.map((protocol) => (
                <tr key={protocol.id} className="border-t">
                  <td className="px-4 py-2">{protocol.name}</td>
                  <td className="px-4 py-2">{protocol.description}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center inline-flex mr-2"
                      onClick={() => {
                        setEditingProtocol(protocol);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center inline-flex"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn xóa phác đồ này?')) {
                          console.log('Delete protocol:', protocol.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Protocol */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 pt-24">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg">
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