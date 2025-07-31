import React from "react";
import { Phone, Calendar } from "lucide-react";
import doingubacsi2 from "../../assets/doingubacsi2.png";
import AnimatedElement from "../Home/AnimatedElement";
import ParallaxSection from "../Home/ParallaxSection";

const HomeCareSection: React.FC = () => {
  return (
    <ParallaxSection speed={0.15} className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <AnimatedElement animationType="fade-right" duration={1000} className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="group">
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full bg-teal-500/20 rounded-lg -z-10"></div>
                <img src={doingubacsi2 || "/placeholder.svg"} alt="Chăm sóc tại nhà" className="rounded-lg shadow-xl transition-all duration-800 group-hover:shadow-2xl relative z-10" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-70 z-0 transition-transform duration-500 group-hover:scale-125"></div>
              </div>
            </div>
          </AnimatedElement>
          <div className="lg:w-1/2 lg:pl-16">
            <AnimatedElement animationType="fade-left" duration={800}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Bạn Đang Gặp Vấn Đề Nào? </h2>
            </AnimatedElement>
            <AnimatedElement animationType="fade-up" delay={300} duration={800}>
              <p className="text-gray-600 mb-8 text-lg">
                Đừng để những lo lắng về HIV ảnh hưởng đến sức khỏe và chất lượng cuộc sống của bạn. Việc phát hiện và điều trị sớm là yếu tố quan trọng giúp kiểm soát bệnh hiệu quả, bảo vệ chính bạn và những người xung quanh. Tại HIV Care, đội ngũ bác sĩ chuyên khoa với nhiều năm kinh nghiệm sẽ hỗ trợ bạn từ tư vấn, xét nghiệm đến điều trị theo phác đồ chuẩn. Tất cả đều được thực hiện trong môi trường an toàn, bảo mật tuyệt đối và không kỳ thị.
              </p>
            </AnimatedElement>
            <AnimatedElement animationType="fade-up" delay={500} duration={800}>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  disabled
                  className="bg-teal-400 text-white py-3 px-6 rounded-lg font-medium flex items-center group opacity-60 cursor-not-allowed"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span>Sắp ra mắt</span>
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="bg-white border border-teal-600 text-teal-600 py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-teal-50 hover:shadow-md active:scale-95 active:bg-teal-100 flex items-center group"
                >
                  <Calendar className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Đặt Lịch</span>
                </button>
              </div>
            </AnimatedElement>

          </div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default HomeCareSection;