import React, { useEffect, useState } from 'react';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../../api/blogApi';
import { getAllCategories } from '../../api/categoryApi';
import { Button, Modal, Form, Input, message, Select, Upload } from 'antd';
import { Plus, Edit, Trash2, Search, Upload as UploadIcon, BookOpen } from 'lucide-react';
import type { Blog } from '../../types/blog';
import type { Category } from '../../types/category';

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi lấy danh sách blog');
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
    fetchBlogs();
    fetchCategories();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.blogTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddBlog = async (values: Partial<Blog>) => {
    setAdding(true);
    try {
      await createBlog({ ...values, blogImage: imageUrl });
      message.success('Thêm blog thành công!');
      setIsAddModalOpen(false);
      addForm.resetFields();
      setImageUrl('');
      fetchBlogs();
    } catch (err: any) {
      message.error(err.message || 'Thêm blog thất bại');
    } finally {
      setAdding(false);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
    setEditImageUrl(blog.blogImage || '');
    setTimeout(() => {
      editForm.setFieldsValue({
        blogTitle: blog.blogTitle,
        blogContent: blog.blogContent,
        blogAuthor: blog.blogAuthor,
        categoryId: blog.categoryId,
      });
    }, 0);
  };

  const handleUpdateBlog = async (values: Partial<Blog>) => {
    if (!editingBlog) return;
    setSaving(true);
    try {
      await updateBlog(editingBlog._id, { ...values, blogImage: editImageUrl });
      message.success('Cập nhật blog thành công!');
      setIsEditModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      message.error(err.message || 'Cập nhật blog thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = (blog: Blog) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa blog "${blog.blogTitle}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteBlog(blog._id);
          message.success('Xóa blog thành công!');
          fetchBlogs();
        } catch (err: any) {
          message.error(err.message || 'Xóa blog thất bại');
        }
      },
    });
  };

  // Giả lập upload ảnh: chỉ lấy link từ input, thực tế có thể tích hợp upload cloud
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    setUrl(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh sách blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between p-8 mb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý Blog</h1>
              <p className="text-base text-gray-600">Quản lý các bài viết tin tức trong hệ thống</p>
            </div>
          </div>
          <Button type="primary" icon={<Plus />} className="!h-12 !px-8 !text-base !font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow" onClick={() => setIsAddModalOpen(true)}>
            Thêm blog
          </Button>
        </div>
        {/* Filter & Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề blog..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Blog List */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: 900 }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => {
                  const category = categories.find((c) => c._id === blog.categoryId);
                  return (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">
                        <div className="text-sm font-medium text-gray-900" title={blog.blogTitle}>
                          {blog.blogTitle.length > 20 ? blog.blogTitle.slice(0, 20) + '...' : blog.blogTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{blog.blogAuthor || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {typeof blog.categoryId === 'object' && blog.categoryId !== null
                            ? (blog.categoryId as any).categoryName
                            : categories.find((c) => c._id === blog.categoryId)?.categoryName || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {blog.blogImage && (
                          <img src={blog.blogImage} alt="blog" className="w-16 h-10 object-cover rounded" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleString('vi-VN') : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            type="link"
                            className="text-blue-600"
                            icon={<Edit className="w-5 h-5" />}
                            onClick={() => handleEditBlog(blog)}
                          />
                          <Button
                            type="link"
                            className="text-red-600"
                            icon={<Trash2 className="w-5 h-5" style={{ color: 'red' }} />}
                            onClick={() => handleDeleteBlog(blog)}
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
        {/* Modal for Add Blog */}
        <Modal
          title="Thêm blog mới"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form form={addForm} layout="vertical" onFinish={handleAddBlog}>
            <Form.Item
              label="Tiêu đề *"
              name="blogTitle"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Nội dung" name="blogContent">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Tác giả" name="blogAuthor">
              <Input />
            </Form.Item>
            <Form.Item label="Danh mục *" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}> 
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Link ảnh (URL)" name="blogImage">
              <Input
                placeholder="Dán link ảnh hoặc upload lên cloud"
                value={imageUrl}
                onChange={(e) => handleImageChange(e, setImageUrl)}
              />
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
        {/* Modal for Edit Blog */}
        <Modal
          title="Chỉnh sửa blog"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateBlog}
          >
            <Form.Item
              label="Tiêu đề *"
              name="blogTitle"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Nội dung" name="blogContent">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Tác giả" name="blogAuthor">
              <Input />
            </Form.Item>
            <Form.Item label="Danh mục *" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}> 
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Link ảnh (URL)" name="blogImage">
              <Input
                placeholder="Dán link ảnh hoặc upload lên cloud"
                value={editImageUrl}
                onChange={(e) => handleImageChange(e, setEditImageUrl)}
              />
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

export default BlogManagement;