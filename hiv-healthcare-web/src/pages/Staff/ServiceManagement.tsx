import type React from "react"
import { useState } from "react"
import { useServiceContext } from "../../context/ServiceContext"
import type { Service } from "../../types/service"
import { Search, Stethoscope, Tag, TestTube, Activity, Package, AlertCircle, Loader } from "lucide-react"

const StaffServicePackageManagement: React.FC = () => {
  const { services } = useServiceContext()
  const [search, setSearch] = useState("")

  // Helper function to get service icon based on type
  const getServiceIcon = (service: Service) => {
    if (service.isLabTest) return <TestTube className="h-5 w-5 text-blue-600" />
    if (service.isArvTest) return <Activity className="h-5 w-5 text-purple-600" />
    return <Stethoscope className="h-5 w-5 text-teal-600" />
  }

  // Helper function to get service type label and color
  const getServiceType = (service: Service) => {
    if (service.isLabTest) return { label: "Xét nghiệm", color: "bg-blue-100 text-blue-700" }
    if (service.isArvTest) return { label: "Điều trị ARV", color: "bg-purple-100 text-purple-700" }
    return { label: "Khám lâm sàng", color: "bg-teal-100 text-teal-700" }
  }

  // Helper function to format price
  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return "Miễn phí"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Filter services by name
  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Gói Dịch Vụ</h1>
          </div>
          <p className="text-gray-600">Xem và quản lý tất cả các gói dịch vụ hiện có trong hệ thống</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm tên dịch vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {/* Add more filters here if needed, e.g., by category, price range */}
          </div>
        </div>

        {/* Service Packages List */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Loại dịch vụ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-10 w-10 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Không tìm thấy gói dịch vụ nào</h3>
                      <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm.</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const serviceType = getServiceType(service)
                    return (
                      <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              {service.serviceImage ? (
                                <img
                                  src={service.serviceImage || "/placeholder.svg"}
                                  alt={service.serviceName}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                getServiceIcon(service)
                              )}
                            </div>
                            <div>
                              <div className="text-base font-medium text-gray-900">{service.serviceName}</div>
                              <div className="text-sm text-gray-500">
                                {service.duration ? `${service.duration} phút` : "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {service.serviceDescription || "Không có mô tả"}
                        </td>
                        <td className="px-6 py-4 text-base font-semibold text-teal-600">
                          {formatPrice(service.price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-teal-600" />
                            <span>
                              {typeof service.categoryId === "object" && service.categoryId?.categoryName
                                ? service.categoryId.categoryName
                                : "Không xác định"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${serviceType.color}`}
                          >
                            {serviceType.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffServicePackageManagement
