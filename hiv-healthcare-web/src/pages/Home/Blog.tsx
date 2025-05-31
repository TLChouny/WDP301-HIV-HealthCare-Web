import React, { useState } from 'react';
import { Input, Select, Pagination, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';


interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    imageUrl: string;
    tags: string[];
}

const { Search } = Input;
const { Option } = Select;

const MOCK_POSTS: BlogPost[] = [
    {
        id: 1,
        title: 'Hiểu về HIV/AIDS: Những điều cần biết',
        excerpt: 'HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Virus này tấn công hệ thống miễn dịch và làm suy yếu khả năng chống lại các bệnh nhiễm trùng và một số loại ung thư...',
        category: 'Kiến thức cơ bản',
        author: 'Dr. Nguyễn Văn A',
        date: '2024-03-15',
        imageUrl: 'https://ninhthanh.tayninh.gov.vn/uploads/news/2024_01/hiv.png',
        tags: ['HIV', 'AIDS', 'Sức khỏe']
    },
    {
        id: 2,
        title: 'Phương pháp điều trị ARV hiện đại',
        excerpt: 'Điều trị ARV (Anti-RetroViral) là phương pháp sử dụng các thuốc kháng virus để điều trị HIV. Phương pháp này giúp ngăn chặn sự nhân lên của virus HIV trong cơ thể...',
        category: 'Điều trị',
        author: 'Dr. Trần Thị B',
        date: '2024-03-14',
        imageUrl: 'https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/arv_thuoc_dieu_tri_hiv_va_nhung_thong_tin_huu_ich_can_biet_g_Za_YJ_1676799639_6e6711f859.jpg',
        tags: ['ARV', 'Điều trị', 'Thuốc']
    },
    {
        id: 3,
        title: 'Chế độ dinh dưỡng cho người nhiễm HIV',
        excerpt: 'Dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe và tăng cường hệ miễn dịch cho người nhiễm HIV. Một chế độ ăn cân bằng và đầy đủ dưỡng chất...',
        category: 'Dinh dưỡng',
        author: 'Dr. Lê Văn C',
        date: '2024-03-13',
        imageUrl: 'https://cdn.tgdd.vn/Files/2023/12/14/1557511/nguoi-nhiem-hiv-nen-an-gi-dinh-duong-cho-benh-nhan-dang-dieu-tri-hiv-202312141134481810.jpeg',
        tags: ['Dinh dưỡng', 'Sức khỏe', 'Thực phẩm']
    },
    {
        id: 4,
        title: 'Phòng ngừa lây nhiễm HIV trong cộng đồng',
        excerpt: 'Việc nâng cao nhận thức và thực hiện các biện pháp phòng ngừa là yếu tố then chốt trong việc kiểm soát sự lây lan của HIV. Bao gồm sử dụng bao cao su, không dùng chung kim tiêm và xét nghiệm định kỳ...',
        category: 'Phòng ngừa',
        author: 'Dr. Mai Thị D',
        date: '2024-03-12',
        imageUrl: 'https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/cach_phong_tranh_hiv_cho_minh_va_cho_cong_dong_1_0479728128.jpg',
        tags: ['Phòng ngừa', 'Bao cao su', 'Xét nghiệm']
    },
    {
        id: 5,
        title: 'Tư vấn tâm lý cho người sống chung với HIV',
        excerpt: 'Tư vấn tâm lý đóng vai trò quan trọng trong việc hỗ trợ người nhiễm HIV đối mặt với khó khăn tâm lý, cải thiện chất lượng cuộc sống và tuân thủ điều trị tốt hơn...',
        category: 'Hỗ trợ tâm lý',
        author: 'Chuyên gia tâm lý Phạm Thị E',
        date: '2024-03-11',
        imageUrl: 'https://baothainguyen.vn/file/e7837c027f6ecd14017ffa4e5f2a0e34/042024/hiv-20240315144911120-1711963431455328793976_20240401194402.png',
        tags: ['Tâm lý', 'Hỗ trợ', 'HIV']
    },
    {
        id: 6,
        title: 'Vai trò của xét nghiệm sớm trong phòng chống HIV',
        excerpt: 'Xét nghiệm HIV giúp phát hiện sớm và can thiệp kịp thời, đồng thời góp phần ngăn ngừa lây nhiễm cho cộng đồng. Người có nguy cơ nên xét nghiệm định kỳ để bảo vệ bản thân và người khác...',
        category: 'Xét nghiệm',
        author: 'Dr. Hồ Văn F',
        date: '2024-03-10',
        imageUrl: 'https://cdn.thuvienphapluat.vn/uploads/tintuc/2024/03/16/xet-nghiem-hiv.jpg',
        tags: ['Xét nghiệm', 'Phát hiện sớm', 'HIV']
    },
    {
        id: 7,
        title: 'Tầm quan trọng của giáo dục giới tính trong phòng HIV',
        excerpt: 'Giáo dục giới tính giúp nâng cao nhận thức cho thanh thiếu niên về HIV và cách phòng tránh. Đây là một công cụ quan trọng trong chiến lược phòng chống HIV toàn diện...',
        category: 'Giáo dục',
        author: 'TS. Nguyễn Thị G',
        date: '2024-03-09',
        imageUrl: 'https://static.wixstatic.com/media/ca3686_e1a926efb635436f8504a8416f4d4217~mv2.jpeg/v1/fill/w_845,h_500,al_c,q_85/ca3686_e1a926efb635436f8504a8416f4d4217~mv2.jpeg',
        tags: ['Giới tính', 'Giáo dục', 'Phòng tránh']
    },
    {
        id: 8,
        title: 'Người nhiễm HIV có thể sống khỏe mạnh',
        excerpt: 'Với sự phát triển của y học hiện đại, người nhiễm HIV có thể sống khỏe mạnh và sống lâu như người bình thường nếu tuân thủ điều trị và lối sống lành mạnh...',
        category: 'Cuộc sống',
        author: 'Dr. Phan Văn H',
        date: '2024-03-08',
        imageUrl: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/10/17/photo-1729180113186-17291801133041254859829.png',
        tags: ['Sống khỏe', 'HIV', 'Lối sống']
    },
    {
        id: 9,
        title: 'Những hiểu lầm phổ biến về HIV/AIDS',
        excerpt: 'Nhiều người vẫn còn hiểu sai về cách lây truyền và điều trị HIV. Bài viết sẽ giải đáp những quan niệm sai lầm phổ biến và cung cấp thông tin chính xác từ chuyên gia...',
        category: 'Giải đáp thắc mắc',
        author: 'Dr. Lâm Thanh I',
        date: '2024-03-07',
        imageUrl: 'https://static.tuoitre.vn/tto/i/s626/2013/11/21/KhH58BHD.jpg',
        tags: ['Hiểu lầm', 'Thông tin đúng', 'HIV']
    }
];


const BlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const categories = [
        { value: 'all', label: 'Tất cả' },
        { value: 'Kiến thức cơ bản', label: 'Kiến thức cơ bản' },
        { value: 'Điều trị', label: 'Điều trị' },
        { value: 'Dinh dưỡng', label: 'Dinh dưỡng' },
        { value: 'Tâm lý', label: 'Tâm lý' },
        { value: 'Đời sống', label: 'Đời sống' },
    ];

    const filteredPosts = MOCK_POSTS.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        defaultValue="all"
                        size="large"
                        style={{ minWidth: 200 }}
                        onChange={(value: string) => setSelectedCategory(value)}
                    >
                        {categories.map(category => (
                            <Option key={category.value} value={category.value}>
                                {category.label}
                            </Option>
                        ))}
                    </Select>
                </motion.div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {currentPosts.map(post => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
                                <div className="text-gray-500 text-xs mb-2">
                                    <span>{post.author}</span> • <span>{post.date}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <Tag key={tag} color="blue">{tag}</Tag>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

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