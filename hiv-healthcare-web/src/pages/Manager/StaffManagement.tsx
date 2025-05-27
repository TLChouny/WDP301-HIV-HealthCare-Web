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
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive';
  joinDate: string;
  specialization?: string;
  notes?: string;
}

const StaffManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const staffMembers: Staff[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      position: 'Y tá trưởng',
      phone: '0123 456 789',
      email: 'nguyenvana@hivhealthcare.com',
      department: 'Phòng khám HIV',
      status: 'active',
      joinDate: '2023-01-15',
      specialization: 'Chăm sóc bệnh nhân HIV',
      notes: 'Có kinh nghiệm 5 năm trong lĩnh vực'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      position: 'Y tá',
      phone: '0987 654 321',
      email: 'tranthib@hivhealthcare.com',
      department: 'Phòng khám HIV',
      status: 'on_leave',
      joinDate: '2023-03-20',
      specialization: 'Tư vấn dinh dưỡng',
      notes: 'Đang nghỉ phép'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      position: 'Nhân viên hành chính',
      phone: '0912 345 678',
      email: 'levanc@hivhealthcare.com',
      department: 'Hành chính',
      status: 'inactive',
      joinDate: '2023-06-10',
      notes: 'Tạm ngừng làm việc'
    }
  ];

  const statuses = ['all', 'active', 'on_leave', 'inactive'];

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.position.toLowerCase().includes(search.toLowerCase()) ||
      staff.phone.includes(search) ||
      staff.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc';
      case 'on_leave':
        return 'Đang nghỉ phép';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'on_leave':
        return <AlertCircle className="w-4 h-4" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân viên</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi thông tin nhân viên
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, chức vụ, số điện thoại hoặc email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tất cả trạng thái' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Thêm nhân viên</span>
            </button>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin khác
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
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {staff.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{staff.position}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{staff.phone}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{staff.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        Phòng ban: {staff.department}
                      </div>
                      {staff.specialization && (
                        <div className="text-sm text-gray-500">
                          Chuyên môn: {staff.specialization}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Ngày vào: {staff.joinDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(staff.status)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                          {getStatusText(staff.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement; 