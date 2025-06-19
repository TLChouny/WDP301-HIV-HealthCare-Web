// ...existing imports...
import { useParams } from "react-router-dom";
import { useServiceContext } from "../../context/ServiceContext";
import { useEffect, useState } from "react";
import { Service } from "../../types/service";
import { Loader2, AlertCircle, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServiceByCategoryId: React.FC = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const { getServicesByCategoryId } = useServiceContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    getServicesByCategoryId(categoryId)
      .then((data) => {
        setServices(data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch services:", error);
      })
      .finally(() => setLoading(false));
  }, [categoryId, getServicesByCategoryId]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            {categoryName || "Dịch vụ theo danh mục"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các dịch vụ chất lượng cao trong danh mục này
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-lg mx-auto"
          >
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Không tìm thấy dịch vụ</h2>
            <p className="text-gray-600 text-lg">
              Hiện tại không có dịch vụ nào trong danh mục này. Vui lòng quay lại sau.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div 
                key={service._id}
                variants={item}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-100"
              >
                <div className="relative overflow-hidden">
                  {service.serviceImage ? (
                    <img 
                      src={service.serviceImage} 
                      alt={service.serviceName} 
                      className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-56 flex items-center justify-center">
                      <Package className="h-20 w-20 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-8 flex-grow">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {service.serviceName}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3 text-lg">
                    {service.serviceDescription}
                  </p>
                  
                  {service.price && (
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <p className="text-2xl font-bold text-blue-600">
                        {typeof service.price === 'number' 
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)
                          : service.price}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                  <button 
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
                    onClick={() => navigate(`/services/detail/${service._id}`)}
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServiceByCategoryId;
