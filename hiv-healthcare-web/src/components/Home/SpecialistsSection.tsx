import React from "react";
import { FileText, Shield, Heart, Users, Info } from "lucide-react";
import AnimatedElement from "../Home/AnimatedElement";
import StaggerContainer from "../Home/StaggerContainer";

const SpecialistsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedElement animationType="fade-up" duration={800} className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 relative inline-block mx-auto">
            <span className="relative z-10">Tìm Kiếm Theo Chuyên Khoa</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
          </h2>
        </AnimatedElement>
        <StaggerContainer staggerDelay={100} initialDelay={300} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[
            { icon: <FileText className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, name: "Tư Vấn Xét Nghiệm" },
            { icon: <Shield className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, name: "Điều Trị ARV" },
            { icon: <Users className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, name: "Tâm Lý" },
            { icon: <Info className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />, name: "Bệnh Đồng Nhiễm" },
          ].map((specialist, index) => (
            <div key={index} className="group flex flex-col items-center p-4 border border-gray-100 rounded-lg transition-all duration-500 hover:shadow-xl hover:border-teal-200 hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-3 transition-all duration-500 group-hover:bg-teal-100 group-hover:shadow-md">
                  {specialist.icon}
                </div>
                <h3 className="font-medium text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px] text-center">{specialist.name}</h3>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default SpecialistsSection;