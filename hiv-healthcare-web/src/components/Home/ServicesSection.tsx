import React from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, Users, ArrowRight } from "lucide-react";
import AnimatedElement from "../Home/AnimatedElement";

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-800 to-teal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full opacity-10 blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedElement animationType="fade-up" duration={800} className="mb-12">
          <h2 className="text-3xl font-bold text-center relative inline-block mx-auto">
            <span className="relative z-10">Dịch Vụ Dành Cho Bạn</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-600/50 -z-10 transform -rotate-1"></span>
          </h2>
        </AnimatedElement>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FileText className="h-10 w-10 text-teal-200 transition-transform duration-300 group-hover:scale-110" />, title: "Tư Vấn & Xét Nghiệm", description: "Tư vấn trước và sau xét nghiệm HIV, xét nghiệm nhanh và bảo mật kết quả.", link: "/services/testing" },
            { icon: <Shield className="h-10 w-10 text-teal-200 transition-transform duration-300 group-hover:scale-110" />, title: "Điều Trị ARV", description: "Điều trị ARV hiện đại, theo dõi tải lượng virus và tư vấn tuân thủ điều trị.", link: "/services/treatment" },
            { icon: <Users className="h-10 w-10 text-teal-200 transition-transform duration-300 group-hover:scale-110" />, title: "Hỗ Trợ Tâm Lý", description: "Tư vấn tâm lý cá nhân và nhóm, hỗ trợ vượt qua khó khăn và kỳ thị.", link: "/services/support" },
          ].map((service, index) => (
            <AnimatedElement key={index} animationType="zoom-in" delay={300 + index * 150} duration={800}>
              <div className="group bg-teal-700/80 backdrop-blur-sm rounded-lg p-6 transition-all duration-500 hover:bg-teal-600 hover:-translate-y-2 hover:shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-4 transition-transform duration-500 group-hover:scale-110">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 transition-transform duration-300 group-hover:translate-y-[-2px]">{service.title}</h3>
                  <p className="text-teal-100 mb-4 transition-all duration-300 group-hover:text-white">{service.description}</p>
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;