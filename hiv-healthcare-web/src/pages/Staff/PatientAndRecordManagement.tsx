import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Search, 
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  FilePlus,
  Download,
  Printer,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive';
  notes?: string;
  medicalRecords?: MedicalRecord[];
}

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

const StaffPatientAndRecordManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedPatientStatus, setSelectedPatientStatus] = useState<string>('all');
  const [selectedRecordStatus, setSelectedRecordStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'patients' | 'records'>('patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      age: 35,
      gender: 'male',
      phone: '0123 456 789',
      email: 'nguyenvana@example.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      lastVisit: '2024-03-15',
      nextAppointment: '2024-03-25',
      status: 'active',
      notes: 'Bệnh nhân cần theo dõi định kỳ',
      medicalRecords: [
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
            }
          ],
          testResults: [
            {
              name: 'CD4 Count',
              result: '350 cells/mm³',
              date: '2024-03-19',
              status: 'normal'
            }
          ],
          notes: 'Bệnh nhân cần theo dõi sát sao',
          status: 'active',
          followUpDate: '2024-04-20'
        }
      ]
    },
    // Add more patients as needed
  ];

  const patientStatuses = ['all', 'active', 'inactive'];
  const recordStatuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang điều trị' },
    { value: 'archived', label: 'Đã lưu trữ' },
    { value: 'pending', label: 'Chờ xử lý' }
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search) ||
      patient.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedPatientStatus === 'all' || patient.status === selectedPatientStatus;
    return matchesSearch && matchesStatus;
  });

  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang điều trị';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const getRecordStatusInfo = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân và Hồ sơ Bệnh án</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý thông tin bệnh nhân và hồ sơ bệnh án
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('patients')}
                className={`${
                  activeTab === 'patients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Danh sách Bệnh nhân
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Hồ sơ Bệnh án
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={activeTab === 'patients' ? 
                    "Tìm kiếm theo tên, số điện thoại hoặc email..." : 
                    "Tìm kiếm theo tên hoặc mã bệnh nhân..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              {activeTab === 'records' && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              <select
                value={activeTab === 'patients' ? selectedPatientStatus : selectedRecordStatus}
                onChange={(e) => activeTab === 'patients' ? 
                  setSelectedPatientStatus(e.target.value) : 
                  setSelectedRecordStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {activeTab === 'patients' ? (
                  patientStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'Tất cả trạng thái' : getPatientStatusText(status)}
                    </option>
                  ))
                ) : (
                  recordStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))
                )}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{activeTab === 'patients' ? 'Thêm bệnh nhân' : 'Tạo hồ sơ mới'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'patients' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lịch hẹn
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
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.age} tuổi - {patient.gender === 'male' ? 'Nam' : 'Nữ'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{patient.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Lần khám cuối: {patient.lastVisit}</span>
                        </div>
                        {patient.nextAppointment && (
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Lịch hẹn tiếp: {patient.nextAppointment}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPatientStatusColor(patient.status)}`}>
                          {getPatientStatusText(patient.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedPatient(patient);
                              setActiveTab('records');
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
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
        ) : (
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
                  {selectedPatient?.medicalRecords?.map((record) => {
                    const status = getRecordStatusInfo(record.status);
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
        )}
      </div>
    </div>
  );
};

export default StaffPatientAndRecordManagement; 