import type React from "react"
import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-teal-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <span className="text-teal-700 font-bold text-xl">HC</span>
              </div>
              <span className="text-xl font-bold">HIV Care</span>
            </div>
            <p className="text-teal-100 mb-6">
              Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho người sống chung với HIV, với đội ngũ y bác sĩ
              chuyên nghiệp và tận tâm.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch Vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/testing" className="text-teal-100 hover:text-white transition-colors">
                  Tư vấn & Xét nghiệm
                </Link>
              </li>
              <li>
                <Link to="/services/treatment" className="text-teal-100 hover:text-white transition-colors">
                  Điều trị ARV
                </Link>
              </li>
              <li>
                <Link to="/services/support" className="text-teal-100 hover:text-white transition-colors">
                  Hỗ trợ tâm lý
                </Link>
              </li>
              <li>
                <Link to="/services/nutrition" className="text-teal-100 hover:text-white transition-colors">
                  Tư vấn dinh dưỡng
                </Link>
              </li>
              <li>
                <Link to="/services/homecare" className="text-teal-100 hover:text-white transition-colors">
                  Chăm sóc tại nhà
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Hữu Ích</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-teal-100 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-teal-100 hover:text-white transition-colors">
                  Đội ngũ bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-teal-100 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-teal-100 hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-teal-100 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 text-teal-300 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-teal-100">123 Đường Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-teal-300 mr-3 flex-shrink-0" />
                <span className="text-teal-100">1800-1234 (Miễn phí)</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-teal-300 mr-3 flex-shrink-0" />
                <span className="text-teal-100">info@hivcare.vn</span>
              </li>
              <li className="flex">
                <Clock className="h-5 w-5 text-teal-300 mr-3 flex-shrink-0" />
                <span className="text-teal-100">Thứ 2 - Thứ 7: 8:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-teal-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-teal-200 text-sm">© 2025 HIV Care. Tất cả quyền được bảo lưu.</p>
            <div className="mt-2 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                <li>
                  <Link to="/privacy" className="text-teal-200 hover:text-white transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-teal-200 hover:text-white transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
