import React from 'react';
import { Shield, Pill, Heart, Clock, Users, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ARVTherapy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-teal-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-800/90"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Điều Trị ARV - Giải Pháp Hiệu Quả Cho Cuộc Sống Khỏe Mạnh
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8">
              Liệu pháp ARV hiện đại giúp kiểm soát virus HIV, ngăn ngừa tiến triển thành AIDS và duy trì chất lượng cuộc sống tốt nhất cho người bệnh.
            </p>
            <Link
              to="/appointment"
              className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-all duration-300"
            >
              Tư vấn điều trị
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Treatment Overview */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Liệu Pháp ARV Là Gì?</h2>
            <p className="text-gray-600 mb-6">
              Liệu pháp ARV (Antiretroviral) là phương pháp điều trị HIV bằng cách sử dụng các loại thuốc kháng virus. 
              Khi được sử dụng đúng cách, ARV có thể:
            </p>
            <ul className="space-y-3">
              {[
                "Ức chế sự nhân lên của virus HIV",
                "Duy trì tải lượng virus ở mức không phát hiện",
                "Tăng cường hệ miễn dịch",
                "Ngăn ngừa lây truyền HIV",
                "Cải thiện chất lượng cuộc sống"
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <img 
              src="/images/arv-treatment.jpg" 
              alt="ARV Treatment" 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400/teal/white?text=ARV+Treatment';
              }}
            />
          </div>
        </div>
      </div>

      {/* Treatment Protocols */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Phác Đồ Điều Trị ARV</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Pill className="h-12 w-12 text-teal-600" />,
                title: "Phác Đồ Bậc 1",
                description: "Phác đồ cơ bản cho người mới bắt đầu điều trị, thường bao gồm 3 loại thuốc ARV"
              },
              {
                icon: <Shield className="h-12 w-12 text-teal-600" />,
                title: "Phác Đồ Bậc 2",
                description: "Phác đồ thay thế khi phác đồ bậc 1 không hiệu quả hoặc có tác dụng phụ"
              },
              {
                icon: <Heart className="h-12 w-12 text-teal-600" />,
                title: "Phác Đồ Bậc 3",
                description: "Phác đồ dự phòng cho các trường hợp đặc biệt và phức tạp"
              }
            ].map((protocol, index) => (
              <div key={index} className="bg-teal-50 p-8 rounded-xl">
                <div className="mb-4">{protocol.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{protocol.title}</h3>
                <p className="text-gray-600">{protocol.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Effects Management */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Quản Lý Tác Dụng Phụ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Tác Dụng Phụ Thường Gặp</h3>
            <ul className="space-y-3">
              {[
                "Buồn nôn và nôn",
                "Mệt mỏi",
                "Đau đầu",
                "Rối loạn giấc ngủ",
                "Phát ban nhẹ"
              ].map((effect, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span className="text-gray-700">{effect}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Cách Khắc Phục</h3>
            <ul className="space-y-3">
              {[
                "Uống thuốc đúng giờ",
                "Ăn uống đầy đủ dinh dưỡng",
                "Nghỉ ngơi hợp lý",
                "Tập thể dục nhẹ nhàng",
                "Thông báo với bác sĩ khi có dấu hiệu bất thường"
              ].map((solution, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                  <span className="text-gray-700">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-teal-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Chuyện Thành Công</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Anh N.V.A",
                story: "Sau 2 năm điều trị ARV, tải lượng virus của tôi đã giảm xuống dưới ngưỡng phát hiện. Tôi có thể sống bình thường và làm việc hiệu quả.",
                duration: "2 năm điều trị"
              },
              {
                name: "Chị T.T.B",
                story: "Nhờ tuân thủ điều trị và được tư vấn tốt, tôi đã vượt qua được giai đoạn khó khăn ban đầu. Giờ đây tôi có thể chăm sóc gia đình và sống hạnh phúc.",
                duration: "3 năm điều trị"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-gray-600 mb-4 italic">"{story.story}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-teal-700">{story.name}</span>
                  <span className="text-sm text-gray-500">{story.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bắt Đầu Hành Trình Điều Trị Ngay Hôm Nay</h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẽ đồng hành cùng bạn trong suốt quá trình điều trị, 
            đảm bảo hiệu quả tốt nhất và chất lượng cuộc sống cao nhất.
          </p>
          <Link
            to="/appointment"
            className="inline-flex items-center px-8 py-4 bg-white text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-all duration-300"
          >
            Đặt lịch tư vấn
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ARVTherapy; 