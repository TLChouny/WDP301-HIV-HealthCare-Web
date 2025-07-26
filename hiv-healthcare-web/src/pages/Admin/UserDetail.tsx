import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Edit, Trash2 } from 'lucide-react';
import { getAllUsers, updateUser, deleteUser } from '../../api/authApi';
import type { User } from '../../types/user';
import { Modal, message, Select, Input, Button, Form } from 'antd';

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{ userName: string; role: string; phone_number: string }>({ userName: '', role: 'user', phone_number: '' });
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        const foundUser = data.find((u: User) => u._id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError('Không tìm thấy người dùng');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi lấy thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

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

  const getStatus = (user: User) => (user.isVerified ? 'active' : 'inactive');

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
        userDescription: user.userDescription || '',
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
      payload.userDescription = undefined;
    }
    return payload;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">Đang tải thông tin người dùng...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          {error || 'Không tìm thấy người dùng'}
          <Button 
            type="primary" 
            className="mt-4"
            onClick={() => navigate('/admin/roles')}
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              type="text"
              icon={<ArrowLeft />}
              onClick={() => navigate('/admin/roles')}
              className="mr-4"
            >
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h1>
          </div>
        </div>

        {/* User Information Card */}
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col items-center mb-2">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-2 shadow-lg">
              <UserIcon className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-2xl font-bold mt-2">{user.userName}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center mt-2 gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${getRoleColor(user.role)}`}>{getRoleText(user.role)}</span>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(getStatus(user))}`}>{getStatusText(getStatus(user))}</span>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-gray-600">Tên người dùng:</div>
              <div className="font-medium">{user.userName}</div>
              <div className="text-gray-600">Email:</div>
              <div className="font-medium">{user.email}</div>
              <div className="text-gray-600">Số điện thoại:</div>
              <div className="font-medium">{user.phone_number || 'Chưa cập nhật'}</div>
              <div className="text-gray-600">Vai trò:</div>
              <div><span className={`px-2 py-1 text-sm rounded-full ${getRoleColor(user.role)}`}>{getRoleText(user.role)}</span></div>
              <div className="text-gray-600">Trạng thái:</div>
              <div><span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(getStatus(user))}`}>{getStatusText(getStatus(user))}</span></div>
            </div>
          </div>

          {/* Thông tin hệ thống */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">Thông tin hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-gray-600">ID người dùng:</div>
              <div className="font-mono text-sm text-gray-500">{user._id}</div>
              <div className="text-gray-600">Ngày tạo:</div>
              <div className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Chưa có thông tin'}</div>
              <div className="text-gray-600">Cập nhật lần cuối:</div>
              <div className="font-medium">{user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'Chưa có thông tin'}</div>
            </div>
          </div>

          {/* Thông tin bác sĩ */}
          {user.role === 'doctor' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">Mô tả bác sĩ</h3>
              <div className="text-gray-700 whitespace-pre-line min-h-[40px]">{user.userDescription || 'Chưa có mô tả'}</div>
            </div>
          )}
        </div>
      </div>

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

              // Refresh user data
              const data = await getAllUsers();
              const updatedUser = data.find((u: User) => u._id === userId);
              if (updatedUser) {
                setUser(updatedUser);
              }

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
    </div>
  );
};

export default UserDetail; 