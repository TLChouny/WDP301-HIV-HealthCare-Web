import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import HeroSection from "../../components/Home/HeroSection";
import ServicesIconsSection from "../../components/Home/ServicesIconsSection";
import HomeCareSection from "../../components/Home/HomeCareSection";
import ExperiencedStaffSection from "../../components/Home/ExperiencedStaffSection";
import ServicesSection from "../../components/Home/ServicesSection";
import SpecialistsSection from "../../components/Home/SpecialistsSection";
import DoctorsSection from "../../components/Home/DoctorsSection";
import BlogSection from "../../components/Home/BlogSection";

const Home: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out">
          <Info className="h-5 w-5" />
          <span>Trang dịch vụ hiện không khả dụng. Vui lòng thử lại sau.</span>
        </div>
      )}

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-700 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <HeroSection />
      <ServicesIconsSection />
      <HomeCareSection />
      <ExperiencedStaffSection />
      <ServicesSection />
      <SpecialistsSection />
      <DoctorsSection />
      <BlogSection />
    </div>
  );
};

export default Home;