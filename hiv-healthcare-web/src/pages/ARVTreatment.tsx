import React, { useState } from 'react';
import { type ARVOption } from '../types/arvOption';

const ARVTreatment: React.FC = () => {
  const [selectedARV, setSelectedARV] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');

  const arvOptions: ARVOption[] = [
    { id: '1', name: 'TDF + 3TC + DTG', suitableFor: 'Người lớn' },
    { id: '2', name: 'AZT + 3TC + EFV', suitableFor: 'Phụ nữ mang thai' },
    { id: '3', name: 'ABC + 3TC + DTG', suitableFor: 'Trẻ em' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ patientId, selectedARV });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Quản Lý Phác Đồ ARV</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mã bệnh nhân</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Nhập mã bệnh nhân"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Chọn phác đồ ARV</label>
          <select
            value={selectedARV}
            onChange={(e) => setSelectedARV(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">Chọn phác đồ</option>
            {arvOptions.map((arv) => (
              <option key={arv.id} value={arv.id}>
                {arv.name} - {arv.suitableFor}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
        >
          Lưu Phác Đồ
        </button>
      </form>
    </div>
  );
};

export default ARVTreatment;