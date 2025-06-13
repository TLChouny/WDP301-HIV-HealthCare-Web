import React, { useState } from 'react';
import { 
  FileText,
  User,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Activity,
  Heart,
  Pill
} from 'lucide-react';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  type: 'initial' | 'follow-up' | 'emergency';
  diagnosis: string;
  treatment: {
    arvProtocol?: string;
    medications: string[];
    dosage: string;
  };
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
  };
  hivLoad?: string; // Thêm dòng này
  notes: string;
  attachments?: string[];
}

const MedicalRecordManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const records: MedicalRecord[] = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      patientId: 'BN001',
      date: '2024-03-15',
      type: 'initial',
      diagnosis: 'HIV giai đoạn 2',
      treatment: {
        arvProtocol: 'TDF + 3TC + DTG',
        medications: ['Tenofovir (TDF)', 'Lamivudine (3TC)', 'Dolutegravir (DTG)'],
        dosage: '1 viên/ngày'
      },
      vitals: {
        bloodPressure: '120/80 mmHg',
        heartRate: '72 bpm',
        temperature: '37.0°C',
        weight: '65 kg'
      },
      hivLoad: '1200 copies/mL', // Thêm dòng này
      notes: 'Bệnh nhân đáp ứng tốt với phác đồ điều trị',
      attachments: ['xet-nghiem.pdf', 'hinh-anh.pdf']
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      patientId: 'BN002',
      date: '2024-03-18',
      type: 'follow-up',
      diagnosis: 'Theo dõi điều trị ARV',
      treatment: {
        arvProtocol: 'TDF + 3TC + EFV',
        medications: ['Tenofovir (TDF)', 'Lamivudine (3TC)', 'Efavirenz (EFV)'],
        dosage: '1 viên/ngày'
      },
      vitals: {
        bloodPressure: '118/78 mmHg',
        heartRate: '70 bpm',
        temperature: '36.8°C',
        weight: '58 kg'
      },
      hivLoad: 'Không phát hiện', // Thêm dòng này
      notes: 'Cần tăng cường tư vấn dinh dưỡng',
      attachments: ['ket-qua.pdf']
    }
  ];

  const types = ['all', 'initial', 'follow-up', 'emergency'];

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(search.toLowerCase()) ||
      record.patientId.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'initial':
        return 'bg-blue-100 text-blue-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'initial':
        return 'Khám lần đầu';
      case 'follow-up':
        return 'Tái khám';
      case 'emergency':
        return 'Cấp cứu';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Hồ sơ bệnh án</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi hồ sơ bệnh án của bệnh nhân
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Tất cả loại khám' : getTypeText(type)}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Thêm hồ sơ</span>
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className="w-32 px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Bệnh nhân</th>
                <th className="w-20 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Mã BN</th>
                <th className="w-28 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Ngày khám</th>
                <th className="w-24 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Loại khám</th>
                <th className="w-40 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Chẩn đoán</th>
                <th className="w-32 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Phác đồ ARV</th>
                <th className="w-40 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Tải lượng HIV</th>
                <th className="w-28 px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-left align-middle border-b border-gray-200">
                    <span className="truncate">{record.patientName}</span>
                  </td>
                  <td className="px-3 py-2 text-center align-middle border-b border-gray-200">{record.patientId}</td>
                  <td className="px-3 py-2 text-center align-middle border-b border-gray-200">{record.date}</td>
                  <td className="px-3 py-2 text-center align-middle border-b border-gray-200">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(record.type)}`}>
                      {getTypeText(record.type)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center align-middle border-b border-gray-200">{record.diagnosis}</td>
                  <td className="px-3 py-2 text-center align-middle border-b border-gray-200">
                    {record.treatment.arvProtocol || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-3 py-2 text-center align-middle max-w-[160px] truncate border-b border-gray-200">
                    {record.hivLoad && record.hivLoad.trim() !== '' ? record.hivLoad : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-3 py-2 text-center align-middle border-b border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">Không có hồ sơ phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordManagement;