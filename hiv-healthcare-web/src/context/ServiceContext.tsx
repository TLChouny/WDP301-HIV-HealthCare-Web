import React, { createContext, useContext, useEffect, useState } from "react";
import type { Service } from "../types/service";
import { getAllServices } from "../api/serviceApi";

interface ServiceContextType {
  services: Service[];
  refreshServices: () => void;
}

const ServiceContext = createContext<ServiceContextType>({
  services: [],
  refreshServices: () => {},
});

export const useServiceContext = () => useContext(ServiceContext);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider value={{ services, refreshServices: fetchServices }}>
      {children}
    </ServiceContext.Provider>
  );
};
