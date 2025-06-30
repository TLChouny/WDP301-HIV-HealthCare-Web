import type React from "react"
import { useEffect, useState } from "react"
import { Eye, X, CreditCard, Calendar, Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useBooking } from "../../context/BookingContext"
import { useAuth } from "../../context/AuthContext"
import { useServiceContext } from "../../context/ServiceContext"
import { usePaymentContext } from "../../context/PaymentContext"
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?._id) {
          const userBookings = await getByUserId(user._id)
          setAppointments(userBookings)
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    if (user?._id) fetchAppointments()
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
        bookingIds: [selectedPaymentBooking._id!],
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
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận"
      case "confirmed":
        return "Đã xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
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
            <h1 className="text-3xl font-bold text-gray-800">Lịch hẹn của bạn</h1>
          </div>
          <p className="text-gray-600">Quản lý và theo dõi các lịch hẹn khám bệnh của bạn</p>
        </div>

        {/* Appointments Grid */}
        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có lịch hẹn nào</h3>
              <p className="text-gray-500 mb-6">Bạn chưa có lịch hẹn nào được đặt</p>
              <button
                onClick={() => navigate("/services")}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
              >
                Đặt lịch ngay
              </button>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Service Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={appointment.serviceId?.serviceImage || "/placeholder.svg?height=64&width=64"}
                        alt="service"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {appointment.serviceId?.serviceName || "Không xác định"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.bookingDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{appointment.doctorName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          appointment.status,
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">Xem</span>
                        </button>

                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleCancelAppointment(appointment._id!)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                              <span className="font-medium">Hủy</span>
                            </button>
                            <button
                              onClick={() => handleOpenPayment(appointment)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
                            >
                              <CreditCard className="h-4 w-4" />
                              <span className="font-medium">Thanh toán</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Dialog */}
        {openViewDialog && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Chi tiết lịch hẹn</h2>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {selectedAppointment.serviceId?.serviceName || "Không xác định"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Ngày:</span>
                      <span className="font-semibold">
                        {new Date(selectedAppointment.bookingDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Giờ:</span>
                      <span className="font-semibold">{selectedAppointment.startTime}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bác sĩ:</span>
                      <span className="font-semibold">{selectedAppointment.doctorName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Meeting Link:</span>
                      <span className="font-semibold">{selectedAppointment.meetLink || "Không có"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          selectedAppointment.status,
                        )}`}
                      >
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-2">
                      <span className="text-gray-600">Ghi chú:</span>
                      <span className="font-semibold text-right max-w-48">
                        {selectedAppointment.notes || "Không có"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setOpenViewDialog(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Đóng
                  </button>
                  {selectedAppointment.status === "pending" && (
                    <button
                      onClick={() => handleCancelAppointment(selectedAppointment._id!)}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
                    >
                      Hủy lịch
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Dialog */}
        {openPaymentDialog && selectedPaymentBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Thanh toán dịch vụ</h2>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 bg-gray-100">
                    <img
                      src={selectedPaymentBooking.serviceId?.serviceImage || "/placeholder.svg?height=80&width=80"}
                      alt="service"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedPaymentBooking.serviceId?.serviceName || "Không xác định"}
                  </h3>
                  <div className="text-2xl font-bold text-red-600">
                    {selectedPaymentBooking.serviceId?.price
                      ? Number(selectedPaymentBooking.serviceId.price).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "Không xác định"}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-semibold">
                      {new Date(selectedPaymentBooking.bookingDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giờ:</span>
                    <span className="font-semibold">{selectedPaymentBooking.startTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bác sĩ:</span>
                    <span className="font-semibold">{selectedPaymentBooking.doctorName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenPaymentDialog(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
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
