import React, { useEffect, useState } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import { Button, Modal, Form, Input, message } from 'antd';
import { Plus, Edit, Trash2, Search, Folder } from 'lucide-react';
import type { Category } from '../../types/category';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi lấy danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = async (values: Partial<Category>) => {
    setAdding(true);
    try {
      await createCategory(values);
      message.success('Thêm danh mục thành công!');
      setIsAddModalOpen(false);
      addForm.resetFields();
      fetchCategories();
    } catch (err: any) {
      message.error(err.message || 'Thêm danh mục thất bại');
    } finally {
      setAdding(false);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsEditModalOpen(true);
    setTimeout(() => {
      editForm.setFieldsValue({
        categoryName: cat.categoryName,
        categoryDescription: cat.categoryDescription,
      });
    }, 0);
  };

  const handleUpdateCategory = async (values: Partial<Category>) => {
    if (!editingCategory) return;
    setSaving(true);
    try {
      await updateCategory(editingCategory._id, values);
      message.success('Cập nhật danh mục thành công!');
      setIsEditModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      message.error(err.message || 'Cập nhật danh mục thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa danh mục "${cat.categoryName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteCategory(cat._id);
          message.success('Xóa danh mục thành công!');
          fetchCategories();
        } catch (err: any) {
          message.error(err.message || 'Xóa danh mục thất bại');
        }
        return Promise.resolve(); // Thêm dòng này để xử lý Promise trong onOk
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh sách danh mục...</p>
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
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Folder className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý danh mục (Dịch vụ và tin tức)</h1>
              <p className="text-base text-gray-600">Quản lý các danh mục tin tức trong hệ thống</p>
            </div>
          </div>
          <Button type="primary" icon={<Plus />} className="!h-12 !px-8 !text-base !font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow" onClick={() => setIsAddModalOpen(true)}>
            Thêm danh mục
          </Button>
        </div>
        {/* Filter & Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên danh mục..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Category List */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cat.categoryName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">
                      <div className="text-sm text-gray-500" title={cat.categoryDescription || ''}>
                        {cat.categoryDescription && cat.categoryDescription.length > 20
                          ? cat.categoryDescription.slice(0, 20) + '...'
                          : cat.categoryDescription || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleString('vi-VN') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          type="link"
                          className="text-blue-600"
                          icon={<Edit className="w-5 h-5" />}
                          onClick={() => handleEditCategory(cat)}
                        />
                        <Button
                          type="link"
                          className="text-red-600"
                          icon={<Trash2 className="w-5 h-5" style={{ color: 'red' }} />}
                          onClick={() => handleDeleteCategory(cat)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Modal for Add Category */}
        <Modal
          title="Thêm danh mục mới"
          open={isAddModalOpen}
          onCancel={() => {
            setIsAddModalOpen(false);
            addForm.resetFields(); // Reset form khi đóng
          }}
          footer={null}
          destroyOnClose // Đảm bảo form được mount lại mỗi khi mở
        >
          <Form form={addForm} layout="vertical" onFinish={handleAddCategory}>
            <Form.Item
              label="Tên danh mục *"
              name="categoryName"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="categoryDescription"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => {
                setIsAddModalOpen(false);
                addForm.resetFields(); // Reset form khi hủy
              }} disabled={adding}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={adding}>
                Thêm
              </Button>
            </div>
          </Form>
        </Modal>
        {/* Modal for Edit Category */}
        <Modal
          title="Chỉnh sửa danh mục"
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            editForm.resetFields(); // Reset form khi đóng
            setEditingCategory(null);
          }}
          footer={null}
          destroyOnClose // Đảm bảo form được mount lại mỗi khi mở
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateCategory}
          >
            <Form.Item
              label="Tên danh mục *"
              name="categoryName"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="categoryDescription"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => {
                setIsEditModalOpen(false);
                editForm.resetFields(); // Reset form khi hủy
                setEditingCategory(null);
              }} disabled={saving}>
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

export default CategoryManagement;