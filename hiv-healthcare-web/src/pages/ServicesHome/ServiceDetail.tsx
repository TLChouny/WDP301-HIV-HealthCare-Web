import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useServiceContext } from "../../context/ServiceContext"
import type { Service } from "../../types/service"
import {
  Loader,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  TestTube,
  Activity,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { getServiceById } from "../../api/serviceApi"

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { services } = useServiceContext()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    const found = services.find((s) => s._id === id)
    if (found) {
      setService(found)
      setLoading(false)
    } else {
      getServiceById(id)
        .then((data) => setService(data))
        .finally(() => setLoading(false))
    }
  }, [id, services])

  const getServiceIcon = (service: Service) => {
    if (service.isLabTest) return <TestTube className="h-8 w-8 text-blue-600" />
    if (service.isArvTest) return <Activity className="h-8 w-8 text-purple-600" />
    return <Stethoscope className="h-8 w-8 text-teal-600" />
  }

  const getServiceType = (service: Service) => {
    if (service.isLabTest) return { label: "Xét nghiệm", color: "bg-blue-100 text-blue-700", icon: TestTube }
    if (service.isArvTest) return { label: "Điều trị ARV", color: "bg-purple-100 text-purple-700", icon: Activity }
    return { label: "Khám lâm sàng", color: "bg-teal-100 text-teal-700", icon: Stethoscope }
  }

  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return "Miễn phí"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-teal-600" />
          <span className="text-lg text-gray-600">Đang tải thông tin dịch vụ...</span>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow border p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-teal-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-gray-600 mb-6">Dịch vụ không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const serviceType = getServiceType(service)
  const categoryName = service.categoryId?.categoryName

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          className="mb-6 flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-medium">Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
              {/* Hero Image */}
              {service.serviceImage ? (
                <div className="h-80 w-full overflow-hidden">
                  <img
                    src={service.serviceImage || "/placeholder.svg"}
                    alt={service.serviceName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-80 w-full bg-gradient-to-r from-blue-50 to-teal-50 flex items-center justify-center">
                  {getServiceIcon(service)}
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${serviceType.color}`}>
                      {serviceType.label}
                    </span>
                    {categoryName && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {categoryName}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.serviceName}</h1>
                  <div className="text-3xl font-bold text-teal-600 mb-2">{formatPrice(service.price)}</div>
                </div>

                {/* Service Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {service.duration && (
                    <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                      <Clock className="h-6 w-6 text-teal-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Thời lượng khám</p>
                        <p className="font-semibold text-gray-800">{service.duration} phút</p>
                      </div>
                    </div>
                  )}

                  {service.timeSlot && (
                    <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                      <Calendar className="h-6 w-6 text-teal-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Khung giờ</p>
                        <p className="font-semibold text-gray-800">{service.timeSlot}</p>
                      </div>
                    </div>
                  )}

                  {service.doctorName && (
                    <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                      <User className="h-6 w-6 text-teal-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Bác sĩ phụ trách</p>
                        <p className="font-semibold text-gray-800">{service.doctorName}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <MapPin className="h-6 w-6 text-teal-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Địa điểm</p>
                      <p className="font-semibold text-gray-800">Phòng khám chuyên khoa</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Mô tả dịch vụ</h3>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {service.serviceDescription || "Chưa có mô tả chi tiết cho dịch vụ này."}
                    </p>
                  </div>
                </div>

                {/* Service Features */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Đặc điểm dịch vụ</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Đội ngũ bác sĩ chuyên nghiệp</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Trang thiết bị hiện đại</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Quy trình khám chuẩn quốc tế</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Hỗ trợ tư vấn 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow border p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Đặt lịch khám</h3>
                <p className="text-gray-600 text-sm">Đặt lịch nhanh chóng và thuận tiện</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá dịch vụ:</span>
                  <span className="font-bold text-teal-600 text-lg">{formatPrice(service.price)}</span>
                </div>
                {service.duration && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Thời lượng:</span>
                    <span className="font-medium text-gray-800">{service.duration} phút</span>
                  </div>
                )}
              </div>

              <button
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => navigate(`/appointment?serviceId=${service._id}`)}
              >
                <Calendar className="h-5 w-5" />
                Đặt lịch ngay
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span className="text-gray-700">123 Đường ABC, Quận XYZ, TP.HCM</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-teal-600" />
                  <span className="text-gray-700">Hotline: 1900 1234</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span className="text-gray-700">Giờ làm việc: 7:00 - 17:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail
