import React from 'react';
import { Shield, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Treatment: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-teal-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-800/90"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Điều Trị ARV - Hành Trình Hướng Tới Cuộc Sống Khỏe Mạnh
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8">
              Chúng tôi cung cấp dịch vụ điều trị ARV toàn diện, kết hợp với chăm sóc y tế chất lượng cao và hỗ trợ tâm lý để giúp bạn duy trì sức khỏe tốt nhất.
            </p>
            <Link
              to="/appointment"
              className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-all duration-300"
            >
              Đặt lịch tư vấn
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Shield className="h-12 w-12 text-teal-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Điều Trị Toàn Diện</h3>
            <p className="text-gray-600">
              Phác đồ điều trị ARV hiện đại, được cá nhân hóa theo tình trạng sức khỏe và nhu cầu của từng bệnh nhân.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Clock className="h-12 w-12 text-teal-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Theo Dõi Định Kỳ</h3>
            <p className="text-gray-600">
              Kiểm tra tải lượng virus thường xuyên và đánh giá hiệu quả điều trị để đảm bảo kết quả tốt nhất.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Users className="h-12 w-12 text-teal-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Hỗ Trợ Tận Tâm</h3>
            <p className="text-gray-600">
              Đội ngũ y bác sĩ chuyên môn cao, tư vấn viên và nhân viên hỗ trợ luôn sẵn sàng đồng hành cùng bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quy Trình Điều Trị</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Tư Vấn Ban Đầu",
                description: "Đánh giá tình trạng sức khỏe và tư vấn về phác đồ điều trị phù hợp"
              },
              {
                step: "2",
                title: "Xét Nghiệm",
                description: "Thực hiện các xét nghiệm cần thiết để xác định tình trạng và lựa chọn thuốc"
              },
              {
                step: "3",
                title: "Bắt Đầu Điều Trị",
                description: "Bắt đầu điều trị ARV với sự theo dõi chặt chẽ của bác sĩ"
              },
              {
                step: "4",
                title: "Theo Dõi Định Kỳ",
                description: "Kiểm tra định kỳ và điều chỉnh phác đồ khi cần thiết"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-teal-50 p-6 rounded-lg h-full">
                  <div className="text-2xl font-bold text-teal-600 mb-4">{item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-teal-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Lợi Ích Khi Điều Trị Tại Chúng Tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            "Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm",
            "Phác đồ điều trị hiện đại, được cập nhật thường xuyên",
            "Hệ thống theo dõi và chăm sóc toàn diện",
            "Bảo mật thông tin tuyệt đối",
            "Hỗ trợ tâm lý và tư vấn dinh dưỡng",
            "Chi phí hợp lý, có chính sách hỗ trợ"
          ].map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bắt Đầu Hành Trình Hồi Phục Ngay Hôm Nay</h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt quá trình điều trị.
          </p>
          <Link
            to="/appointment"
            className="inline-flex items-center px-8 py-4 bg-white text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-all duration-300"
          >
            Đặt lịch tư vấn ngay
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Treatment; 