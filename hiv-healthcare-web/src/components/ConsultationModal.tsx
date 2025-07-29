// src/components/ConsultationModal.tsx
import React, { useState, useEffect } from "react";
import { Calendar, Phone, MapPin, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { useBooking } from "../context/BookingContext";
import { useServiceContext } from "../context/ServiceContext";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { Service } from "../types/service";
import { Booking } from "../types/booking";
import { User } from "../types/user"; // Giả sử bạn có định nghĩa User type

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const { create, checkExistingBookings } = useBooking();
  const { services, loadingServices, errorServices, refreshServices } = useServiceContext();
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const [formData, setFormData] = useState({
    fullName: user?.userName || "", // Gán giá trị mặc định từ user nếu có
    phone: user?.phone_number || "",
    email: user?.email || "",
    address: "",
    preferredDate: "",
    startTime: "",
    doctorName: "",
  });
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Tự động tìm service có serviceName là "Tư vấn trực tuyến"
  useEffect(() => {
    if (isOpen && !loadingServices && !errorServices) {
      const consultationService = services.find(s => 
        s.serviceName.toLowerCase().includes("Tư vấn trực tuyến".toLowerCase())
      );
      if (consultationService) setSelectedService(consultationService);
    }
  }, [isOpen, services, loadingServices, errorServices]);

  // Làm mới danh sách dịch vụ khi modal mở
  useEffect(() => {
    if (isOpen) {
      refreshServices();
    }
  }, [isOpen, refreshServices]);

  // Cập nhật formData khi user thay đổi (ví dụ: sau khi đăng nhập)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: user?.userName || prev.fullName,
      phone: user?.phone_number || prev.phone,
      email: user?.email || prev.email,
    }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.preferredDate || 
        !formData.startTime || !formData.doctorName || !selectedService) {
      toast.error("Vui lòng điền đầy đủ thông tin!", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      // Kiểm tra booking tồn tại
      const existingBookings = await checkExistingBookings(formData.doctorName, formData.preferredDate);
      if (existingBookings.length > 0) {
        toast.error("Bác sĩ đã có lịch hẹn vào thời gian này. Vui lòng chọn thời gian khác.", { position: "top-right", autoClose: 3000 });
        return;
      }

      // Tạo đối tượng User đầy đủ từ AuthContext
      const userData: User | null = user ? {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified || false,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
        phone_number: user.phone_number,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender ,
        avatar: user.avatar,
        userDescription: user.userDescription,
      } : null;

      const service: Service = selectedService!; // Đảm bảo selectedService không null khi submit

      // Tạo booking
      const bookingData: Partial<Booking> = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        bookingDate: formData.preferredDate,
        startTime: formData.startTime,
        doctorName: formData.doctorName,
        status: "pending",
        isAnonymous: false,
        userId: userData,
        serviceId: service,
        currency: "VND",
        notes: `Địa chỉ: ${formData.address || "Không có"}`,
      };

      await create(bookingData);
      toast.success("Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm.", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.", { position: "top-right", autoClose: 3000 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">Đặt Lịch Tư Vấn Trực Tuyến</h2>
        {loadingServices && <p className="text-center text-gray-600">Đang tải dịch vụ...</p>}
        {errorServices && <p className="text-center text-red-600">{errorServices}</p>}
        {!loadingServices && !errorServices && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Họ và Tên *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Số Điện Thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Địa Chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nhập địa chỉ (không bắt buộc)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Ngày Ưu Tiên *</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Thời Gian Bắt Đầu *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Chọn thời gian bắt đầu"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tên Bác Sĩ *</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nhập tên bác sĩ"
                required
              />
            </div>
            {selectedService && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Dịch Vụ</label>
                <input
                  type="text"
                  value={selectedService.serviceName}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Gửi Yêu Cầu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;