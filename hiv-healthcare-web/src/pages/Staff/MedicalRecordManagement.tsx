import React, { useState } from 'react';
import { 
  FileText,
  Search,
  Plus,
  User,
  Calendar,
  Clock,
  FilePlus,
  Download,
  Printer,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  doctor: string;
  diagnosis: string;
  symptoms: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  testResults: {
    name: string;
    result: string;
    date: string;
    status: 'normal' | 'abnormal' | 'pending';
  }[];
  notes: string;
  status: 'active' | 'archived' | 'pending';
  followUpDate?: string;
}

const StaffMedicalRecordManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      patientId: 'BN001',
      date: '2024-03-20',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'HIV/AIDS - Giai đoạn 2',
      symptoms: ['Sốt', 'Mệt mỏi', 'Sụt cân'],
      medications: [
        {
          name: 'Tenofovir',
          dosage: '300mg',
          frequency: '1 lần/ngày',
          duration: '30 ngày'
        },
        {
          name: 'Lamivudine',
          dosage: '300mg',
          frequency: '1 lần/ngày',
          duration: '30 ngày'
        }
      ],
      testResults: [
        {
          name: 'CD4 Count',
          result: '350 cells/mm³',
          date: '2024-03-19',
          status: 'normal'
        },
        {
          name: 'Viral Load',
          result: 'Đang chờ kết quả',
          date: '2024-03-19',
          status: 'pending'
        }
      ],
      notes: 'Bệnh nhân cần theo dõi sát sao và tái khám sau 1 tháng',
      status: 'active',
      followUpDate: '2024-04-20'
    },
    {
      id: '2',
      patientName: 'Trần Thị C',
      patientId: 'BN002',
      date: '2024-03-19',
      doctor: 'BS. Lê Văn D',
      diagnosis: 'HIV/AIDS - Giai đoạn 1',
      symptoms: ['Mệt mỏi nhẹ'],
      medications: [
        {
          name: 'Efavirenz',
          dosage: '600mg',
          frequency: '1 lần/ngày',
          duration: '30 ngày'
        }
      ],
      testResults: [
        {
          name: 'CD4 Count',
          result: '450 cells/mm³',
          date: '2024-03-18',
          status: 'normal'
        },
        {
          name: 'Viral Load',
          result: '50 copies/mL',
          date: '2024-03-18',
          status: 'abnormal'
        }
      ],
      notes: 'Bệnh nhân đáp ứng tốt với điều trị',
      status: 'active',
      followUpDate: '2024-04-19'
    }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang điều trị' },
    { value: 'archived', label: 'Đã lưu trữ' },
    { value: 'pending', label: 'Chờ xử lý' }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: 'Đang điều trị',
          color: 'bg-green-100 text-green-800'
        };
      case 'archived':
        return {
          icon: <FileText className="w-4 h-4 text-gray-600" />,
          text: 'Đã lưu trữ',
          color: 'bg-gray-100 text-gray-800'
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          text: 'Chờ xử lý',
          color: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          icon: null,
          text: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(search.toLowerCase()) ||
      record.patientId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesDate = selectedDate === 'all' || record.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Hồ sơ Bệnh án</h1>
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
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Tạo hồ sơ mới</span>
            </button>
          </div>
        </div>

        {/* Medical Records List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chẩn đoán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thuốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xét nghiệm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => {
                  const status = getStatusInfo(record.status);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Mã BN: {record.patientId}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Ngày khám: {record.date}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Bác sĩ: {record.doctor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{record.diagnosis}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Triệu chứng: {record.symptoms.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {record.medications.map((med, index) => (
                          <div key={index} className="text-sm text-gray-900">
                            {med.name} - {med.dosage}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        {record.testResults.map((test, index) => (
                          <div key={index} className="text-sm text-gray-900">
                            {test.name}: {test.result}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          <div className="flex items-center space-x-1">
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                        </span>
                        {record.followUpDate && (
                          <div className="text-sm text-gray-500 mt-1">
                            Tái khám: {record.followUpDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="w-5 h-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Printer className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffMedicalRecordManagement; 