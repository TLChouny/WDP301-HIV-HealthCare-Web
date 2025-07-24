import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceContext } from "../../context/ServiceContext";
import { Service } from "../../types/service";
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, User, Tag } from "lucide-react";
import { getServiceById } from "../../api/serviceApi";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-gray-600 mb-6">Dịch vụ không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const categoryName = service.categoryId?.categoryName;
  const formattedPrice = typeof service.price === "number"
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)
    : service.price;

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          {service.serviceImage && (
            <div className="h-80 w-full overflow-hidden">
              <img
                src={service.serviceImage}
                alt={service.serviceName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.serviceName}</h1>

              {formattedPrice && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-blue-600">{formattedPrice}</span>
                  <span className="text-sm text-gray-500">/ lần khám</span>
                </div>
              )}

              {categoryName && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span>Danh mục: {categoryName}</span>
                </div>
              )}
            </div>

            {/* Service Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {service.duration && (
                <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Thời lượng</p>
                    <p className="font-medium text-gray-900">{service.duration} phút</p>
                  </div>
                </div>
              )}

              {service.timeSlot && (
                <div className="flex items-center p-4 bg-green-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-medium text-gray-900">{service.timeSlot}</p>
                  </div>
                </div>
              )}

              {service.doctorName && (
                <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                  <User className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Bác sĩ phụ trách</p>
                    <p className="font-medium text-gray-900">{service.doctorName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-4 bg-yellow-50 rounded-xl">
                <MapPin className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Địa điểm</p>
                  <p className="font-medium text-gray-900">Phòng khám</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả dịch vụ</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {service.serviceDescription || "Chưa có mô tả cho dịch vụ này."}
              </p>
            </div>

            {/* CTA Button */}
            <div className="border-t border-gray-100 pt-6">
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => navigate(`/appointment?serviceId=${service._id}`)}
              >
                <Calendar className="h-5 w-5" />
                Đặt lịch khám ngay
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Đặt lịch nhanh chóng và thuận tiện
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
