import React from "react";
import { Shield, Heart, Users, Info } from "lucide-react";
import doingubacsi3 from "../../assets/doingubacsi3.png";
import AnimatedElement from "../Home/AnimatedElement";

const ExperiencedStaffSection: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full opacity-70 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full opacity-70 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0">
            <AnimatedElement animationType="fade-right" duration={800}>
              <h2 className="text-3xl font-bold text-teal-700 mb-6 relative">
                <span className="relative z-10">Đội Ngũ Y Bác Sĩ Giàu Kinh Nghiệm</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
              </h2>
            </AnimatedElement>
            <AnimatedElement animationType="fade-up" delay={200} duration={800}>
              <p className="text-gray-600 mb-8">
                Đội ngũ y bác sĩ của chúng tôi có nhiều năm kinh nghiệm trong lĩnh vực điều trị và chăm sóc HIV/AIDS. Họ không chỉ giỏi chuyên môn mà còn tận tâm, nhiệt tình và luôn đặt bệnh nhân lên hàng đầu.
              </p>
            </AnimatedElement>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: <Shield className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Chuyên Môn Cao", description: "Được đào tạo bài bản" },
                { icon: <Heart className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Tận Tâm", description: "Đặt bệnh nhân lên hàng đầu" },
                { icon: <Users className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Không Kỳ Thị", description: "Môi trường thân thiện" },
                { icon: <Info className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Cập Nhật", description: "Phương pháp điều trị mới nhất" },
              ].map((feature, index) => (
                <AnimatedElement key={index} animationType="fade-up" delay={400 + index * 150} duration={800}>
                  <div className="group flex items-center transition-all duration-500 hover:bg-teal-50 p-3 rounded-lg hover:shadow-md">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4 transition-all duration-300 group-hover:bg-teal-200 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px]">{feature.title}</h3>
                      <p className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
          <AnimatedElement animationType="fade-left" delay={300} duration={1000} className="lg:w-1/2">
            <div className="relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full opacity-50 -z-10 transform translate-x-10 -translate-y-10 transition-all duration-500"></div>
              <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                <img src={doingubacsi3 || "/placeholder.svg"} alt="Bác sĩ chuyên khoa" className="rounded-lg transition-all duration-500" />
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
};

export default ExperiencedStaffSection;