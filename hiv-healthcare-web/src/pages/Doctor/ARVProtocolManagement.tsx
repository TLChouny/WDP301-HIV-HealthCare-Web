import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Pill } from 'lucide-react';
import { useArv } from '../../context/ArvContext';
import { useAuth } from '../../context/AuthContext';
import type { ARVRegimen } from '../../types/arvRegimen';

// Format frequency value (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === '') return 'Chưa có';
  const num = parseInt(freq, 10);
  return isNaN(num) ? freq : `${num} lần/ngày`;
};

const ARVProtocolManagement: React.FC = () => {
  const { getAll, create, update, remove } = useArv();
  const { getUserById } = useAuth();
  const [search, setSearch] = useState('');
  const [protocols, setProtocols] = useState<ARVRegimen[]>([]);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<ARVRegimen | null>(null);

  const [formData, setFormData] = useState<ARVRegimen>({
    arvName: '',
    arvDescription: '',
    regimenCode: '',
    treatmentLine: 'First-line',
    recommendedFor: '',
    drugs: [],
    dosages: [],
    frequency: '',
    contraindications: [],
    sideEffects: [],
  });

  const [inputTable, setInputTable] = useState<
    { drug: string; dosage: string; frequency: string; contraindication: string; sideEffect: string }[]
  >([{ drug: '', dosage: '', frequency: '', contraindication: '', sideEffect: '' }]);

  const fetchProtocols = async () => {
    try {
      const data = await getAll();
      setProtocols(data);
      // Fetch userNames for regimens with userId
      const userIds = data.filter(p => p.userId).map(p => p.userId!);
      const uniqueUserIds = [...new Set(userIds)];
      const userNamePromises = uniqueUserIds.map(async userId => {
        try {
          const user = await getUserById(userId._id);
          return { userId, userName: user?.userName || 'Unknown' };
        } catch (err) {
          console.error(`Failed to fetch userName for userId ${userId}:`, err);
          return { userId, userName: 'Unknown' };
        }
      });
      const userNameResults = await Promise.all(userNamePromises);
      const userNameMap = userNameResults.reduce((acc, { userId, userName }) => {
        acc[userId._id] = userName;
        return acc;
      }, {} as { [userId: string]: string });
      setUserNames(userNameMap);
    } catch (err) {
      console.error('Failed to fetch protocols:', err);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  const filtered = protocols.filter(
    p =>
      p.arvName.toLowerCase().includes(search.toLowerCase()) ||
      (p.arvDescription || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!formData.arvName || !formData.arvDescription) {
      alert('Vui lòng nhập đầy đủ tên và mô tả');
      return;
    }

    const payload = {
      ...formData,
      drugs: inputTable.map(r => r.drug).filter(v => v.trim() !== ''),
      dosages: inputTable.map(r => r.dosage).filter(v => v.trim() !== ''),
      frequency: inputTable.map(r => r.frequency).filter(v => v.trim() !== '').join(';'),
      contraindications: inputTable.map(r => r.contraindication).filter(v => v.trim() !== ''),
      sideEffects: inputTable.map(r => r.sideEffect).filter(v => v.trim() !== ''),
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
      regimenCode: '',
      treatmentLine: 'First-line',
      recommendedFor: '',
      drugs: [],
      dosages: [],
      frequency: '',
      contraindications: [],
      sideEffects: [],
    });
    setInputTable([{ drug: '', dosage: '', frequency: '', contraindication: '', sideEffect: '' }]);
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
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(protocol => (
          <div key={protocol._id} className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-blue-700">{protocol.arvName}</h2>
            <p className="text-sm text-gray-600 mt-1 mb-3">{protocol.arvDescription || 'Không có mô tả'}</p>

            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Mã phác đồ:</strong> {protocol.regimenCode || '-'}</p>
              <p><strong>Tuyến điều trị:</strong> {protocol.treatmentLine || '-'}</p>
              <p><strong>Đối tượng:</strong> {protocol.recommendedFor || '-'}</p>
              {/* <p><strong>Người tạo:</strong> {protocol.userId ? userNames[protocol.] || 'Đang tải...' : 'Không xác định'}</p> */}
            </div>

            {protocol.drugs && protocol.drugs.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Pill className="h-4 w-4 text-gray-600" />
                  Thông tin thuốc
                </label>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tên thuốc</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Liều dùng</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tần suất</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">CCI</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">TDP</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {protocol.drugs.map((drug, index) => {
                        const frequencies = protocol.frequency ? protocol.frequency.split(';') : [];
                        return (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm text-gray-900">{drug}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{protocol.dosages[index] || 'Chưa có'}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatFrequency(frequencies[index])}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{protocol.contraindications[index] || 'Chưa có'}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{protocol.sideEffects[index] || 'Chưa có'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setEditingProtocol(protocol);
                  setFormData(protocol);
                  setInputTable(
                    protocol.drugs.map((drug, i) => ({
                      drug,
                      dosage: protocol.dosages[i] || '',
                      frequency: protocol.frequency ? protocol.frequency.split(';')[i] || '' : '',
                      contraindication: protocol.contraindications[i] || '',
                      sideEffect: protocol.sideEffects[i] || '',
                    }))
                  );
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
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProtocol ? 'Chỉnh sửa phác đồ' : 'Thêm phác đồ mới'}
            </h2>
            <div className="space-y-5">
              {[
                { key: 'arvName', label: 'Tên phác đồ' },
                { key: 'arvDescription', label: 'Mô tả' },
                { key: 'regimenCode', label: 'Mã phác đồ' },
                { key: 'recommendedFor', label: 'Đối tượng khuyến cáo' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    value={formData[key as keyof ARVRegimen] as string | undefined || ''}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tuyến điều trị</label>
                <select
                  value={formData.treatmentLine}
                  onChange={e => setFormData({ ...formData, treatmentLine: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="First-line">First-line</option>
                  <option value="Second-line">Second-line</option>
                  <option value="Third-line">Third-line</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thuốc, Liều, Tần suất, CCI, TDP</label>
                <table className="w-full text-sm border mb-2">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">Thuốc</th>
                      <th className="border px-2 py-1">Liều</th>
                      <th className="border px-2 py-1">Tần suất</th>
                      <th className="border px-2 py-1">CCI</th>
                      <th className="border px-2 py-1">TDP</th>
                      <th className="border px-2 py-1">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputTable.map((row, i) => (
                      <tr key={i}>
                        {(['drug', 'dosage', 'frequency', 'contraindication', 'sideEffect'] as (keyof typeof row)[]).map(
                          field => (
                            <td key={field} className="border px-1 py-0.5">
                              <input
                                value={row[field]}
                                onChange={e => {
                                  const updated = [...inputTable];
                                  updated[i][field] = e.target.value;
                                  setInputTable(updated);
                                }}
                                className="w-full border px-1 py-0.5 rounded"
                              />
                            </td>
                          )
                        )}
                        <td className="border px-1 py-0.5 text-center">
                          <button
                            onClick={() => setInputTable(inputTable.filter((_, index) => index !== i))}
                            className="text-red-600"
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() =>
                    setInputTable([...inputTable, { drug: '', dosage: '', frequency: '', contraindication: '', sideEffect: '' }])
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  + Thêm thuốc
                </button>
              </div>

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