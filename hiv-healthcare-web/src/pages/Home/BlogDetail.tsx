import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Tag } from 'antd';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getBlogById } from '../../api/blogApi';
import { getAllCategories } from '../../api/categoryApi';
import type { Blog } from '../../types/blog';
import type { Category } from '../../types/category';
import '../../styles/BlogDetail.css';

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!id) return;
                
                const [blogData, categoryData] = await Promise.all([
                    getBlogById(id),
                    getAllCategories()
                ]);
                
                setBlog(blogData);
                
                // Get category name
                if (typeof blogData.categoryId === 'object' && blogData.categoryId !== null) {
                    setCategoryName((blogData.categoryId as any).categoryName);
                } else {
                    const found = categoryData.find((cat: Category) => cat._id === blogData.categoryId);
                    setCategoryName(found ? found.categoryName : '');
                }
            } catch (err) {
                console.error('Error fetching blog details:', err);
                toast.error('Không thể tải thông tin bài viết. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <h1 className="text-2xl text-gray-600">Blog không tồn tại</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Blog Image */}
            <div className="w-full h-[40vh] relative bg-gradient-to-r from-teal-700 to-teal-800">
                {blog.blogImage && (
                    <img
                        src={blog.blogImage}
                        alt={blog.blogTitle}
                        className="w-full h-full object-cover opacity-40"
                    />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center text-white">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            {blog.blogTitle}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-teal-100"
                        >
                            <span>{blog.blogAuthor || 'Ẩn danh'}</span> • 
                            <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Category */}
                    <div className="mb-8">
                        <span className="inline-block bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                            {categoryName}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div 
                            className="text-gray-700 leading-relaxed blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.blogContent || '' }}
                        />
                    </div>

                    {/* Tags if available */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {blog.tags.map(tag => (
                                <Tag key={tag} color="blue">{tag}</Tag>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BlogDetail;
