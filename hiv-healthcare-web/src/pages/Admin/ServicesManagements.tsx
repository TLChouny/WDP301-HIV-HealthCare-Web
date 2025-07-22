import React, { useEffect, useState } from 'react';
import { getAllServices, createService, updateService, deleteService } from '../../api/serviceApi';
import { getAllCategories } from '../../api/categoryApi';
import { Button, Modal, Form, Input, message, Select } from 'antd';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import type { Service } from '../../types/service';
import type { Category } from '../../types/category';
import { Link } from 'react-router-dom';

const ServicesManagements: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi lấy danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi lấy danh mục');
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const truncateText = (text: string | undefined, wordLimit: number): string => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const handleAddService = async (values: Partial<Service>) => {
    setAdding(true);
    try {
      await createService({ ...values, serviceImage: imageUrl });
      message.success('Thêm dịch vụ thành công!');
      setIsAddModalOpen(false);
      addForm.resetFields();
      setImageUrl('');
      fetchServices();
    } catch (err: any) {
      message.error(err.message || 'Thêm dịch vụ thất bại');
    } finally {
      setAdding(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
    setEditImageUrl(service.serviceImage || '');
    setTimeout(() => {
      editForm.setFieldsValue({
        serviceName: service.serviceName,
        serviceDescription: service.serviceDescription,
        categoryId: typeof service.categoryId === 'object' ? service.categoryId._id : service.categoryId,
        duration: service.duration,
        price: service.price,
      });
    }, 0);
  };

  const handleUpdateService = async (values: Partial<Service>) => {
    if (!editingService) return;
    setSaving(true);
    try {
      await updateService(editingService._id, { ...values, serviceImage: editImageUrl });
      message.success('Cập nhật dịch vụ thành công!');
      setIsEditModalOpen(false);
      fetchServices();
    } catch (err: any) {
      message.error(err.message || 'Cập nhật dịch vụ thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = (service: Service) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa dịch vụ "${service.serviceName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteService(service._id);
          message.success('Xóa dịch vụ thành công!');
          fetchServices();
        } catch (err: any) {
          message.error(err.message || 'Xóa dịch vụ thất bại');
        }
      },
    });
  };

  // Giả lập upload ảnh: chỉ lấy link từ input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    setUrl(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
          <p className="mt-2 text-sm text-gray-600">Quản lý các dịch vụ trong hệ thống</p>
          <Button type="primary" icon={<Plus />} className="mt-4" onClick={() => setIsAddModalOpen(true)}>
            Thêm dịch vụ
          </Button>
        </div>
        {/* Filter & Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên dịch vụ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Service List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời lượng (phút)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá (VNĐ)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => {
                  const category = categories.find((c) => c._id === (typeof service.categoryId === 'object' ? service.categoryId._id : service.categoryId));
                  return (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-gray-700" title={service.serviceDescription || ''}>
                          {truncateText(service.serviceDescription, 10)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{category?.categoryName || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.serviceImage && (
                          <img src={service.serviceImage} alt="service" className="w-16 h-10 object-cover rounded" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.duration || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.price ? Number(service.price).toLocaleString('vi-VN') : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/admin/services/${service._id}`}>
                            <Button
                              type="link"
                              className="text-gray-600"
                              icon={<Eye className="w-5 h-5" />}
                            />
                          </Link>
                          <Button
                            type="link"
                            className="text-blue-600"
                            icon={<Edit className="w-5 h-5" />}
                            onClick={() => handleEditService(service)}
                          />
                          <Button
                            type="link"
                            className="text-red-600"
                            icon={<Trash2 className="w-5 h-5" style={{ color: 'red' }} />}
                            onClick={() => handleDeleteService(service)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {/* Modal for Add Service */}
        <Modal
          title="Thêm dịch vụ mới"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form form={addForm} layout="vertical" onFinish={handleAddService}>
            <Form.Item
              label="Tên dịch vụ *"
              name="serviceName"
              rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="serviceDescription">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Danh mục *" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}> 
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Link ảnh (URL)" name="serviceImage">
              <Input
                placeholder="Dán link ảnh hoặc upload lên cloud"
                value={imageUrl}
                onChange={(e) => handleImageChange(e, setImageUrl)}
              />
            </Form.Item>
            <Form.Item label="Thời lượng (phút)" name="duration">
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item label="Giá (VNĐ)" name="price">
              <Input type="number" min={0} />
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
        {/* Modal for Edit Service */}
        <Modal
          title="Chỉnh sửa dịch vụ"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateService}
          >
            <Form.Item
              label="Tên dịch vụ *"
              name="serviceName"
              rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="serviceDescription">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Danh mục *" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}> 
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Link ảnh (URL)" name="serviceImage">
              <Input
                placeholder="Dán link ảnh hoặc upload lên cloud"
                value={editImageUrl}
                onChange={(e) => handleImageChange(e, setEditImageUrl)}
              />
            </Form.Item>
            <Form.Item label="Thời lượng (phút)" name="duration">
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item label="Giá (VNĐ)" name="price">
              <Input type="number" min={0} />
            </Form.Item>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => setIsEditModalOpen(false)} disabled={saving}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ServicesManagements;