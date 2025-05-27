import React, { useState } from 'react';
import { 
  Pill,
  Search,
  Plus,
  User,
  Calendar,
  Clock,
  FileText,
  Download,
  Printer,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package,
  AlertTriangle
} from 'lucide-react';

interface Medication {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  doctor: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    unit: string;
    notes?: string;
  }[];
  status: 'active' | 'completed' | 'cancelled';
  nextRefillDate?: string;
  totalCost: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
}

const StaffMedicationManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');

  const medications: Medication[] = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      patientId: 'BN001',
      date: '2024-03-20',
      doctor: 'BS. Trần Thị B',
      medications: [
        {
          name: 'Tenofovir',
          dosage: '300mg',
          frequency: '1 lần/ngày',
          duration: '30 ngày',
          quantity: 30,
          unit: 'viên',
          notes: 'Uống sau bữa ăn'
        },
        {
          name: 'Lamivudine',
          dosage: '300mg',
          frequency: '1 lần/ngày',
          duration: '30 ngày',
          quantity: 30,
          unit: 'viên',
          notes: 'Uống sau bữa ăn'
        }
      ],
      status: 'active',
      nextRefillDate: '2024-04-20',
      totalCost: 1500000,
      paymentStatus: 'paid'
    },
    {
      id: '2',
      patientName: 'Trần Thị C',
      patientId: 'BN002',
      date: '2024-03-19',
      doctor: 'BS. Lê Văn D',
      medications: [
        {
          name: 'Efavirenz',
          dosage: '600mg',
          frequency: '1 lần/ngày',
          duration: '30 ngày',
          quantity: 30,
          unit: 'viên',
          notes: 'Uống trước khi đi ngủ'
        }
      ],
      status: 'active',
      nextRefillDate: '2024-04-19',
      totalCost: 800000,
      paymentStatus: 'pending'
    }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang sử dụng' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const paymentStatuses = [
    { value: 'all', label: 'Tất cả thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'pending', label: 'Chờ thanh toán' },
    { value: 'partial', label: 'Thanh toán một phần' }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: 'Đang sử dụng',
          color: 'bg-green-100 text-green-800'
        };
      case 'completed':
        return {
          icon: <FileText className="w-4 h-4 text-gray-600" />,
          text: 'Đã hoàn thành',
          color: 'bg-gray-100 text-gray-800'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: 'Đã hủy',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: null,
          text: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: 'Đã thanh toán',
          color: 'bg-green-100 text-green-800'
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          text: 'Chờ thanh toán',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'partial':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
          text: 'Thanh toán một phần',
          color: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          icon: null,
          text: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const filteredMedications = medications.filter((medication) => {
    const matchesSearch = 
      medication.patientName.toLowerCase().includes(search.toLowerCase()) ||
      medication.patientId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || medication.status === selectedStatus;
    const matchesDate = selectedDate === 'all' || medication.date === selectedDate;
    const matchesPayment = selectedPaymentStatus === 'all' || medication.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesDate && matchesPayment;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thuốc</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi đơn thuốc của bệnh nhân
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
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {paymentStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Tạo đơn thuốc mới</span>
            </button>
          </div>
        </div>

        {/* Medications List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh sách thuốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi phí
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
                {filteredMedications.map((medication) => {
                  const status = getStatusInfo(medication.status);
                  const paymentStatus = getPaymentStatusInfo(medication.paymentStatus);
                  return (
                    <tr key={medication.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {medication.patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Mã BN: {medication.patientId}
                            </div>
                            <div className="text-sm text-gray-500">
                              Bác sĩ: {medication.doctor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {medication.medications.map((med, index) => (
                          <div key={index} className="text-sm text-gray-900 mb-2">
                            <div className="font-medium">{med.name}</div>
                            <div className="text-gray-500">
                              {med.dosage} - {med.frequency} - {med.duration}
                            </div>
                            <div className="text-gray-500">
                              Số lượng: {med.quantity} {med.unit}
                            </div>
                            {med.notes && (
                              <div className="text-gray-500 italic">
                                Ghi chú: {med.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Ngày kê đơn: {medication.date}
                        </div>
                        {medication.nextRefillDate && (
                          <div className="text-sm text-gray-500">
                            Tái khám: {medication.nextRefillDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {medication.totalCost.toLocaleString('vi-VN')} VNĐ
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatus.color}`}>
                          <div className="flex items-center space-x-1">
                            {paymentStatus.icon}
                            <span>{paymentStatus.text}</span>
                          </div>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          <div className="flex items-center space-x-1">
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                        </span>
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

export default StaffMedicationManagement; 