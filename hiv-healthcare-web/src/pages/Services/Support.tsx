import React from 'react';
import { 
  Heart,
  MessageSquare,
  Users,
  AlertCircle,
  Calendar,
  Clock,
  Phone,
  Video,
  Shield,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Support: React.FC = () => {
  const supportServices = [
    {
      id: 1,
      title: 'Tư vấn tâm lý cá nhân',
      description: 'Hỗ trợ tâm lý 1-1 với chuyên gia tư vấn giàu kinh nghiệm',
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      features: [
        'Tư vấn về stress và lo âu',
        'Hỗ trợ đối phó với bệnh tật',
        'Tư vấn về mối quan hệ',
        'Hỗ trợ tâm lý sau chẩn đoán'
      ],
      duration: '60 phút',
      price: 'Miễn phí'
    },
    {
      id: 2,
      title: 'Trị liệu tâm lý',
      description: 'Điều trị chuyên sâu với các chuyên gia tâm lý',
      icon: <Heart className="w-8 h-8 text-purple-600" />,
      features: [
        'Đánh giá tâm lý toàn diện',
        'Kế hoạch điều trị cá nhân',
        'Theo dõi tiến triển',
        'Hỗ trợ dài hạn'
      ],
      duration: '90 phút',
      price: 'Miễn phí'
    },
    {
      id: 3,
      title: 'Nhóm hỗ trợ đồng đẳng',
      description: 'Chia sẻ và học hỏi từ những người có cùng hoàn cảnh',
      icon: <Users className="w-8 h-8 text-green-600" />,
      features: [
        'Chia sẻ kinh nghiệm',
        'Học hỏi từ người khác',
        'Xây dựng mạng lưới hỗ trợ',
        'Các hoạt động nhóm'
      ],
      duration: '120 phút',
      price: 'Miễn phí'
    },
    {
      id: 4,
      title: 'Can thiệp khủng hoảng',
      description: 'Hỗ trợ khẩn cấp trong các tình huống khủng hoảng',
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      features: [
        'Hỗ trợ 24/7',
        'Can thiệp ngay lập tức',
        'Kết nối với chuyên gia',
        'Theo dõi sau can thiệp'
      ],
      duration: 'Theo nhu cầu',
      price: 'Miễn phí'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      content: 'Các buổi tư vấn đã giúp tôi vượt qua giai đoạn khó khăn và có thêm động lực để tiếp tục điều trị.',
      date: '15/03/2024'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      content: 'Nhóm hỗ trợ đồng đẳng đã cho tôi cơ hội được chia sẻ và học hỏi từ những người có cùng hoàn cảnh.',
      date: '10/03/2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Hỗ trợ tâm lý</h1>
            <p className="text-xl mb-8">
              Chúng tôi cung cấp các dịch vụ hỗ trợ tâm lý toàn diện để giúp bạn vượt qua những khó khăn
            </p>
            <Link
              to="/appointment"
              className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center space-x-2"
            >
              <span>Đặt lịch tư vấn</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <span className="font-medium text-teal-600">{service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Chia sẻ từ người dùng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Bạn không đơn độc</h2>
          <p className="text-xl mb-8">
            Hãy để chúng tôi đồng hành cùng bạn trong hành trình vượt qua khó khăn
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/appointment"
              className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center justify-center space-x-2"
            >
              <span>Đặt lịch tư vấn</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:19001234"
              className="bg-teal-600 hover:bg-teal-500 px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Gọi ngay: 1900 1234</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 