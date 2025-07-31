import React, { useEffect, useState } from 'react';
import { getAllServices, createService, updateService, deleteService } from '../../api/serviceApi';
import { getAllCategories } from '../../api/categoryApi';
import { Button, Modal, Form, Input, message, Select, Pagination, Upload } from 'antd';
import { Plus, Edit, Trash2, Search, Eye, Briefcase, UploadCloud } from 'lucide-react'; // Added UploadCloud icon
import type { Service } from '../../types/service';
import type { Category } from '../../types/category';
import { Link } from 'react-router-dom';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'; // Import types for Upload

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

  // State for image uploads
  const [fileList, setFileList] = useState<UploadFile[]>([]); // For Add Service Modal
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]); // For Edit Service Modal
  const [imageUrl, setImageUrl] = useState(''); // Stores the URL of the uploaded image for add form
  const [editImageUrl, setEditImageUrl] = useState(''); // Stores the URL of the uploaded image for edit form


  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const servicesPerPage = 10; // Number of services per page

  const fetchServicesAndCategories = async () => {
    setLoading(true);
    try {
      const [servicesData, categoriesData] = await Promise.all([
        getAllServices(),
        getAllCategories()
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndCategories();
  }, []);

  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- Image Upload Handlers ---
 const handleBeforeUpload = (file: UploadFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    return false; // Prevent upload if not correct type
  }

  // Safely access file.size and check if it's undefined
  const isLt2M = file.size ? file.size / 1024 / 1024 < 2 : false;
  if (!isLt2M) {
    message.error('Ảnh phải nhỏ hơn 2MB!');
    return false; // Prevent upload if too large or size is undefined
  }

  return true; // Allow upload if both conditions are met
};

  // This function would typically handle the actual upload to a backend/cloud storage
  // and return the URL. For this example, we're just simulating it.
  const handleImageUploadChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    setFileList(newFileList);
    if (file.status === 'done' && file.response) {
      // In a real application, file.response would contain the URL from your backend
      // For demonstration, we'll just set a placeholder URL or use the file's thumbUrl
      setImageUrl(file.response.url || URL.createObjectURL(file.originFileObj as Blob));
      message.success(`${file.name} đã được tải lên thành công.`);
    } else if (file.status === 'error') {
      message.error(`${file.name} tải lên thất bại.`);
    }
    // Remove file from list if status is 'removed'
    if (file.status === 'removed') {
      setImageUrl('');
    }
  };

  const handleEditImageUploadChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    setEditFileList(newFileList);
    if (file.status === 'done' && file.response) {
      setEditImageUrl(file.response.url || URL.createObjectURL(file.originFileObj as Blob));
      message.success(`${file.name} đã được tải lên thành công.`);
    } else if (file.status === 'error') {
      message.error(`${file.name} tải lên thất bại.`);
    }
    if (file.status === 'removed') {
      setEditImageUrl('');
    }
  };
  // --- End Image Upload Handlers ---

  const handleAddService = async (values: Partial<Service>) => {
    setAdding(true);
    try {
      // Use the imageUrl obtained from the upload component
      await createService({ ...values, serviceImage: imageUrl });
      message.success('Thêm dịch vụ thành công!');
      setIsAddModalOpen(false);
      addForm.resetFields();
      setImageUrl('');
      setFileList([]); // Clear file list after successful add
      fetchServicesAndCategories(); // Reload to update
      setCurrentPage(1); // Go back to the first page after adding
    } catch (err: any) {
      message.error(err.message || 'Thêm dịch vụ thất bại');
    } finally {
      setAdding(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsEditModalOpen(true);

    // Set the current image for display in the edit form
    setEditImageUrl(service.serviceImage || '');
    if (service.serviceImage) {
      setEditFileList([{
        uid: '-1',
        name: 'image.png', // Or parse filename from URL if possible
        status: 'done',
        url: service.serviceImage,
        thumbUrl: service.serviceImage,
      }]);
    } else {
      setEditFileList([]);
    }

    setTimeout(() => {
      editForm.setFieldsValue({
        serviceName: service.serviceName,
        serviceDescription: service.serviceDescription,
        categoryId: typeof service.categoryId === 'object' ? service.categoryId._id : service.categoryId,
        duration: service.duration,
        price: service.price,
        // serviceImage is now handled by Upload component's fileList and editImageUrl state
      });
    }, 0);
  };

  const handleUpdateService = async (values: Partial<Service>) => {
    if (!editingService) return;
    setSaving(true);
    try {
      // Use the editImageUrl obtained from the upload component
      await updateService(editingService._id, { ...values, serviceImage: editImageUrl });
      message.success('Cập nhật dịch vụ thành công!');
      setIsEditModalOpen(false);
      fetchServicesAndCategories(); // Reload to update
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
          fetchServicesAndCategories(); // Reload to update
          setCurrentPage(1); // Go back to the first page after deleting
        } catch (err: any) {
          message.error(err.message || 'Xóa dịch vụ thất bại');
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh sách dịch vụ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between p-8 mb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý Dịch vụ</h1>
              <p className="text-base text-gray-600">Quản lý, thêm, sửa, xóa các dịch vụ trong hệ thống</p>
            </div>
          </div>
          <Button type="primary" icon={<Plus />} className="!h-12 !px-8 !text-base !font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow" onClick={() => {
            setIsAddModalOpen(true);
            addForm.resetFields(); // Ensure form is clear
            setFileList([]); // Clear file list
            setImageUrl(''); // Clear image URL
          }}>
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

        {/* Table container */}
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[180px]">TÊN DỊCH VỤ</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[150px]">DANH MỤC</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">ẢNH</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">THỜI LƯỢNG (PHÚT)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">GIÁ (VNĐ)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy dịch vụ nào.
                  </td>
                </tr>
              ) : (
                currentServices.map((service) => {
                  const category = categories.find((c) => c._id === (typeof service.categoryId === 'object' ? service.categoryId._id : service.categoryId));
                  return (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {service.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category?.categoryName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.serviceImage && (
                          <img src={service.serviceImage} alt={service.serviceName} className="w-16 h-10 object-cover rounded" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={servicesPerPage}
            total={filteredServices.length}
            onChange={paginate}
            showSizeChanger={false}
          />
        </div>

        {/* Modal for Add Service */}
        <Modal
          title="Thêm dịch vụ mới"
          open={isAddModalOpen}
          onCancel={() => {
            setIsAddModalOpen(false);
            addForm.resetFields();
            setImageUrl('');
            setFileList([]); // Clear file list on cancel
          }}
          footer={null}
          destroyOnClose
        >
          <Form form={addForm} layout="vertical" onFinish={handleAddService}>
            <Form.Item
              label="Tên dịch vụ *"
              name="serviceName"
              rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả *"
              name="serviceDescription"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ!' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Danh mục *"
              name="categoryId"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Ảnh dịch vụ *"
              name="serviceImageUpload" // A dummy name for the Form.Item to hold the Upload
              rules={[{ required: !imageUrl, message: 'Vui lòng tải lên ảnh dịch vụ!' }]} // Make it required only if no image URL is present
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageUploadChange}
                beforeUpload={handleBeforeUpload}
                maxCount={1} // Allow only one image
                // For demonstration, we'll use a dummy request handler.
                // In a real app, you'd send the file to your backend here.
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    // Simulate a successful upload with a dummy URL
                    const dummyUrl = URL.createObjectURL(file as Blob);
                    (onSuccess as Function)({ url: dummyUrl }); // Pass the URL in the response
                  }, 500);
                }}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadCloud className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* Display current image if exists (for validation/preview) */}
            {imageUrl && (
              <Form.Item label="Ảnh đã chọn">
                <img src={imageUrl} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
              </Form.Item>
            )}

            <Form.Item
              label="Thời lượng (phút) *"
              name="duration"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng dịch vụ!' }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Giá (VNĐ) *"
              name="price"
              rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => {
                setIsAddModalOpen(false);
                addForm.resetFields();
                setImageUrl('');
                setFileList([]);
              }} disabled={adding}> Hủy </Button>
              <Button type="primary" htmlType="submit" loading={adding}> Thêm </Button>
            </div>
          </Form>
        </Modal>

        {/* Modal for Edit Service */}
        <Modal
          title="Chỉnh sửa dịch vụ"
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            editForm.resetFields();
            setEditingService(null);
            setEditImageUrl('');
            setEditFileList([]); // Clear file list on cancel
          }}
          footer={null}
          destroyOnClose
        >
          <Form form={editForm} layout="vertical" onFinish={handleUpdateService}>
            <Form.Item
              label="Tên dịch vụ *"
              name="serviceName"
              rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="serviceDescription"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Danh mục *"
              name="categoryId"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Ảnh dịch vụ"
              name="serviceImageUpload" // Dummy name for the Form.Item
            >
              <Upload
                listType="picture-card"
                fileList={editFileList}
                onChange={handleEditImageUploadChange}
                beforeUpload={handleBeforeUpload}
                maxCount={1}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    const dummyUrl = URL.createObjectURL(file as Blob);
                    (onSuccess as Function)({ url: dummyUrl });
                  }, 500);
                }}
              >
                {editFileList.length < 1 && (
                  <div>
                    <UploadCloud className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* Display current image if exists (for validation/preview) */}
            {editImageUrl && (
              <Form.Item label="Ảnh hiện tại">
                <img src={editImageUrl} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
              </Form.Item>
            )}

            <Form.Item
              label="Thời lượng (phút)"
              name="duration"
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Giá (VNĐ)"
              name="price"
            >
              <Input type="number" min={0} />
            </Form.Item>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => {
                setIsEditModalOpen(false);
                editForm.resetFields();
                setEditingService(null);
                setEditImageUrl('');
                setEditFileList([]);
              }} disabled={saving}> Hủy </Button>
              <Button type="primary" htmlType="submit" loading={saving}> Lưu </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ServicesManagements;