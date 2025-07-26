import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User as UserIcon,
  Eye,
} from 'lucide-react';
import { getAllUsers, updateUser, deleteUser, createUser } from '../../api/authApi';
import type { User } from '../../types/user';
import { Modal, message, Select, Input, Button, Form } from 'antd';

const RoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm(); // Form cho chỉnh sửa

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm] = Form.useForm(); // Form cho thêm mới
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null); // Reset lỗi mỗi khi fetch
      try {
        const data = await getAllUsers();
        // Đảm bảo data là một mảng
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", data);
          setError("Dữ liệu người dùng không hợp lệ.");
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
        setError(err.message || 'Lỗi khi lấy danh sách người dùng từ server.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Map trạng thái từ isVerified
  const getStatus = (user: User) => (user.isVerified ? 'active' : 'inactive');

  // Filter và Sort
  const filteredAndSortedUsers = [...users] // Tạo một bản sao để không làm thay đổi state 'users' trực tiếp
    .filter((user) => {
      const matchesSearch =
        user.userName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || getStatus(user) === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      // Đảm bảo role tồn tại trước khi so sánh
      const roleA = a.role || '';
      const roleB = b.role || '';

      if (roleA === 'admin' && roleB !== 'admin') {
        return -1; // a (admin) đứng trước b
      }
      if (roleA !== 'admin' && roleB === 'admin') {
        return 1; // b (admin) đứng trước a
      }
      // Giữ nguyên thứ tự ban đầu cho các trường hợp còn lại
      return 0;
    });

  const allRoles = ['admin', 'doctor', 'staff', 'user']; // Thứ tự ưu tiên cho Selects
  const rolesForFilter = ['all', ...allRoles]; // Dùng cho bộ lọc

  const statuses = ['all', 'active', 'inactive'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'doctor':
        return 'Bác sĩ';
      case 'staff':
        return 'Nhân viên';
      case 'user':
        return 'Người dùng';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
    // Sử dụng setTimeout để đảm bảo form đã được render trước khi setFieldsValue
    setTimeout(() => {
      form.setFieldsValue({
        userName: user.userName || '',
        role: user.role,
        phone_number: user.phone_number || '',
        // Đảm bảo userDescription chỉ được set nếu user.role là doctor, nếu không thì undefined
        userDescription: user.role === 'doctor' ? (user.userDescription || '') : undefined,
      });
    }, 0);
  };

  const buildUpdatePayload = (values: any) => {
    const payload: any = {
      userName: values.userName,
      role: values.role,
      phone_number: values.phone_number,
    };
    if (values.role === 'doctor') {
      payload.userDescription = values.userDescription;
    } else {
      payload.userDescription = undefined; // Đảm bảo gửi undefined hoặc null nếu không phải doctor
    }
    return payload;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh sách tài khoản...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Có lỗi xảy ra!</h2>
          <p className="text-lg text-gray-700">{error}</p>
          <Button
            type="primary"
            className="mt-6 bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    // THAY ĐỔI Ở ĐÂY: Thêm background gradient
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6"> 
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between p-8 mb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-500 shadow-lg">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý tài khoản</h1>
              <p className="text-base text-gray-600">Quản lý và phân quyền cho các tài khoản trong hệ thống</p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<Plus />}
            className="!h-12 !px-8 !text-base !font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow"
            onClick={() => {
              setIsAddModalOpen(true); // Sử dụng setIsAddModalOpen
              addForm.resetFields();
              addForm.setFieldsValue({ role: 'user' }); // Mặc định vai trò là 'user'
            }}
          >
            Thêm người dùng
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {rolesForFilter.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'Tất cả vai trò' : getRoleText(role)}
                </option>
              ))}
            </select>
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
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          {filteredAndSortedUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Không tìm thấy người dùng nào.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: 900 }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò hiện tại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả bác sĩ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>{getRoleText(user.role)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phone_number || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(getStatus(user))}`}>{getStatusText(getStatus(user))}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis">
                      {user.role === 'doctor' ? (user.userDescription && user.userDescription.length > 10 ? `${user.userDescription.slice(0, 10)}...` : user.userDescription || '') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          type="link"
                          className="text-blue-600"
                          icon={<Eye className="w-5 h-5" />}
                          onClick={() => navigate(`/admin/user-detail/${user._id}`)}
                        />
                        <Button
                          type="link"
                          className="text-blue-600"
                          icon={<Edit className="w-5 h-5" />}
                          onClick={() => handleEditUser(user)}
                        />
                        <Button
                          type="link"
                          className="text-red-600"
                          icon={<Trash2 className="w-5 h-5" style={{ color: 'red' }} />}
                          onClick={() => {
                            // Không cho phép xóa tài khoản admin
                            if (user.role === 'admin') {
                              message.error('Không thể xóa tài khoản quản trị viên!');
                              return;
                            }
                            Modal.confirm({
                              title: 'Xác nhận xóa',
                              content: 'Bạn có chắc chắn muốn xóa người dùng này?',
                              okText: 'Xóa',
                              okType: 'danger',
                              cancelText: 'Hủy',
                              onOk: async () => {
                                try {
                                  await deleteUser(user._id);
                                  const data = await getAllUsers();
                                  setUsers(data); // Cập nhật lại danh sách sau khi xóa
                                  message.success('Xóa người dùng thành công!');
                                } catch (err: any) {
                                  message.error(err.message || 'Xóa người dùng thất bại');
                                }
                              },
                            });
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Modal for Edit User */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields(); // Reset form khi đóng
          setEditingUser(null);
        }}
        footer={null}
        destroyOnClose // Đảm bảo form được mount lại mỗi khi mở để initialValues hoạt động tốt
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            if (!editingUser) return;

            // Kiểm tra đặc biệt cho tài khoản admin
            if (editingUser.role === 'admin' && values.role !== 'admin') {
              message.error('Không thể thay đổi quyền của tài khoản quản trị viên!');
              return;
            }

            setSaving(true);
            try {
              const payload = buildUpdatePayload(values);
              await updateUser(editingUser._id, payload);

              const data = await getAllUsers();
              setUsers(data); // Cập nhật lại danh sách sau khi sửa

              setIsModalOpen(false);
              message.success('Cập nhật người dùng thành công!');
            } catch (err: any) {
              message.error(err.message || 'Cập nhật thất bại');
            } finally {
              setSaving(false);
            }
          }}
        >
          <Form.Item
            label="Tên người dùng *"
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vai trò *"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select
              disabled={editingUser?.role === 'admin'} // Vô hiệu hóa chọn nếu là admin
              onChange={role => {
                // Nếu vai trò không phải doctor, reset userDescription
                if (role !== 'doctor') {
                  form.setFieldsValue({ userDescription: undefined });
                }
              }}
            >
              {allRoles.map((role) => (
                <Select.Option key={role} value={role}>{getRoleText(role)}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item shouldUpdate={(prev, curr) => prev.role !== curr.role}>
            {() =>
              form.getFieldValue('role') === 'doctor' && (
                <Form.Item
                  label="Mô tả bác sĩ"
                  name="userDescription"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả cho bác sĩ' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone_number"
          >
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái">
            {/* Hiển thị trạng thái dựa trên editingUser.isVerified */}
            <Input value={editingUser ? getStatusText(getStatus(editingUser)) : ''} disabled />
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => {
              setIsModalOpen(false);
              form.resetFields(); // Reset form khi hủy
              setEditingUser(null);
            }} disabled={saving}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal for Add User */}
      <Modal
        title="Thêm người dùng mới"
        open={isAddModalOpen} // Sử dụng isAddModalOpen
        onCancel={() => {
          setIsAddModalOpen(false); // Sử dụng setIsAddModalOpen
          addForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{ role: 'user' }} // Mặc định vai trò là user khi thêm mới
          onFinish={async (values) => {
            setAdding(true);
            try {
              await createUser(values);
              const data = await getAllUsers();
              setUsers(data); // Cập nhật lại danh sách sau khi thêm
              setIsAddModalOpen(false); // Sử dụng setIsAddModalOpen
              addForm.resetFields();
              message.success('Thêm người dùng thành công!');
            } catch (err: any) {
              message.error(err.message || 'Thêm người dùng thất bại');
            } finally {
              setAdding(false);
            }
          }}
        >
          <Form.Item
            label="Tên người dùng *"
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email *"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu *"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Vai trò *"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select
              onChange={role => {
                if (role !== 'doctor') {
                  addForm.setFieldsValue({ userDescription: undefined });
                }
              }}
            >
              {allRoles.map((role) => (
                <Select.Option key={role} value={role}>{getRoleText(role)}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item shouldUpdate={(prev, curr) => prev.role !== curr.role}>
            {() =>
              addForm.getFieldValue('role') === 'doctor' && (
                <Form.Item
                  label="Mô tả bác sĩ"
                  name="userDescription"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả cho bác sĩ!' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              )
            }
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => {
              setIsAddModalOpen(false); // Sử dụng setIsAddModalOpen
              addForm.resetFields();
            }} disabled={adding}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={adding}>
              Thêm
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;