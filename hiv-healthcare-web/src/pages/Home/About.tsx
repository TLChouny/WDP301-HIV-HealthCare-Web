import React from 'react';
import {
  Users,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chuyên Gia HIV",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    description: "15 năm kinh nghiệm trong điều trị HIV/AIDS"
  },
  {
    name: "Dr. Michael Chen",
    role: "Bác Sĩ Điều Trị",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    description: "Chuyên gia về liệu pháp ARV"
  },
  {
    name: "Emma Wilson",
    role: "Tư Vấn Viên",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    description: "Hỗ trợ tâm lý cho bệnh nhân HIV"
  }
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao và hỗ trợ toàn diện cho cộng đồng người nhiễm HIV.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sứ Mệnh</h3>
              <p className="text-gray-600">
                Cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao và hỗ trợ toàn diện cho người nhiễm HIV.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Giá Trị Cốt Lõi</h3>
              <p className="text-gray-600">
                Tôn trọng, đồng cảm, và cam kết mang đến sự chăm sóc tốt nhất cho mỗi bệnh nhân.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cam Kết</h3>
              <p className="text-gray-600">
                Bảo mật thông tin, chất lượng dịch vụ, và hỗ trợ liên tục cho bệnh nhân.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Dịch Vụ Của Chúng Tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Điều Trị ARV</h3>
                <p className="text-gray-600">Điều trị ARV hiện đại và theo dõi sát sao</p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                <Calendar className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Tư Vấn Sức Khỏe</h3>
                <p className="text-gray-600">Tư vấn chuyên sâu về sức khỏe và dinh dưỡng</p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                <Clock className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Hỗ Trợ 24/7</h3>
                <p className="text-gray-600">Luôn sẵn sàng hỗ trợ khi bạn cần</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Đội Ngũ Chuyên Gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-teal-600 mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div> */}

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-12">Liên Hệ Với Chúng Tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                <Phone className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Điện Thoại</h3>
                <p className="text-gray-600">1800-1234</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                <Mail className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600">info@hivcare.vn</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                <MapPin className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Địa Chỉ</h3>
                <p className="text-gray-600">123 Đường Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;