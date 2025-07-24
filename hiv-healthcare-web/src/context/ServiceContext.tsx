import React, { createContext, useContext, useEffect, useState } from "react";
import type { Service } from "../types/service";
import {
  getAllServices,
  getServicesByCategoryId as fetchByCategory,
  getServiceById as fetchById
} from "../api/serviceApi";

interface ServiceContextType {
  services: Service[];
  loadingServices: boolean;
  errorServices: string | null;
  refreshServices: () => void;
  getServicesByCategoryId: (categoryId: string) => Promise<Service[]>;
  getServiceById: (id: string) => Promise<Service | null>;
}

const ServiceContext = createContext<ServiceContextType>({
  services: [],
  loadingServices: false,
  errorServices: null,
  refreshServices: () => {},
  getServicesByCategoryId: async () => [],
  getServiceById: async () => null,
});

export const useServiceContext = () => useContext(ServiceContext);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoadingServices(true);
    setErrorServices(null);
    try {
      const data = await getAllServices();
      // 🛑 Check response shape here if needed:
      // const servicesArray = data.services || data;
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
      setErrorServices("Không tải được danh sách dịch vụ");
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        loadingServices,
        errorServices,
        refreshServices: fetchServices,
        getServicesByCategoryId: fetchByCategory,
        getServiceById: fetchById,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
