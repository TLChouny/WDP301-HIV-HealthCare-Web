import type React from "react"
import { Link } from "react-router-dom"
import { Heart, BookOpen, Calendar, Phone, Shield, Users, FileText } from "lucide-react"

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 lg:p-12">
          <div className="lg:w-3/5 text-white space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-2">
              <Heart className="w-4 h-4 mr-2 text-red-400" />
              <span>Chăm sóc sức khỏe toàn diện</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hệ Thống Dịch Vụ Y Tế HIV</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Hỗ trợ điều trị HIV toàn diện, đặt lịch khám dễ dàng, tra cứu xét nghiệm, và đồng hành cùng bạn trên hành
              trình chăm sóc sức khỏe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center bg-white text-teal-700 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-all hover:shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Đặt Lịch Khám
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-teal-700/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-teal-700/50 transition-all"
              >
                <Phone className="w-5 h-5 mr-2" />
                Tư Vấn Ngay
              </Link>
            </div>
          </div>
          <div className="lg:w-2/5 mt-8 lg:mt-0 flex justify-center">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Chăm sóc sức khỏe"
              className="w-64 h-64 object-cover rounded-full border-4 border-white/30 shadow-lg"
            />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 w-full"></div>
      </section>

      {/* Services Section */}
      <section className="py-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Cung cấp các dịch vụ chăm sóc sức khỏe toàn diện cho người sống chung với HIV
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar className="w-10 h-10 text-teal-600" />,
              title: "Đặt Lịch Khám",
              desc: "Đặt lịch khám trực tuyến nhanh chóng, tiết kiệm thời gian chờ đợi.",
            },
            {
              icon: <FileText className="w-10 h-10 text-teal-600" />,
              title: "Kết Quả Xét Nghiệm",
              desc: "Tra cứu kết quả xét nghiệm trực tuyến, bảo mật và an toàn.",
            },
            {
              icon: <Shield className="w-10 h-10 text-teal-600" />,
              title: "Tư Vấn Điều Trị",
              desc: "Đội ngũ bác sĩ chuyên khoa tư vấn phác đồ điều trị phù hợp.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 flex flex-col items-center text-center group hover:border-teal-200"
            >
              <div className="p-3 bg-teal-50 rounded-full mb-4 group-hover:bg-teal-100 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
              <Link to="#" className="mt-4 text-teal-600 font-medium hover:text-teal-700 inline-flex items-center">
                Tìm hiểu thêm
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Resources */}
      <section className="py-4 bg-gray-50 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tài Liệu Giáo Dục</h2>
            <p className="text-gray-600">Kiến thức cần thiết về HIV và cách chăm sóc sức khỏe</p>
          </div>
          <Link
            to="/resources"
            className="mt-4 md:mt-0 inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
          >
            Xem tất cả tài liệu
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-red-500" />,
              title: "Hiểu Biết HIV",
              desc: "Tài liệu cơ bản về HIV/AIDS, cách phòng ngừa và điều trị.",
              link: "#",
              color: "bg-red-50 border-red-100",
            },
            {
              icon: <Users className="w-6 h-6 text-teal-500" />,
              title: "Sống Chung Với HIV",
              desc: "Hành trình vượt qua kỳ thị và sống tích cực với HIV.",
              link: "#",
              color: "bg-teal-50 border-teal-100",
            },
            {
              icon: <Shield className="w-6 h-6 text-blue-500" />,
              title: "Phác Đồ ARV",
              desc: "Thông tin chi tiết về các phác đồ điều trị HIV hiện đại.",
              link: "#",
              color: "bg-blue-50 border-blue-100",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border ${item.color} flex flex-col h-full`}
            >
              <div className="flex items-start mb-4">
                <div className={`p-2 rounded-lg ${item.color}`}>{item.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 flex-grow">{item.desc}</p>
              <a
                href={item.link}
                className="mt-4 inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
              >
                Tải xuống
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Blog Chia Sẻ</h2>
            <p className="text-gray-600">Câu chuyện và kinh nghiệm từ cộng đồng</p>
          </div>
          <Link
            to="/blog"
            className="mt-4 md:mt-0 inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
          >
            Xem tất cả bài viết
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              image: "/placeholder.svg?height=400&width=600",
              title: "Hành Trình Sống Chung Với HIV",
              desc: "Câu chuyện truyền cảm hứng từ những người đã vượt qua khó khăn và sống tích cực với HIV.",
              author: "Bs. Nguyễn Văn A",
              date: "15/05/2025",
              link: "#",
            },
            {
              image: "/placeholder.svg?height=400&width=600",
              title: "Giảm Kỳ Thị HIV Trong Cộng Đồng",
              desc: "Những nỗ lực và giải pháp giúp giảm kỳ thị và phân biệt đối xử với người sống chung với HIV.",
              author: "Ths. Trần Thị B",
              date: "10/05/2025",
              link: "#",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col h-full border border-gray-100"
            >
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{item.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{item.author}</span>
                      <span className="mx-1">•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <a
                    href={item.link}
                    className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
                  >
                    Đọc thêm
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Cần Hỗ Trợ Ngay?</h2>
            <p className="text-white/90 text-lg">
              Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ ngay để được giải đáp mọi
              thắc mắc.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/hotline"
              className="inline-flex items-center justify-center bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-all"
            >
              <Phone className="w-5 h-5 mr-2" />
              Gọi Hotline
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center bg-red-700/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-red-700/50 transition-all"
            >
              Tư Vấn Trực Tuyến
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
