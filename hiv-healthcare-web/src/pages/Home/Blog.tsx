import React, { useEffect, useState } from 'react';
import { Input, Select, Pagination, Tag, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllBlogs } from '../../api/blogApi';
import { getAllCategories } from '../../api/categoryApi';
import type { Blog } from '../../types/blog';
import type { Category } from '../../types/category';

// Helper function để chuyển đổi HTML content thành plain text
const stripHtmlAndTruncate = (html: string, maxLength: number) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || '';
    return textContent.length > maxLength 
        ? `${textContent.slice(0, maxLength)}...` 
        : textContent;
};

const { Search } = Input;
const { Option } = Select;

const BlogPage: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const postsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [blogData, categoryData] = await Promise.all([
                    getAllBlogs(),
                    getAllCategories()
                ]);
                setBlogs(blogData);
                setCategories(categoryData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Lỗi khi lấy dữ liệu blog/category:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categoryOptions = [
        { value: 'all', label: 'Tất cả' },
        ...categories.map((cat) => ({ value: cat._id, label: cat.categoryName }))
    ];

    const filteredPosts = blogs.filter((post) => {
        const matchesSearch = post.blogTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.blogContent?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesCategory = selectedCategory === 'all' || post.categoryId === selectedCategory || (typeof post.categoryId === 'object' && (post.categoryId as any)._id === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
                        <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                            Cập nhật kiến thức, chia sẻ thông tin và câu chuyện về sức khỏe và cộng đồng.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Search + Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-4 mb-8"
                >
                    <Search
                        placeholder="Tìm kiếm bài viết..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        className="md:w-96"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        value={selectedCategory}
                        size="large"
                        style={{ minWidth: 200 }}
                        onChange={(value: string) => {
                            setSelectedCategory(value);
                            setCurrentPage(1);
                        }}
                    >
                        {categoryOptions.map((category) => (
                            <Option key={category.value} value={category.value}>
                                {category.label}
                            </Option>
                        ))}
                    </Select>
                </motion.div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Spin size="large" />
                    </div>
                ) : currentPosts.length === 0 ? (
                    <Empty description="Không có bài viết nào" className="my-12" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {currentPosts.map((post) => {
                            // Lấy tên danh mục
                            let categoryName = '';
                            if (typeof post.categoryId === 'object' && post.categoryId !== null) {
                                categoryName = (post.categoryId as any).categoryName;
                            } else {
                                const found = categories.find((cat) => cat._id === post.categoryId);
                                categoryName = found ? found.categoryName : '';
                            }
                            return (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => navigate(`/blog/${post._id}`)}
                                >
                                    {post.blogImage && (
                                        <img
                                            src={post.blogImage}
                                            alt={post.blogTitle}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h2 className="text-xl font-semibold mb-2">{post.blogTitle}</h2>
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                                            {(() => {
                                                if (!post.blogContent) return '';
                                                const div = document.createElement('div');
                                                div.innerHTML = post.blogContent;
                                                const text = div.textContent || div.innerText || '';
                                                return text.length > 120 ? text.slice(0, 120) + '...' : text;
                                            })()}
                                        </p>
                                        <div className="text-gray-500 text-xs mb-2">
                                            <span>{post.blogAuthor || 'Ẩn danh'}</span> • <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                                        </div>
                                        <div className="text-xs text-teal-700 mb-2 font-medium">
                                            {categoryName}
                                        </div>
                                        {/* Nếu có tags thì render Tag */}
                                        {/* <div className="flex flex-wrap gap-2">
                                            {post.tags?.map(tag => (
                                                <Tag key={tag} color="blue">{tag}</Tag>
                                            ))}
                                        </div> */}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-12"
                >
                    <Pagination
                        current={currentPage}
                        total={filteredPosts.length}
                        pageSize={postsPerPage}
                        onChange={page => setCurrentPage(page)}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default BlogPage;