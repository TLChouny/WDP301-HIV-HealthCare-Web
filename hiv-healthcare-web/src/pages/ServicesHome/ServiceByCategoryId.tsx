import type React from "react"
import { useParams } from "react-router-dom"
import { useServiceContext } from "../../context/ServiceContext"
import { useEffect, useState } from "react"
import type { Service } from "../../types/service"
import {
  Loader,
  AlertCircle,
  Stethoscope,
  ArrowRight,
  Clock,
  CreditCard,
  User,
  TestTube,
  Activity,
  Search,
  Filter,
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ServiceByCategoryId: React.FC = () => {
  const { id: categoryId } = useParams<{ id: string }>()
  const { getServicesByCategoryId } = useServiceContext()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    if (!categoryId) return
    setLoading(true)
    getServicesByCategoryId(categoryId)
      .then((data) => {
        setServices(data || [])
        setFilteredServices(data || [])
        if (data && data.length > 0) {
          setCategoryName(data[0].categoryId?.categoryName || "")
        } else {
          setCategoryName("")
        }
      })
      .catch((error) => {
        console.error("Failed to fetch services:", error)
      })
      .finally(() => setLoading(false))
  }, [categoryId, getServicesByCategoryId])

  useEffect(() => {
    let filtered = services
      .filter(
        (service) =>
          service.price && service.price > 0 && // Loại bỏ dịch vụ miễn phí
          (service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.serviceDescription?.toLowerCase().includes(searchTerm.toLowerCase())),
      )

    if (priceFilter === "paid") {
      filtered = filtered.filter((service) => service.price && service.price > 0)
    }

    setFilteredServices(filtered)
  }, [searchTerm, priceFilter, services])

  const getServiceIcon = (service: Service) => {
    if (service.isLabTest) return <TestTube className="h-6 w-6 text-blue-600" />
    if (service.isArvTest) return <Activity className="h-6 w-6 text-purple-600" />
    return <Stethoscope className="h-6 w-6 text-teal-600" />
  }

  const getServiceType = (service: Service) => {
    if (service.isLabTest) return { label: "Xét nghiệm", color: "bg-blue-100 text-blue-700" }
    if (service.isArvTest) return { label: "Điều trị ARV", color: "bg-purple-100 text-purple-700" }
    return { label: "Khám lâm sàng", color: "bg-teal-100 text-teal-700" }
  }

  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return "Miễn phí"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-teal-600" />
          <span className="text-lg text-gray-600">Đang tải dịch vụ...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{categoryName || "Dịch vụ theo danh mục"}</h1>
          </div>
          <p className="text-gray-600">Khám phá các dịch vụ chất lượng cao trong danh mục này</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng dịch vụ</p>
                <p className="text-3xl font-bold text-gray-800">
                  {services.filter((s) => s.price && s.price > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {services.some((s) => s.isArvTest) ? "Điều trị ARV" : "Xét nghiệm"}
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {services.filter((s) => (s.isArvTest ? s.isArvTest : s.isLabTest) && s.price && s.price > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Tất cả giá</option>
                <option value="paid">Có phí</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow border p-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {searchTerm || priceFilter !== "all" ? "Không tìm thấy dịch vụ" : "Chưa có dịch vụ"}
            </h2>
            <p className="text-gray-600">
              {searchTerm || priceFilter !== "all"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                : "Hiện tại không có dịch vụ nào trong danh mục này"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service) => {
              const serviceType = getServiceType(service)
              return (
                <motion.div
                  key={service._id}
                  variants={item}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    {service.serviceImage ? (
                      <img
                        src={service.serviceImage || "/placeholder.svg"}
                        alt={service.serviceName}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-teal-50 w-full h-48 flex items-center justify-center">
                        {getServiceIcon(service)}
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${serviceType.color}`}>
                        {serviceType.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-teal-600 transition-colors">
                      {service.serviceName}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">{service.serviceDescription || "Chưa có mô tả"}</p>

                    <div className="space-y-2 mb-4">
                      {service.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-teal-600" />
                          <span>{service.duration} phút</span>
                        </div>
                      )}
                      {service.doctorName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-teal-600" />
                          <span>{service.doctorName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold text-teal-600">{formatPrice(service.price)}</div>
                    </div>

                    <button
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/services/detail/${service._id}`)}
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ServiceByCategoryId