import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceContext } from "../../context/ServiceContext";
import { Service } from "../../types/service";
import { Loader2, ArrowLeft } from "lucide-react";
import { getServiceById } from "../../api/serviceApi";
import { Calendar } from "lucide-react"; // Thêm icon nếu muốn

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { services } = useServiceContext();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const found = services.find((s) => s._id === id);
    if (found) {
      setService(found);
      setLoading(false);
    } else {
      getServiceById(id)
        .then((data) => setService(data))
        .finally(() => setLoading(false));
    }
  }, [id, services]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center text-gray-500 py-20">
        Không tìm thấy dịch vụ.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button
        className="mb-6 flex items-center text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Quay lại
      </button>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {service.serviceImage && (
          <img
            src={service.serviceImage}
            alt={service.serviceName}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{service.serviceName}</h1>
        {service.price && (
          <div className="text-xl font-semibold text-blue-600 mb-4">
            {typeof service.price === "number"
              ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)
              : service.price}
          </div>
        )}
        <div className="text-gray-700 text-lg mb-6">{service.serviceDescription}</div>
        {/* Nút đặt lịch khám */}
        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-lg transition-all duration-300"
          onClick={() => navigate(`/appointment?serviceId=${service._id}`)}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Đặt lịch khám với dịch vụ này
        </button>
      </div>
    </div>
  );
};

export default ServiceDetail;
