import type React from "react"
import { useEffect, useState } from "react"
import {
  Eye,
  X,
  Calendar,
  Clock,
  User,
  Info,
  CreditCard,
  Filter,
  Search,
  Stethoscope,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useBooking } from "../../context/BookingContext"
import { useAuth } from "../../context/AuthContext"
import { useServiceContext } from "../../context/ServiceContext"
import { usePaymentContext } from "../../context/PaymentContext"
import { translateBookingStatus } from "../../utils/status"
import type { Booking } from "../../types/booking"

const UserAppointments: React.FC = () => {
  const navigate = useNavigate()
  const { getByUserId, remove } = useBooking()
  const { user } = useAuth()
  const { services } = useServiceContext()
  const { createPayment } = usePaymentContext()
  const [appointments, setAppointments] = useState<Booking[]>([])
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState<Booking | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        if (user?._id) {
          const userBookings = await getByUserId(user._id)
          // Sắp xếp giảm dần theo updatedAt (mới nhất lên trên)
          const sortedBookings = userBookings.sort(
            (a, b) => new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime(),
          )
          setAppointments(sortedBookings || [])
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [getByUserId, user])

  const handleViewAppointment = (appointment: Booking) => {
    setSelectedAppointment(appointment)
    setOpenViewDialog(true)
  }

  const handleCancelAppointment = async (id: string) => {
    try {
      await remove(id)
      setAppointments((prev) => prev.filter((appt) => appt._id !== id))
      setOpenViewDialog(false)
    } catch (error) {
      console.error("Error cancelling appointment:", error)
    }
  }

  const handleOpenPayment = (booking: Booking) => {
    setSelectedPaymentBooking(booking)
    setOpenPaymentDialog(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPaymentBooking || !selectedPaymentBooking.serviceId) return
    try {
      const payment = await createPayment({
        paymentID: `PAY-${Date.now()}`,
        orderCode: Number(selectedPaymentBooking.bookingCode || Date.now()),
        orderName: selectedPaymentBooking.serviceId.serviceName,
        amount: Number(selectedPaymentBooking.serviceId.price),
        description: `Thanh toán cho lịch hẹn #${selectedPaymentBooking.bookingCode}`,
        status: "pending",
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
        bookingIds: [selectedPaymentBooking], // truyền cả object Booking
      })
      if (payment.checkoutUrl) {
        window.open(payment.checkoutUrl, "_blank")
      } else {
        alert("Không thể tạo liên kết thanh toán.")
      }
      setOpenPaymentDialog(false)
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error)
      alert("Tạo thanh toán thất bại.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "checked-in":
        return "bg-teal-100 text-teal-700 border-teal-200"
      case "paid":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "checked-in":
        return <MapPin className="h-4 w-4" />
      case "paid":
        return <CreditCard className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriceDisplay = (price: number | undefined) => {
    return price === 0 || price === undefined
      ? "Miễn phí"
      : price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus
    const matchesSearch =
      searchTerm === "" ||
      appointment.serviceId?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Stats calculation
  const stats = [
    {
      title: "Tổng lịch hẹn",
      value: appointments.length.toString(),
      icon: Calendar,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Chờ xác nhận",
      value: appointments.filter((a) => a.status === "pending").length.toString(),
      icon: Clock,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Đã hoàn thành",
      value: appointments.filter((a) => a.status === "completed").length.toString(),
      icon: CheckCircle,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-teal-600" />
          <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Lịch Hẹn Của Bạn</h1>
          </div>
          <p className="text-gray-600">Theo dõi và quản lý lịch khám bệnh, xét nghiệm và điều trị</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên dịch vụ hoặc bác sĩ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="paid">Đã thanh toán</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow border p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Info className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {searchTerm || selectedStatus !== "all" ? "Không tìm thấy lịch hẹn" : "Chưa có lịch hẹn nào"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedStatus !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Đặt lịch khám, xét nghiệm hoặc điều trị ngay hôm nay"}
              </p>
              {!searchTerm && selectedStatus === "all" && (
                <button
                  onClick={() => navigate("/services")}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
                >
                  Đặt lịch ngay
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map((appt) => {
              const isFreeService = appt.serviceId?.price === 0 || appt.serviceId?.price === undefined
              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Service Image and Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-r from-blue-50 to-teal-50 flex-shrink-0">
                          {appt.serviceId?.serviceImage ? (
                            <img
                              src={appt.serviceId.serviceImage || "/placeholder.svg"}
                              alt="service"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Stethoscope className="h-8 w-8 text-teal-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {appt.serviceId?.serviceName || "Không xác định"}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {appt.serviceId?.serviceDescription || "Không có mô tả"}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-teal-600" />
                              <span>{new Date(appt.bookingDate).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-teal-600" />
                              <span>{appt.startTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-teal-600" />
                              <span>{appt.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4 text-teal-600" />
                              <span className="font-medium">{getPriceDisplay(appt.serviceId?.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(appt.status || "")}`}
                        >
                          {getStatusIcon(appt.status || "")}
                          {translateBookingStatus(appt.status || "")}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewAppointment(appt)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Xem
                          </button>

                          {appt.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleCancelAppointment(appt._id!)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-1"
                              >
                                <X className="h-4 w-4" />
                                Hủy
                              </button>
                              {!isFreeService && (
                                <button
                                  onClick={() => handleOpenPayment(appt)}
                                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all flex items-center gap-1"
                                >
                                  <CreditCard className="h-4 w-4" />
                                  Thanh toán
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* View Dialog */}
        {openViewDialog && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Chi Tiết Lịch Hẹn</h3>
                </div>
                <button
                  onClick={() => setOpenViewDialog(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Service Info */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                    Thông Tin Dịch Vụ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedAppointment.serviceId?.serviceName || "Không xác định"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá dịch vụ</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border font-medium">
                        {getPriceDisplay(selectedAppointment.serviceId?.price)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedAppointment.serviceId?.serviceDescription || "Không có mô tả"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedAppointment.serviceId?.duration || "-"} phút
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại dịch vụ</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedAppointment.serviceId?.isLabTest
                          ? "Xét nghiệm"
                          : selectedAppointment.serviceId?.isArvTest
                            ? "Khám ARV"
                            : "Khám lâm sàng"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    Chi Tiết Lịch Hẹn
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {new Date(selectedAppointment.bookingDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khám</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">{selectedAppointment.startTime}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ phụ trách</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">{selectedAppointment.doctorName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedAppointment.status || "")}`}
                      >
                        {getStatusIcon(selectedAppointment.status || "")}
                        {translateBookingStatus(selectedAppointment.status || "")}
                      </span>
                    </div>
                    {selectedAppointment.meetLink && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link cuộc họp</label>
                        <a
                          href={selectedAppointment.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-800 bg-white p-3 rounded-xl border block break-all"
                        >
                          {selectedAppointment.meetLink}
                        </a>
                      </div>
                    )}
                    {selectedAppointment.notes && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <button
                  onClick={() => setOpenViewDialog(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                {selectedAppointment.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleCancelAppointment(selectedAppointment._id!)}
                      className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                    >
                      Hủy lịch
                    </button>
                    { selectedAppointment.serviceId.price > 0 && (
                      <button
                        onClick={() => {
                          setOpenViewDialog(false)
                          handleOpenPayment(selectedAppointment)
                        }}
                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all"
                      >
                        Thanh toán
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Dialog */}
        {openPaymentDialog && selectedPaymentBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Thanh Toán Dịch Vụ</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 bg-gradient-to-r from-blue-50 to-teal-50">
                    {selectedPaymentBooking.serviceId?.serviceImage ? (
                      <img
                        src={selectedPaymentBooking.serviceId.serviceImage || "/placeholder.svg"}
                        alt="service"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Stethoscope className="h-10 w-10 text-teal-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {selectedPaymentBooking.serviceId?.serviceName || "Không xác định"}
                  </h3>
                  <div className="text-2xl font-bold text-teal-600">
                    {selectedPaymentBooking.serviceId?.price
                      ? Number(selectedPaymentBooking.serviceId.price).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "Không xác định"}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày khám:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(selectedPaymentBooking.bookingDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giờ khám:</span>
                    <span className="font-semibold text-gray-800">{selectedPaymentBooking.startTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bác sĩ:</span>
                    <span className="font-semibold text-gray-800">{selectedPaymentBooking.doctorName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenPaymentDialog(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all"
                  >
                    Xác nhận thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAppointments
