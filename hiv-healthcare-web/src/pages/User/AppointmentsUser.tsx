import React, { useEffect, useState } from "react";
import { Eye, X, Calendar, Clock, User, Info, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { translateBookingStatus } from "../../utils/status";
import type { Booking } from "../../types/booking";

const UserAppointments: React.FC = () => {
  const navigate = useNavigate();
  const { getByUserId, remove } = useBooking();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?._id) {
        const userBookings = await getByUserId(user._id);
        setAppointments(userBookings || []);
      }
    };
    fetchAppointments();
  }, [getByUserId, user]);

  const handleViewAppointment = (appointment: Booking) => {
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  const handleCancelAppointment = async (id: string) => {
    await remove(id);
    setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    setOpenViewDialog(false);
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

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <Info className="mx-auto mb-4 text-gray-400" size={60} />
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Chưa có lịch hẹn nào</h3>
            <p className="text-gray-600 mb-6">Đặt lịch khám, xét nghiệm hoặc điều trị ngay hôm nay.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAppointments.map((appt) => (
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
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="inline-block px-4 py-2 rounded-full border bg-blue-50 text-blue-700 font-semibold text-base">
                      {translateBookingStatus(appt.status || "")}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewAppointment(appt)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition"
                      >
                        <Eye className="inline h-5 w-5 mr-1" /> Xem
                      </button>
                      {appt.status === "pending" && (
                        <button
                          onClick={() => handleCancelAppointment(appt._id!)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition"
                        >
                          <X className="inline h-5 w-5 mr-1" /> Hủy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                <p><strong>Giá:</strong> {selectedAppointment.serviceId?.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
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
                {selectedAppointment.status === "pending" && (
                  <button
                    onClick={() => handleCancelAppointment(selectedAppointment._id!)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                  >
                    Hủy lịch
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserAppointments;
