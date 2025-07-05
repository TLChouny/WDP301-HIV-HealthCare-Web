import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useArv } from '../../context/ArvContext';
import type { ARVRegimen } from '../../types/arvRegimen';

const ARVProtocolManagement: React.FC = () => {
  const { getAll, create, update, remove } = useArv();

  const [search, setSearch] = useState('');
  const [protocols, setProtocols] = useState<ARVRegimen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<ARVRegimen | null>(null);
  const [formData, setFormData] = useState<ARVRegimen>({
    arvName: '',
    arvDescription: '',
    drugs: [],
    dosages: [],
    contraindications: [],
    sideEffects: [],
  });

  const fetchProtocols = async () => {
    try {
      const data = await getAll();
      setProtocols(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProtocols();
    // eslint-disable-next-line
  }, []);

  const filtered = protocols.filter(
    (p) =>
      p.arvName.toLowerCase().includes(search.toLowerCase()) ||
      (p.arvDescription || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!formData.arvName || !formData.arvDescription) {
      alert('Vui lòng nhập đầy đủ');
      return;
    }

    const payload = {
      ...formData,
      drugs: formData.drugs.filter((line) => line.trim() !== ''),
      dosages: formData.dosages.filter((line) => line.trim() !== ''),
      contraindications: formData.contraindications.filter((line) => line.trim() !== ''),
      sideEffects: formData.sideEffects.filter((line) => line.trim() !== ''),
    };

    try {
      if (editingProtocol && editingProtocol._id) {
        await update(editingProtocol._id, payload);
      } else {
        await create(payload);
      }
      setIsModalOpen(false);
      setEditingProtocol(null);
      resetForm();
      fetchProtocols();
    } catch (err: any) {
      alert(`Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      arvName: '',
      arvDescription: '',
      drugs: [],
      dosages: [],
      contraindications: [],
      sideEffects: [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await remove(id);
      fetchProtocols();
    } catch {
      alert('Xoá thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Quản lý Phác đồ ARV</h1>
        <button
          onClick={() => {
            setEditingProtocol(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm phác đồ
        </button>
      </div>

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((protocol) => (
          <div key={protocol._id} className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-blue-700">{protocol.arvName}</h2>
            <p className="text-sm text-gray-600 mt-1 mb-3 whitespace-pre-line">
              {protocol.arvDescription || 'Phác đồ điều trị ARV thường dùng trong cộng đồng'}
            </p>
            <div className="text-sm text-gray-700">
              <h3 className="font-medium text-blue-600 mt-2">Thuốc trong phác đồ:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {protocol.drugs.map((drug, i) => (
                  <li key={i}>{drug}</li>
                ))}
              </ul>

              <h3 className="font-medium text-blue-600 mt-2">Liều dùng:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {protocol.dosages.map((dosage, i) => (
                  <li key={i}>{dosage}</li>
                ))}
              </ul>

              <h3 className="font-medium text-blue-600 mt-2">Chống chỉ định:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {protocol.contraindications.map((contra, i) => (
                  <li key={i}>{contra}</li>
                ))}
              </ul>

              <h3 className="font-medium text-blue-600 mt-2">Tác dụng phụ:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {protocol.sideEffects.map((effect, i) => (
                  <li key={i}>{effect}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setEditingProtocol(protocol);
                  setFormData(protocol);
                  setIsModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(protocol._id!)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
              {editingProtocol ? 'Chỉnh sửa phác đồ' : 'Thêm phác đồ mới'}
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên phác đồ</label>
                <input
                  value={formData.arvName}
                  onChange={(e) => setFormData({ ...formData, arvName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.arvDescription}
                  onChange={(e) => setFormData({ ...formData, arvDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                />
              </div>
              {(['drugs', 'dosages', 'contraindications', 'sideEffects'] as const).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                  <textarea
                    value={formData[key].join('\n')}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value.split('\n') })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProtocol(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARVProtocolManagement;