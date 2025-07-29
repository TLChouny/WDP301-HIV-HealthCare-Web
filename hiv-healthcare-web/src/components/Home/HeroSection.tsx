import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import doingubacsi from "../../assets/doingubacsi.png";
import AnimatedElement from "../Home/AnimatedElement";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    navigate("/appointment?serviceId=6884c1b3dc415d604a31d5f5");
  };

  return (
    <section className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
        <AnimatedElement animationType="fade-right" duration={1000} className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tìm Bác Sĩ <br /> Chuyên Khoa HIV</h1>
          <AnimatedElement animationType="fade-up" delay={300} duration={800}>
            <p className="text-teal-100 mb-8 text-lg">Đội ngũ y bác sĩ chuyên khoa giàu kinh nghiệm, tận tâm và không kỳ thị</p>
          </AnimatedElement>
          <AnimatedElement animationType="zoom-in" delay={600} duration={800}>
            <div className="p-6 rounded-lg max-w-md flex flex-col items-center justify-center">
              <button className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 flex items-center justify-center gap-2" onClick={handleBookConsultation}>
                <Calendar className="h-5 w-5 mr-2" /> Đặt lịch tư vấn trực tuyến
              </button>
            </div>
          </AnimatedElement>
        </AnimatedElement>
        <AnimatedElement animationType="fade-left" delay={300} duration={1000} className="lg:w-1/2 lg:pl-10">
          <div className="relative group">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-cyan-800 rounded-lg clip-path-background transform scale-105 shadow-lg">
                <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_left,#00ff00_0%,transparent_50%)] opacity-20"></div>
                <div className="absolute w-full h-full bg-[length:20px_20px] bg-[radial-gradient(circle,rgba(0,255,0,0.1)_10%,transparent_10%)] opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="relative z-10">
              <img src={doingubacsi} alt="Đội ngũ y bác sĩ" className="rounded-lg transition-transform duration-500 group-hover:scale-105 clip-path-foreground ring-2 ring-cyan-200 shadow-xl" />
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default HeroSection;