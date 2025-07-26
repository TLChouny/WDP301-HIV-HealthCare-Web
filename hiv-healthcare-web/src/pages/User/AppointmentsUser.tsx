import React, { useEffect, useState } from "react";
import { Eye, X, Calendar, Clock, User, Info, ClipboardCheck, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { useServiceContext } from "../../context/ServiceContext";
import { usePaymentContext } from "../../context/PaymentContext";
import { translateBookingStatus } from "../../utils/status";
import type { Booking } from "../../types/booking";

const UserAppointments: React.FC = () => {
  const navigate = useNavigate();
  const { getByUserId, remove } = useBooking();
  const { user } = useAuth();
  const { services } = useServiceContext();
  const { createPayment } = usePaymentContext();
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState<Booking | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?._id) {
          const userBookings = await getByUserId(user._id);
          // Sắp xếp giảm dần theo updatedAt (mới nhất lên trên)
          const sortedBookings = userBookings.sort((a, b) =>
            new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime()
          );
          setAppointments(sortedBookings || []);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [getByUserId, user]);

  const handleViewAppointment = (appointment: Booking) => {
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await remove(id);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      setOpenViewDialog(false);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleOpenPayment = (booking: Booking) => {
    setSelectedPaymentBooking(booking);
    setOpenPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentBooking || !selectedPaymentBooking.serviceId) return;

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
      });

      if (payment.checkoutUrl) {
        window.open(payment.checkoutUrl, "_blank");
      } else {
        alert("Không thể tạo liên kết thanh toán.");
      }

      setOpenPaymentDialog(false);
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      alert("Tạo thanh toán thất bại.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "checked-in":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paid":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriceDisplay = (price: number | undefined) => {
    return price === 0 || price === undefined ? "Miễn phí" : price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const filteredAppointments = selectedStatus === "all"
    ? appointments
    : appointments.filter((appointment) => appointment.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">🗓 Lịch hẹn của bạn</h1>
          <p className="text-gray-600">Theo dõi lịch khám bệnh, xét nghiệm và điều trị ARV dễ dàng</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {/* Appointments Grid */}
        <div className="grid gap-6">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <Info className="mx-auto mb-4 text-gray-400" size={60} />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Chưa có lịch hẹn nào</h3>
              <p className="text-gray-600 mb-6">Đặt lịch khám, xét nghiệm hoặc điều trị ngay hôm nay.</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
              >
                Đặt lịch ngay
              </button>
            </div>
          ) : (
            filteredAppointments.map((appt) => {
              const isFreeService = appt.serviceId?.price === 0 || appt.serviceId?.price === undefined;

              return (
                <div key={appt._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 transition duration-300 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={appt.serviceId?.serviceImage || "/placeholder.svg"}
                          alt="service"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{appt.serviceId?.serviceName || "Không xác định"}</h3>
                        <p className="text-gray-600">{appt.serviceId?.serviceDescription || "Không có mô tả"}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-gray-600 text-base">
                          <span><Calendar className="inline h-5 w-5 mr-1" />{new Date(appt.bookingDate).toLocaleDateString("vi-VN")}</span>
                          <span><Clock className="inline h-5 w-5 mr-1" />{appt.startTime}</span>
                          <span><User className="inline h-5 w-5 mr-1" />{appt.doctorName}</span>
                          <span><ClipboardCheck className="inline h-5 w-5 mr-1" />{getPriceDisplay(appt.serviceId?.price)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`inline-block px-4 py-2 rounded-full border ${getStatusColor(appt.status || "")}`}>
                        {translateBookingStatus(appt.status || "")}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAppointment(appt)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition"
                        >
                          <Eye className="inline h-5 w-5 mr-1" /> Xem
                        </button>
                        {appt.status === "pending" && !isFreeService && (
                          <>
                            <button
                              onClick={() => handleCancelAppointment(appt._id!)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition"
                            >
                              <X className="inline h-5 w-5 mr-1" /> Hủy
                            </button>
                            <button
                              onClick={() => handleOpenPayment(appt)}
                              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition"
                            >
                              <CreditCard className="inline h-5 w-5 mr-1" /> Thanh toán
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View Dialog */}
        {openViewDialog && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📋 Chi tiết lịch hẹn</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p><strong>Dịch vụ:</strong> {selectedAppointment.serviceId?.serviceName || "Không xác định"}</p>
                <p><strong>Mô tả:</strong> {selectedAppointment.serviceId?.serviceDescription || "Không có"}</p>
                <p><strong>Ngày:</strong> {new Date(selectedAppointment.bookingDate).toLocaleDateString("vi-VN")}</p>
                <p><strong>Giờ:</strong> {selectedAppointment.startTime}</p>
                <p><strong>Bác sĩ:</strong> {selectedAppointment.doctorName}</p>
                <p><strong>Giá:</strong> {getPriceDisplay(selectedAppointment.serviceId?.price)}</p>
                <p><strong>Thời lượng:</strong> {selectedAppointment.serviceId?.duration || "-"} phút</p>
                <p><strong>Loại:</strong> {selectedAppointment.serviceId?.isLabTest ? "Xét nghiệm" : selectedAppointment.serviceId?.isArvTest ? "Khám ARV" : "Khám lâm sàng"}</p>
                <p><strong>Meeting Link:</strong> {selectedAppointment.meetLink || "Không có"}</p>
                <p><strong>Ghi chú:</strong> {selectedAppointment.notes || "Không có"}</p>
                <p><strong>Trạng thái:</strong> {translateBookingStatus(selectedAppointment.status || "")}</p>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setOpenViewDialog(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold"
                >
                  Đóng
                </button>
                {selectedAppointment.status === "pending" && !selectedAppointment.serviceId?.price && (
                  <>
                    <button
                      onClick={() => handleCancelAppointment(selectedAppointment._id!)}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Hủy lịch
                    </button>
                  </>
                )}
                {selectedAppointment.status === "pending"  && selectedAppointment.serviceId.price > 0 && (
                  <>
                    <button
                      onClick={() => handleCancelAppointment(selectedAppointment._id!)}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Hủy lịch
                    </button>
                    <button
                      onClick={() => handleOpenPayment(selectedAppointment)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition"
                    >
                      Thanh toán
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Dialog */}
        {openPaymentDialog && selectedPaymentBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Thanh toán dịch vụ</h2>
              </div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 bg-gray-100">
                  <img
                    src={selectedPaymentBooking.serviceId?.serviceImage || "/placeholder.svg"}
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Đóng
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppointments;