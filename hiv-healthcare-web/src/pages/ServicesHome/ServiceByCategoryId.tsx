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

  // Animation variants
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {categoryName || "Dịch vụ theo danh mục"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các dịch vụ chất lượng cao trong danh mục này
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <span className="mt-4 text-lg text-gray-600">Đang tải dịch vụ...</span>
            </div>
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm p-12 text-center max-w-lg mx-auto"
          >
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Không tìm thấy dịch vụ</h2>
            <p className="text-gray-600">
              Hiện tại không có dịch vụ nào trong danh mục này. Vui lòng quay lại sau.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => (
              <motion.div
                key={service._id}
                variants={item}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                <div className="relative">
                  {service.serviceImage ? (
                    <img
                      src={service.serviceImage}
                      alt={service.serviceName}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {service.serviceName}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                    {service.serviceDescription}
                  </p>
                  {service.price && (
                    <div className="mb-4">
                      <p className="text-lg font-bold text-blue-600">
                        {typeof service.price === 'number'
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)
                          : service.price}
                      </p>
                    </div>
                  )}
                  <button
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 flex items-center justify-center gap-2 mt-auto"
                    onClick={() => navigate(`/services/detail/${service._id}`)}
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="h-4 w-4" />
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
