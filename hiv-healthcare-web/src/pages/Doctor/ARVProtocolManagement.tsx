import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface ARVProtocol {
  _id: string;
  arvName: string;
  arvDescription: string;
}

const API_BASE = 'http://localhost:5000/api/arvrregimens';

const ARVProtocolManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<ARVProtocol | null>(null);
  const [protocols, setProtocols] = useState<ARVProtocol[]>([]);
  const [formData, setFormData] = useState({
    arvName: '',
    arvDescription: '',
  });

  const token = localStorage.getItem('token'); // ✅ lấy token từ localStorage

  const fetchProtocols = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setProtocols(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  const filteredProtocols = protocols.filter((protocol) =>
    protocol.arvName.toLowerCase().includes(search.toLowerCase()) ||
    protocol.arvDescription.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!formData.arvName.trim() || !formData.arvDescription.trim()) {
      alert('Vui lòng nhập đầy đủ tên và mô tả');
      return;
    }

    const method = editingProtocol ? 'PUT' : 'POST';
    const url = editingProtocol ? `${API_BASE}/${editingProtocol._id}` : API_BASE;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ GỬI TOKEN Ở ĐÂY
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingProtocol(null);
      setFormData({ arvName: '', arvDescription: '' });
      fetchProtocols();
    } else {
      const err = await res.json();
      alert(`Lưu thất bại: ${err.message || res.statusText}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phác đồ này?')) return;

    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // ✅ GỬI TOKEN KHI XOÁ
      },
    });

    if (res.ok) fetchProtocols();
    else alert('Xóa thất bại!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phác đồ ARV</h1>
          <p className="mt-2 text-sm text-gray-600">Quản lý và tùy chỉnh các phác đồ điều trị ARV</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => {
                setEditingProtocol(null);
                setFormData({ arvName: '', arvDescription: '' });
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Thêm phác đồ</span>
            </button>
          </div>
        </div>

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
                  <tr key={protocol._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{protocol.arvName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{protocol.arvDescription}</td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setEditingProtocol(protocol);
                            setFormData({
                              arvName: protocol.arvName,
                              arvDescription: protocol.arvDescription,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(protocol._id)}
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

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg">
            <h2 className="text-xl font-bold mb-6">
              {editingProtocol ? 'Chỉnh sửa phác đồ' : 'Thêm phác đồ mới'}
            </h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phác đồ *</label>
                <input
                  type="text"
                  value={formData.arvName}
                  onChange={(e) => setFormData({ ...formData, arvName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: TDF + 3TC + DTG"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả *</label>
                <textarea
                  value={formData.arvDescription}
                  onChange={(e) => setFormData({ ...formData, arvDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mô tả phác đồ điều trị"
                  required
                />
              </div>
            </form>
            <div className="flex justify-end space-x-2 mt-8">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProtocol(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSave}
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
