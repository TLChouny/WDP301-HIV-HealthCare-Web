import React from "react";
import { FileText, Shield, Heart, Users } from "lucide-react";
import AnimatedElement from "../Home/AnimatedElement";

const ServicesIconsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedElement animationType="fade-up" duration={800} className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 relative inline-block mx-auto">
            <span className="relative z-10">Dịch Vụ Nổi Bật</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
          </h2>
        </AnimatedElement>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <FileText className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Tư Vấn Xét Nghiệm", description: "Tư vấn trước và sau xét nghiệm HIV miễn phí, bảo mật và không kỳ thị" },
            { icon: <Shield className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Điều Trị ARV", description: "Điều trị ARV hiện đại, theo dõi sát sao và hỗ trợ tuân thủ điều trị" },
            { icon: <Heart className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Chăm Sóc Toàn Diện", description: "Chăm sóc sức khỏe toàn diện cho người sống chung với HIV" },
            { icon: <Users className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, title: "Hỗ Trợ Tâm Lý", description: "Tư vấn tâm lý và hỗ trợ xã hội cho người nhiễm và gia đình" },
          ].map((service, index) => (
            <AnimatedElement key={index} animationType="zoom-in" delay={300 + index * 150} duration={800}>
              <div className="group text-center p-6 border border-gray-100 rounded-lg transition-all duration-500 hover:shadow-xl hover:border-teal-100 hover:-translate-y-2 bg-white relative overflow-hidden flex flex-col items-center h-full min-h-[260px]">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col flex-1 items-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 mb-4 transition-all duration-500 group-hover:bg-teal-100 group-hover:scale-110 group-hover:shadow-md">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px]">{service.title}</h3>
                  <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-700 flex-1 flex items-center text-center">{service.description}</p>
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesIconsSection;