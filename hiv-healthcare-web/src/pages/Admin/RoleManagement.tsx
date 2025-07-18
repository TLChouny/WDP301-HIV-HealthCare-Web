import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { getAllUsers, updateUser, deleteUser, createUser } from '../../api/authApi';
import type { User } from '../../types/user';
import { Modal, message, Select, Input, Button, Form } from 'antd';

const RoleManagement: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ userName: string; role: string; phone_number: string }>({ userName: '', role: 'user', phone_number: '' });
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm] = Form.useForm();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi lấy danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Map trạng thái từ isVerified
  const getStatus = (user: User) => (user.isVerified ? 'active' : 'inactive');

  // Filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || getStatus(user) === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roles = ['all', 'admin', 'doctor', 'staff', 'user'];
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

  // Khi mở modal chỉnh sửa, set giá trị form
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      userName: user.userName || '',
      role: user.role,
      phone_number: user.phone_number || '',
    });
    setIsModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({
        userName: user.userName || '',
        role: user.role,
        phone_number: user.phone_number || '',
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
      payload.userDescription = undefined; // Optional: clear nếu không phải doctor
    }
    return payload;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và phân quyền cho các tài khoản trong hệ thống
          </p>
          <Button
            type="primary"
            icon={<Plus />}
            className="mt-4"
            onClick={() => {
              setIsAddModalOpen(true);
              addForm.resetFields();
              addForm.setFieldsValue({ role: 'user' });
            }}
          >
            Thêm người dùng
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
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
                {roles.map((role) => (
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
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
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
                {filteredUsers.map((user) => (
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
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone_number || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(getStatus(user))}`}>
                        {getStatusText(getStatus(user))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                      {user.role === 'doctor' ? user.userDescription || '' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
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
                            if (user.role === 'admin') {
                              message.error('Không thể xóa tài khoản admin!');
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
                                  setUsers(data);
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
      {/* Modal for Edit User */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editForm}
          onFinish={async (values) => {
            if (!editingUser) return;

            if (editingUser.role === 'admin' && values.role !== 'admin') {
              message.error('Không thể thay đổi quyền của tài khoản admin!');
              return;
            }

            setSaving(true);
            try {
              const payload = buildUpdatePayload(values);
              await updateUser(editingUser._id, payload);

              const data = await getAllUsers();
              setUsers(data);

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
              disabled={editingUser?.role === 'admin'}
              onChange={role => {
                if (role !== 'doctor') {
                  form.setFieldsValue({ userDescription: undefined });
                }
              }}
            >
              <Select.Option value="admin">Quản trị viên</Select.Option>
              <Select.Option value="doctor">Bác sĩ</Select.Option>
              <Select.Option value="staff">Nhân viên</Select.Option>
              <Select.Option value="user">Người dùng</Select.Option>
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
            <Input value="Đang hoạt động" disabled />
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)} disabled={saving}>
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
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={async (values) => {
            setAdding(true);
            try {
              await createUser(values);
              const data = await getAllUsers();
              setUsers(data);
              setIsAddModalOpen(false);
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
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email *"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu *"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
          >
            <Input />
          </Form.Item>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsAddModalOpen(false)} disabled={adding}>
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