// ...existing imports...
import { useParams } from "react-router-dom";
import { useServiceContext } from "../../context/ServiceContext";
import { useEffect, useState } from "react";
import { Service } from "../../types/service";
import { Loader2, AlertCircle, Package } from "lucide-react"; // Import icons

const ServiceByCategoryId: React.FC = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const { getServicesByCategoryId } = useServiceContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>(""); // Optional: Add category name if available

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    getServicesByCategoryId(categoryId)
      .then((data) => {
        setServices(data || []);
        // Optional: If your API returns category name, set it here
        // setCategoryName(data.categoryName || "");
      })
      .catch((error) => {
        console.error("Failed to fetch services:", error);
      })
      .finally(() => setLoading(false));
  }, [categoryId, getServicesByCategoryId]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {categoryName || "Dịch vụ theo danh mục"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá các dịch vụ chất lượng cao trong danh mục này
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Đang tải dịch vụ...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-gray-50 rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-gray-600">
            Hiện tại không có dịch vụ nào trong danh mục này. Vui lòng quay lại sau.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
            >
              {service.serviceImage ? (
                <img 
                  src={service.serviceImage} 
                  alt={service.serviceName} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">{service.serviceName}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.serviceDescription}</p>
                
                {service.price && (
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-lg font-medium text-blue-600">
                      {typeof service.price === 'number' 
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)
                        : service.price}
                    </p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
                  onClick={() => {
                    // Add navigation or modal open logic here
                    console.log(`View service details: ${service._id}`);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceByCategoryId;
