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
      <div className="max-w-7xl mx-auto">
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

        {/* Records List */}
        <div className="space-y-6">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {record.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mã BN: {record.patientId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(record.type)}`}>
                      {getTypeText(record.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {record.date}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Diagnosis and Treatment */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Chẩn đoán:</h4>
                      <p className="text-sm text-gray-600">{record.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Điều trị:</h4>
                      {record.treatment.arvProtocol && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">
                            Phác đồ ARV: {record.treatment.arvProtocol}
                          </span>
                        </div>
                      )}
                      <div className="space-y-1">
                        {record.treatment.medications.map((med, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Pill className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">{med}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Liều dùng: {record.treatment.dosage}
                      </p>
                    </div>
                  </div>

                  {/* Vitals and Notes */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Dấu hiệu sinh tồn:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            Huyết áp: {record.vitals.bloodPressure}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">
                            Nhịp tim: {record.vitals.heartRate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-gray-600">
                            Nhiệt độ: {record.vitals.temperature}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            Cân nặng: {record.vitals.weight}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Ghi chú:</h4>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {record.attachments && record.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tài liệu đính kèm:</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                        >
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{file}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Xem chi tiết
                  </button>
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center">
                    <Edit className="w-4 h-4 mr-1" />
                    Chỉnh sửa
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordManagement; 