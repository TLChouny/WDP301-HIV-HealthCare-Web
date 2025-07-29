import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  AlertCircle,
  Shield,
  Clock,
  UserIcon,
  Phone,
  Mail,
  FileText,
  ChevronDown,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { getServiceById } from "../../api/serviceApi";
import { getAllUsers } from "../../api/authApi";
import { useBooking } from "../../context/BookingContext";
import type { Service } from "../../types/service";
import type { User } from "../../types/user";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import { Booking } from "../../types/booking";

// Toast configuration
const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as const,
};

const showToast = (message: string, type: "error" | "success" = "error") => {
  if (!toast.isActive(message)) {
    const config = { ...TOAST_CONFIG, toastId: message };
    if (type === "success") {
      toast.success(message, config);
    } else {
      toast.error(message, config);
    }
  }
};

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { create, checkExistingBookings } = useBooking();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const [filteredDoctors, setFilteredDoctors] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  });
  const [service, setService] = useState<Service | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);

  // Generate time slots function
  const generateTimeSlots = (start: string, end: string, interval = 30) => {
    const slots = [];
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
      slots.push(
        `${current.getHours().toString().padStart(2, "0")}:${current
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  };

  // Calculate end time for display in toast
  const calculateEndTime = (startTime: string, duration: number = 30) => {
    const [hour, minute] = startTime.split(":").map(Number);
    const total = hour * 60 + minute + duration;
    const endHour = Math.floor(total / 60) % 24;
    const endMinute = total % 60;
    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(
      2,
      "0"
    )}`;
  };

  const filterDoctorsByDate = (doctors: User[], date: Date) => {
    const selectedDay = format(date, "EEEE");
    return doctors.filter((doctor) => {
      if (!doctor.dayOfWeek || !doctor.startDay || !doctor.endDay) return false;
      const startDay = new Date(doctor.startDay);
      const endDay = new Date(doctor.endDay);
      return (
        doctor.dayOfWeek.includes(selectedDay) &&
        date >= startDay &&
        date <= endDay
      );
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelection = (time: string) => {
    const doctorObj = doctors.find((d) => d._id === selectedDoctor);
    if (bookedSlots.includes(time)) {
      showToast(
        `Bác sĩ ${
          doctorObj?.userName || "này"
        } đã có lịch hẹn từ ${time} đến ${calculateEndTime(
          time,
          service?.duration || 30
        )}! Vui lòng chọn khung giờ khác.`,
        "error"
      );
      return;
    }
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formattedDate || !selectedTime || !selectedDoctor) {
      showToast("Vui lòng chọn ngày, giờ và bác sĩ!");
      return;
    }

    if (!isAnonymous && (!formData.customerName || !formData.customerPhone)) {
      showToast("Vui lòng điền họ tên và số điện thoại!");
      return;
    }

    try {
      const params = new URLSearchParams(location.search);
      const serviceId = params.get("serviceId") || "";
      const selectedDoctorObj = doctors.find(
        (doc) => doc._id === selectedDoctor
      );

      const bookingData: Partial<Booking> = {
        bookingDate: formattedDate,
        startTime: selectedTime,
        customerName: isAnonymous ? undefined : formData.customerName,
        customerPhone: isAnonymous ? undefined : formData.customerPhone,
        customerEmail: isAnonymous ? undefined : formData.customerEmail,
        doctorName: selectedDoctorObj?.userName ?? undefined,
        notes: formData.notes,
        serviceId: service ?? undefined, // ✅ full object -> đúng type Service
        currency: "VND",
        status: "pending" as const,
        isAnonymous,
        userId: user, // Sử dụng toàn bộ user object nếu type Booking yêu cầu User
      };

      if (!user) {
        showToast("Vui lòng đăng nhập để đặt lịch!");
        return;
      }

      console.log("Booking data sending to BE:", bookingData);
      await create(bookingData);
      showToast("Đặt lịch khám thành công!", "success");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error("Booking error:", err);
      if (err.message?.toLowerCase().includes("service")) {
        showToast("Dịch vụ không tồn tại!");
      } else if (err.message?.toLowerCase().includes("doctor")) {
        showToast("Bác sĩ không hợp lệ!");
      } else if (err.message?.toLowerCase().includes("time")) {
        showToast("Thời gian đặt lịch không khả dụng!");
      } else {
        showToast(err.message || "Đặt lịch thất bại.");
      }
    }
  };

  // useEffect hooks
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceId = params.get("serviceId");

    if (serviceId) {
      setServiceLoading(true);
      getServiceById(serviceId)
        .then((data) => setService(data))
        .catch((err) => {
          console.error("Service error:", err);
          showToast("Không thể tải thông tin dịch vụ!");
        })
        .finally(() => setServiceLoading(false));
    }
  }, [location.search]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const users = await getAllUsers();
        const doctors = users.filter((u: User) => u.role === "doctor");
        setDoctors(doctors);
      } catch (err) {
        console.error("Doctors error:", err);
        showToast("Không thể tải danh sách bác sĩ!");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDate && doctors.length > 0) {
      const filtered = filterDoctorsByDate(doctors, selectedDate);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedDate, doctors]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (selectedDoctor && formattedDate) {
        try {
          const doctorObj = doctors.find((d) => d._id === selectedDoctor);
          if (doctorObj) {
            const booked = await checkExistingBookings(
              doctorObj.userName,
              formattedDate
            );
            setBookedSlots(booked);
          } else {
            setBookedSlots([]);
          }
        } catch (err) {
          console.error("Check bookings error:", err);
          showToast("Không thể kiểm tra khung giờ khả dụng!");
          setBookedSlots([]);
        }
      } else {
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDoctor, formattedDate, doctors, checkExistingBookings]);

  useEffect(() => {
    const doctorObj = doctors.find((d) => d._id === selectedDoctor);
    if (
      doctorObj &&
      doctorObj.startTimeInDay &&
      doctorObj.endTimeInDay &&
      formattedDate
    ) {
      const allSlots = generateTimeSlots(
        doctorObj.startTimeInDay,
        doctorObj.endTimeInDay
      );
      setTimeSlots(allSlots);
    } else {
      setTimeSlots([]);
    }
  }, [bookedSlots, selectedDoctor, formattedDate, doctors]);

  const isPastTime = (slotTime: string, date: Date): boolean => {
    const now = new Date();
    const slot = new Date(date);
    const [hour, minute] = slotTime.split(":").map(Number);
    slot.setHours(hour, minute, 0, 0);
    return slot < now;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-800 to-green-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Calendar className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Đặt Lịch Khám HIV</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch khám với bác sĩ
            chuyên khoa HIV. Mọi thông tin của bạn sẽ được bảo mật tuyệt đối.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
        {/* Service Information Card */}
        {serviceLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-center items-center py-8">
              <Calendar className="h-8 w-8 text-teal-600 animate-spin mr-3" />
              <span className="text-teal-600 text-lg font-medium">
                Đang tải thông tin dịch vụ...
              </span>
            </div>
          </div>
        ) : service ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {service.serviceImage && (
                <div className="flex-shrink-0">
                  <img
                    src={service.serviceImage || "/placeholder.svg"}
                    alt={service.serviceName}
                    className="w-32 h-32 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              )}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-left">
                  {service.serviceName}
                </h2>
                {service.price !== undefined && (
                  <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-lg font-semibold mb-4">
                    Giá tiền:&nbsp;
                    {service.price === 0
                      ? "Miễn phí"
                      : new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(service.price)}
                  </div>
                )}
                <p className="text-gray-600 text-lg leading-relaxed text-left">
                  {service.serviceDescription}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed text-left">
                  Thời lượng: {service.duration} phút
                </p>
                <p className="text-gray-600 text-lg leading-relaxed text-left">
                  Danh mục: {service.categoryId.categoryName}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Anonymous Booking Toggle */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      isAnonymous ? "bg-teal-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        isAnonymous ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Đặt lịch ẩn danh
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Bảo vệ thông tin cá nhân của bạn với tùy chọn đặt lịch ẩn
                    danh
                  </p>
                </div>
              </label>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <UserIcon className="h-6 w-6 mr-3 text-teal-600" />
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Họ và tên{" "}
                    {!isAnonymous && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                        isAnonymous
                          ? "bg-gray-100 border-gray-200 text-gray-400"
                          : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                      }`}
                      placeholder="Nhập họ và tên"
                      required={!isAnonymous}
                      disabled={isAnonymous}
                    />
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Số điện thoại{" "}
                    {!isAnonymous && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                        isAnonymous
                          ? "bg-gray-100 border-gray-200 text-gray-400"
                          : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                      }`}
                      placeholder="Nhập số điện thoại"
                      required={!isAnonymous}
                      disabled={isAnonymous}
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                        isAnonymous
                          ? "bg-gray-100 border-gray-200 text-gray-400"
                          : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                      }`}
                      placeholder="Nhập email"
                      disabled={isAnonymous}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-teal-600" />
                Chi tiết lịch hẹn
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Chọn bác sĩ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 py-4 px-4 pr-12 text-lg appearance-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                      required
                    >
                      <option value="">Chọn bác sĩ</option>
                      {loadingDoctors ? (
                        <option disabled>Đang tải danh sách bác sĩ...</option>
                      ) : filteredDoctors.length === 0 ? (
                        <option disabled>
                          Không có bác sĩ nào khả dụng vào ngày này
                        </option>
                      ) : (
                        filteredDoctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.userName} - {doctor.userDescription}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Chọn ngày <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      className="w-full rounded-xl border-2 border-gray-200 py-4 px-4 pl-12 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Chọn ngày khám"
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-teal-600" />
                  Chọn giờ <span className="text-red-500 ml-1">*</span>
                </label>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {timeSlots.map((time) => {
                      const isPast = selectedDate
                        ? isPastTime(time, selectedDate)
                        : false;
                      const isBooked = bookedSlots.includes(time);
                      const isDisabled = isPast || isBooked;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelection(time)}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                            selectedTime === time
                              ? "bg-teal-600 text-white border-teal-600 shadow-lg transform scale-105"
                              : isDisabled
                              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                          }`}
                          disabled={isDisabled}
                        >
                          {time}
                          {isBooked && (
                            <span className="ml-2 text-red-500 text-xs">
                              Đã đặt
                            </span>
                          )}
                          {isPast && !isBooked && (
                            <span >
                              
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">
                      Vui lòng chọn bác sĩ và ngày để xem giờ khả dụng
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-teal-600" />
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl border-2 border-gray-200 py-4 px-4 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 resize-none"
                placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
              />
            </div>

            {/* Security & Privacy Notices */}
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Bảo mật thông tin
                  </h4>
                  <p className="text-blue-700 leading-relaxed">
                    Mọi thông tin của bạn sẽ được bảo mật tuyệt đối theo tiêu
                    chuẩn y tế.
                    {isAnonymous &&
                      " Khi đặt lịch ẩn danh, chúng tôi chỉ sử dụng thông tin cần thiết để liên hệ xác nhận lịch hẹn."}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-green-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">
                    Xác nhận lịch hẹn
                  </h4>
                  <p className="text-green-700 leading-relaxed">
                    Sau khi đặt lịch thành công, chúng tôi sẽ liên hệ với bạn
                    trong vòng 24 giờ để xác nhận lịch hẹn và cung cấp hướng dẫn
                    chuẩn bị.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-800 to-green-900 text-white py-4 px-8 rounded-xl font-bold text-xl transition-all duration-200 hover:from-teal-700 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02] focus:ring-4 focus:ring-teal-200"
              >
                Đặt Lịch Khám Ngay
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default Appointment;
