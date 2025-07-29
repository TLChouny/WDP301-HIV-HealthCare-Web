// src/components/StaggerContainer.tsx
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

  return <div ref={containerRef} className={className}>{staggeredChildren}</div>;
};

export default StaggerContainer;