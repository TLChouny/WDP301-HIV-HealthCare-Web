import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceById } from '../../api/serviceApi';
import { getCategoryById } from '../../api/categoryApi';
import type { Service } from '../../types/service';
import type { Category } from '../../types/category';
import { ArrowLeft } from 'lucide-react';
import { message, Spin, Card, Descriptions, Image, Tag, Button } from 'antd';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchServiceDetail = async () => {
        setLoading(true);
        try {
          const serviceData = await getServiceById(id);
          setService(serviceData);
          
          // Assuming categoryId is available and we can fetch category details
          // This might need a new API endpoint if categoryId is an object
          const categoryId = typeof serviceData.categoryId === 'object' 
            ? serviceData.categoryId._id 
            : serviceData.categoryId;
            
          if (categoryId) {
            const categoryData = await getCategoryById(categoryId);
            setCategory(categoryData);
          }

        } catch (err: any) {
          message.error(err.message || 'Lỗi khi tải chi tiết dịch vụ');
        } finally {
          setLoading(false);
        }
      };
      fetchServiceDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!service) {
    return (
        <div className="text-center mt-10">
            <p>Không tìm thấy dịch vụ.</p>
            <Link to="/admin/services">
                <Button type="primary" icon={<ArrowLeft />} className="mt-4">
                    Quay lại danh sách
                </Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Link to="/admin/services">
                <Button type="text" icon={<ArrowLeft className="mr-2" />}>
                    Quay lại danh sách dịch vụ
                </Button>
            </Link>
        </div>

        <Card title="Chi tiết dịch vụ">
            <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
                <Descriptions.Item label="Tên dịch vụ">{service.serviceName}</Descriptions.Item>
                
                <Descriptions.Item label="Hình ảnh">
                    {service.serviceImage ? (
                        <Image width={200} src={service.serviceImage} alt={service.serviceName} />
                    ) : (
                        'Không có ảnh'
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Mô tả">
                    {service.serviceDescription || 'Không có mô tả'}
                </Descriptions.Item>
                
                <Descriptions.Item label="Danh mục">
                    {category ? <Tag color="blue">{category.categoryName}</Tag> : 'Không rõ'}
                </Descriptions.Item>

                <Descriptions.Item label="Giá (VNĐ)">
                    {service.price ? Number(service.price).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                </Descriptions.Item>

                <Descriptions.Item label="Thời lượng (phút)">
                    {service.duration || 'Chưa cập nhật'}
                </Descriptions.Item>

            </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDetail; 