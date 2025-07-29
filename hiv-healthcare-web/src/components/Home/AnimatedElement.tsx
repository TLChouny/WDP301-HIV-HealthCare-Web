// src/components/AnimatedElement.tsx
import React, { useEffect, useRef, useState } from "react";

// Hàm useInView được khai báo trước
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

export default AnimatedElement;