import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Calendar, FileText, Shield, Users, Heart, Info, } from "lucide-react";
import doingubacsi from "../../assets/doingubacsi.png";
import doingubacsi2 from "../../assets/doingubacsi2.png";
import doingubacsi3 from "../../assets/doingubacsi3.png";

// Import thêm types và context
import type { User } from '../../types/user'; 
import { useAuth } from '../../context/AuthContext'; 


const useInView = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold]);

  return isVisible;
};

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animationType?:
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "flip"
  | "bounce";
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 800,
  animationType = "fade-up",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);

  const getAnimationStyles = () => {
    const baseStyles = {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration}ms, transform ${duration}ms`,
      transitionDelay: `${delay}ms`,
    };

    switch (animationType) {
      case "fade-up":
        return {
          ...baseStyles,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
        };
      case "fade-down":
        return {
          ...baseStyles,
          transform: isVisible ? "translateY(0)" : "translateY(-40px)",
        };
      case "fade-left":
        return {
          ...baseStyles,
          transform: isVisible ? "translateX(0)" : "translateX(-40px)",
        };
      case "fade-right":
        return {
          ...baseStyles,
          transform: isVisible ? "translateX(0)" : "translateX(40px)",
        };
      case "zoom-in":
        return {
          ...baseStyles,
          transform: isVisible ? "scale(1)" : "scale(0.9)",
        };
      case "zoom-out":
        return {
          ...baseStyles,
          transform: isVisible ? "scale(1)" : "scale(1.1)",
        };
      case "flip":
        return {
          ...baseStyles,
          transform: isVisible ? "rotateY(0)" : "rotateY(90deg)",
        };
      case "bounce":
        if (isVisible) {
          return {
            opacity: 1,
            animation: `bounce ${duration}ms ${delay}ms`,
          };
        }
        return {
          opacity: 0,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div ref={ref} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = "",
  staggerDelay = 100,
  initialDelay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef);

  const staggeredChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        style: {
          ...child.props.style,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "none" : "translateY(20px)",
          transition: "opacity 500ms, transform 500ms",
          transitionDelay: `${initialDelay + index * staggerDelay}ms`,
        },
      });
    }
    return child;
  });

  return (
    <div ref={containerRef} className={className}>
      {staggeredChildren}
    </div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.2,
  className = "",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      const newOffset = top * speed;
      setOffset(newOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getAllUsers } = useAuth(); // Lấy hàm getAllUsers từ AuthContext
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [doctors, setDoctors] = useState<User[]>([]); // State để lưu danh sách bác sĩ

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy danh sách bác sĩ khi component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const users = await getAllUsers();
        // Lọc ra các user có role là 'doctor' và chỉ lấy 3 người đầu tiên
        setDoctors((users as User[]).filter(u => u.role === 'doctor').slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, [getAllUsers]);

  // Handle navigation and open modal for consultation
  const handleBookConsultation = () => {
    // Chuyển hướng thẳng đến trang appointment với serviceId
    navigate("/appointment?serviceId=6884c1b3dc415d604a31d5f5");
  };

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
          <AnimatedElement
            animationType="fade-right"
            duration={1000}
            className="lg:w-1/2 mb-10 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tìm Bác Sĩ <br />
              Chuyên Khoa HIV
            </h1>

            <AnimatedElement animationType="fade-up" delay={300} duration={800}>
              <p className="text-teal-100 mb-8 text-lg">
                Đội ngũ y bác sĩ chuyên khoa giàu kinh nghiệm, tận tâm và không
                kỳ thị
              </p>
            </AnimatedElement>
            <AnimatedElement animationType="zoom-in" delay={600} duration={800}>
              <div className="p-6 rounded-lg max-w-md flex flex-col items-center justify-center transform transition-all duration-500">
                <button
                  className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 flex items-center justify-center gap-2"
                  onClick={handleBookConsultation}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Đặt lịch tư vấn trực tuyến
                </button>
              </div>
            </AnimatedElement>
          </AnimatedElement>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <AnimatedElement
            animationType="fade-left"
            delay={300}
            duration={1000}
            className="lg:w-1/2 lg:pl-10"
          >
            <div className="relative group">
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-cyan-800 rounded-lg clip-path-background transform scale-105 shadow-lg">
                  <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_left,#00ff00_0%,transparent_50%)] opacity-20"></div>
                  <div className="absolute w-full h-full bg-[length:20px_20px] bg-[radial-gradient(circle,rgba(0,255,0,0.1)_10%,transparent_10%)] opacity-30 animate-pulse"></div>
                </div>
              </div>
              <div className="relative z-10">
                <img
                  src={doingubacsi}
                  alt="Đội ngũ y bác sĩ"
                  className="rounded-lg transition-transform duration-500 group-hover:scale-105 clip-path-foreground ring-2 ring-cyan-200 shadow-xl"
                />
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Services Icons Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedElement
            animationType="fade-up"
            duration={800}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 relative inline-block mx-auto">
              <span className="relative z-10">Dịch Vụ Nổi Bật</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
            </h2>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <FileText className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Tư Vấn Xét Nghiệm",
                description:
                  "Tư vấn trước và sau xét nghiệm HIV miễn phí, bảo mật và không kỳ thị",
              },
              {
                icon: (
                  <Shield className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Điều Trị ARV",
                description:
                  "Điều trị ARV hiện đại, theo dõi sát sao và hỗ trợ tuân thủ điều trị",
              },
              {
                icon: (
                  <Heart className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Chăm Sóc Toàn Diện",
                description:
                  "Chăm sóc sức khỏe toàn diện cho người sống chung với HIV",
              },
              {
                icon: (
                  <Users className="h-10 w-10 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Hỗ Trợ Tâm Lý",
                description:
                  "Tư vấn tâm lý và hỗ trợ xã hội cho người nhiễm và gia đình",
              },
            ].map((service, index) => (
              <AnimatedElement
                key={index}
                animationType="zoom-in"
                delay={300 + index * 150}
                duration={800}
              >
                <div className="group text-center p-6 border border-gray-100 rounded-lg transition-all duration-500 hover:shadow-xl hover:border-teal-100 hover:-translate-y-2 bg-white relative overflow-hidden flex flex-col items-center h-full min-h-[260px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col flex-1 items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 mb-4 transition-all duration-500 group-hover:bg-teal-100 group-hover:scale-110 group-hover:shadow-md">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px]">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-700 flex-1 flex items-center text-center">
                      {service.description}
                    </p>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Home Care Section */}
      <ParallaxSection speed={0.15} className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <AnimatedElement
              animationType="fade-right"
              duration={1000}
              className="lg:w-1/2 mb-10 lg:mb-0"
            >
              <div className="group">
                <div className="relative">
                  <div className="absolute top-4 left-4 w-full h-full bg-teal-500/20 rounded-lg -z-10"></div>
                  <img
                    src={doingubacsi2 || "/placeholder.svg"}
                    alt="Chăm sóc tại nhà"
                    className="rounded-lg shadow-xl transition-all duration-800 group-hover:shadow-2xl relative z-10"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-70 z-0 transition-transform duration-500 group-hover:scale-125"></div>
                </div>
              </div>
            </AnimatedElement>

            <div className="lg:w-1/2 lg:pl-16">
              <AnimatedElement animationType="fade-left" duration={800}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Bạn Đang Gặp Vấn Đề Nào?{" "}
                </h2>
              </AnimatedElement>

              <AnimatedElement
                animationType="fade-up"
                delay={300}
                duration={800}
              >
                <p className="text-gray-600 mb-8 text-lg"> Đừng để những lo lắng về HIV ảnh hưởng đến sức khỏe và chất
                  lượng cuộc sống của bạn. Việc phát hiện và điều trị sớm là yếu
                  tố quan trọng giúp kiểm soát bệnh hiệu quả, bảo vệ chính bạn
                  và những người xung quanh. Tại HIV Care, đội ngũ bác sĩ chuyên
                  khoa với nhiều năm kinh nghiệm sẽ hỗ trợ bạn từ tư vấn, xét
                  nghiệm đến điều trị theo phác đồ chuẩn. Tất cả đều được thực
                  hiện trong môi trường an toàn, bảo mật tuyệt đối và không kỳ
                  thị.
                </p>
              </AnimatedElement>

              <AnimatedElement
                animationType="fade-up"
                delay={500}
                duration={800}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <button className="bg-teal-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800 flex items-center group">
                    <Phone className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    <span>Gọi Ngay</span>
                  </button>
                  <button className="bg-white border border-teal-600 text-teal-600 py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-teal-50 hover:shadow-md active:scale-95 active:bg-teal-100 flex items-center group">
                    <Calendar className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    <span>Đặt Lịch</span>
                  </button>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </ParallaxSection>

      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full opacity-70 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full opacity-70 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0">
              <AnimatedElement animationType="fade-right" duration={800}>
                <h2 className="text-3xl font-bold text-teal-700 mb-6 relative">
                  <span className="relative z-10">
                    Đội Ngũ Y Bác Sĩ Giàu Kinh Nghiệm
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
                </h2>
              </AnimatedElement>

              <AnimatedElement
                animationType="fade-up"
                delay={200}
                duration={800}
              >
                <p className="text-gray-600 mb-8">
                  Đội ngũ y bác sĩ của chúng tôi có nhiều năm kinh nghiệm trong
                  lĩnh vực điều trị và chăm sóc HIV/AIDS. Họ không chỉ giỏi
                  chuyên môn mà còn tận tâm, nhiệt tình và luôn đặt bệnh nhân
                  lên hàng đầu.
                </p>
              </AnimatedElement>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: (
                      <Shield className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                    ),
                    title: "Chuyên Môn Cao",
                    description: "Được đào tạo bài bản",
                  },
                  {
                    icon: (
                      <Heart className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                    ),
                    title: "Tận Tâm",
                    description: "Đặt bệnh nhân lên hàng đầu",
                  },
                  {
                    icon: (
                      <Users className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                    ),
                    title: "Không Kỳ Thị",
                    description: "Môi trường thân thiện",
                  },
                  {
                    icon: (
                      <Info className="h-6 w-6 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                    ),
                    title: "Cập Nhật",
                    description: "Phương pháp điều trị mới nhất",
                  },
                ].map((feature, index) => (
                  <AnimatedElement
                    key={index}
                    animationType="fade-up"
                    delay={400 + index * 150}
                    duration={800}
                  >
                    <div className="group flex items-center transition-all duration-500 hover:bg-teal-50 p-3 rounded-lg hover:shadow-md">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4 transition-all duration-300 group-hover:bg-teal-200 group-hover:scale-110">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px]">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-700">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedElement>
                ))}
              </div>
            </div>

            <AnimatedElement
              animationType="fade-left"
              delay={300}
              duration={1000}
              className="lg:w-1/2"
            >
              <div className="relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full opacity-50 -z-10 transform translate-x-10 -translate-y-10 transition-all duration-500"></div>
                <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                  <img
                    src={doingubacsi3 || "/placeholder.svg"}
                    alt="Bác sĩ chuyên khoa"
                    className="rounded-lg transition-all duration-500"
                  />
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-br from-teal-800 to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedElement
            animationType="fade-up"
            duration={800}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center relative inline-block mx-auto">
              <span className="relative z-10">Dịch Vụ Dành Cho Bạn</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-600/50 -z-10 transform -rotate-1"></span>
            </h2>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <FileText className="h-10 w-10 text-teal-200 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Tư Vấn & Xét Nghiệm",
                description:
                  "Tư vấn trước và sau xét nghiệm HIV, xét nghiệm nhanh và bảo mật kết quả.",
                link: "/services/testing",
              },
              {
                icon: (
                  <Shield className="h-10 w-10 text-teal-200 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Điều Trị ARV",
                description:
                  "Điều trị ARV hiện đại, theo dõi tải lượng virus và tư vấn tuân thủ điều trị.",
                link: "/services/treatment",
              },
              {
                icon: (
                  <Users className="h-10 w-10 text-teal-200 transition-transform duration-300 group-hover:scale-110" />
                ),
                title: "Hỗ Trợ Tâm Lý",
                description:
                  "Tư vấn tâm lý cá nhân và nhóm, hỗ trợ vượt qua khó khăn và kỳ thị.",
                link: "/services/support",
              },
            ].map((service, index) => (
              <AnimatedElement
                key={index}
                animationType="zoom-in"
                delay={300 + index * 150}
                duration={800}
              >
                <div className="group bg-teal-700/80 backdrop-blur-sm rounded-lg p-6 transition-all duration-500 hover:bg-teal-600 hover:-translate-y-2 hover:shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="mb-4 transition-transform duration-500 group-hover:scale-110">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 transition-transform duration-300 group-hover:translate-y-[-2px]">
                      {service.title}
                    </h3>
                    <p className="text-teal-100 mb-4 transition-all duration-300 group-hover:text-white">
                      {service.description}
                    </p>
                    <Link
                      to={service.link}
                      className="inline-flex items-center text-teal-200 hover:text-white transition-all duration-300 group-hover:translate-x-2 relative"
                    >
                      <span>Tìm hiểu thêm</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-all duration-300 group-hover:ml-3" />
                    </Link>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedElement
            animationType="fade-up"
            duration={800}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 relative inline-block mx-auto">
              <span className="relative z-10">Tìm Kiếm Theo Chuyên Khoa</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
            </h2>
          </AnimatedElement>

          <StaggerContainer
            staggerDelay={100}
            initialDelay={300}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
          >
            {[
              {
                icon: (
                  <FileText className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                name: "Tư Vấn Xét Nghiệm",
              },
              {
                icon: (
                  <Shield className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                name: "Điều Trị ARV",
              },
              {
                icon: (
                  <Heart className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                name: "Dinh Dưỡng",
              },
              {
                icon: (
                  <Users className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                name: "Tâm Lý",
              },
              {
                icon: (
                  <Info className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                ),
                name: "Bệnh Đồng Nhiễm",
              },
            ].map((specialist, index) => (
              <div
                key={index}
                className="group flex flex-col items-center p-4 border border-gray-100 rounded-lg transition-all duration-500 hover:shadow-xl hover:border-teal-200 hover:-translate-y-2 bg-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-3 transition-all duration-500 group-hover:bg-teal-100 group-hover:shadow-md">
                    {specialist.icon}
                  </div>
                  <h3 className="font-medium text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px] text-center">
                    {specialist.name}
                  </h3>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Doctors Section - Đã được chỉnh sửa */}
      <ParallaxSection speed={0.1} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4"> {/* Flex container for title and "Xem thêm" */}
            <AnimatedElement
              animationType="fade-up"
              duration={800}
            >
              <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
                <span className="relative z-10">Đội Ngũ Chuyên Gia</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1"></span>
              </h2>
            </AnimatedElement>
            <AnimatedElement
              animationType="fade-up"
              delay={200}
              duration={800}
            >
              <Link to="/doctors" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-300">
                Xem thêm <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </AnimatedElement>
          </div>

          

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Thay đổi lg:grid-cols-4 thành lg:grid-cols-3 */}
            {doctors.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Đang tải danh sách bác sĩ hoặc chưa có bác sĩ nào được duyệt.
              </div>
            ) : (
              doctors.map((doctor: User, index: number) => (
                <AnimatedElement
                  key={doctor._id || index}
                  animationType="fade-up"
                  delay={300 + index * 150}
                  duration={800}
                >
                  <div className="group bg-white rounded-lg overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2 relative">
                    <div className="overflow-hidden">
                      <img
                        src={doctor.avatar || "https://via.placeholder.com/300x300?text=Bác+sĩ"} // Sử dụng avatar của bác sĩ, nếu không có thì dùng placeholder
                        alt={doctor.userName}
                        className="w-full h-64 object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="p-6 relative">
                      <h3 className="text-xl font-semibold mb-1 text-gray-800 transition-transform duration-300 group-hover:translate-y-[-2px]">
                        {doctor.userName}
                      </h3>
                      {/* Có thể thêm vai trò hoặc chuyên khoa nếu có trong dữ liệu User */}
                      <p className="text-teal-600 mb-4">{doctor.email || "Bác sĩ chuyên khoa"}</p>
                      
                    </div>
                  </div>
                </AnimatedElement>
              ))
            )}
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
};

export default Home;