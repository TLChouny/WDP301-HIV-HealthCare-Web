import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, AlertCircle, Shield } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { getServiceById } from '../../api/serviceApi';
import { getAllUsers } from '../../api/authApi';
import { useBooking } from '../../context/BookingContext';
import type { Service } from '../../types/service';
import type { User } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

// Cấu hình toast chung
const TOAST_CONFIG = {
  position: 'top-right' as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored' as const,
};

// Hàm tiện ích để hiển thị toast
const showToast = (message: string, type: 'error' | 'success' = 'error') => {
  if (!toast.isActive(message)) {
    const config = { ...TOAST_CONFIG, toastId: message };
    if (type === 'success') {
      toast.success(message, config);
    } else {
      toast.error(message, config);
    }
  }
};

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { create } = useBooking();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
  });

  const [service, setService] = useState<Service | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formattedDate || !selectedTime || !selectedDoctor) {
      showToast('Vui lòng chọn ngày, giờ và bác sĩ!');
      return;
    }

    if (!isAnonymous && (!formData.customerName || !formData.customerPhone)) {
      showToast('Vui lòng điền họ tên và số điện thoại!');
      return;
    }

    try {
      const params = new URLSearchParams(location.search);
      const serviceId = params.get('serviceId') || '';

      const selectedDoctorObj = doctors.find((doc) => doc._id === selectedDoctor);

      const bookingData = {
        bookingDate: formattedDate.split('T')[0],
        startTime: selectedTime,
        fullName: isAnonymous ? undefined : formData.customerName,
        phone: isAnonymous ? undefined : formData.customerPhone,
        email: isAnonymous ? undefined : formData.customerEmail,
        doctorName: selectedDoctorObj?.userName ?? undefined,
        notes: formData.notes,
        serviceId: service ?? undefined,
        currency: 'VND',
        status: 'pending' as 'pending',
        isAnonymous,
        userId: user as User, // hoặc ép kiểu như trên nếu chỉ có _id
      };

      if (!user || !user._id) {
        showToast('Vui lòng đăng nhập để đặt lịch!');
        return;
      }

      console.log('Booking data sending to BE:', bookingData);

      await create(bookingData);

      showToast('Đặt lịch khám thành công!', 'success');
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Booking error:', err);
      // Xử lý lỗi cụ thể từ create
      if (err.message?.toLowerCase().includes('service')) {
        showToast('Dịch vụ không tồn tại!');
      } else if (err.message?.toLowerCase().includes('doctor')) {
        showToast('Bác sĩ không hợp lệ!');
      } else if (err.message?.toLowerCase().includes('time')) {
        showToast('Thời gian đặt lịch không khả dụng!');
      } else {
        showToast(err.message || 'Đặt lịch thất bại.');
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceId = params.get('serviceId');
    if (serviceId) {
      setServiceLoading(true);
      getServiceById(serviceId)
        .then((data) => setService(data))
        .catch((err) => {
          console.error('Service error:', err);
          showToast('Không thể tải thông tin dịch vụ!');
        })
        .finally(() => setServiceLoading(false));
    }
  }, [location.search]);

  useEffect(() => {
    setLoadingDoctors(true);
    getAllUsers()
      .then((users) => {
        setDoctors(users.filter((u: User) => u.role === 'doctor'));
      })
      .catch((err) => {
        console.error('Doctors error:', err);
        showToast('Không thể tải danh sách bác sĩ!');
      })
      .finally(() => setLoadingDoctors(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Đặt Lịch Khám HIV</h1>
          <p className="text-gray-600">
            Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch khám với bác sĩ chuyên khoa HIV.
            Mọi thông tin của bạn sẽ được bảo mật tuyệt đối.
          </p>
        </div>

        {serviceLoading ? (
          <div className="flex justify-center items-center py-6">
            <Calendar className="h-6 w-6 text-blue-600 animate-spin mr-2" />
            <span className="text-blue-600">Đang tải thông tin dịch vụ...</span>
          </div>
        ) : service ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            {service.serviceImage && (
              <img
                src={service.serviceImage}
                alt={service.serviceName}
                className="w-32 h-32 object-cover rounded-xl mb-4 md:mb-0"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-blue-700 mb-2">{service.serviceName}</h2>
              {service.price && (
                <div className="text-base font-semibold text-blue-600 mb-1">
                  {typeof service.price === 'number'
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)
                    : service.price}
                </div>
              )}
              <div className="text-gray-700 text-base">{service.serviceDescription}</div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Ẩn danh checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700 font-medium">
              Đặt lịch ẩn danh
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên {!isAnonymous && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="customerName" 
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-4"
                placeholder="Nhập họ và tên"
                required={!isAnonymous}
                disabled={isAnonymous}
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại {!isAnonymous && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-4"
                placeholder="Nhập số điện thoại"
                required={!isAnonymous}
                disabled={isAnonymous}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-4"
                placeholder="Nhập email"
                disabled={isAnonymous}
              />
            </div>

            {/* Bác sĩ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn bác sĩ <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-4"
                required
              >
                <option value="">Chọn bác sĩ</option>
                {loadingDoctors ? (
                  <option disabled>Đang tải danh sách bác sĩ...</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.userName} - {doctor.userDescription}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Ngày và giờ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngày <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                className="w-full rounded-lg border border-gray-300 py-2 px-4"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Chọn ngày khám"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn giờ <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-4"
                required
              >
                <option value="">Chọn giờ khám</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 py-2 px-4"
              placeholder="Nhập ghi chú (nếu có)"
            />
          </div>

          {/* Thông báo & bảo mật */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-2">
            <Shield className="h-5 w-5 text-blue-500 mt-1" />
            <p className="text-sm text-blue-600">
              Mọi thông tin của bạn sẽ được bảo mật tuyệt đối.
              {isAnonymous && ' Khi đặt lịch ẩn danh, chúng tôi chỉ sử dụng số điện thoại để liên hệ xác nhận lịch hẹn.'}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-green-500 mt-1" />
            <p className="text-sm text-green-600">
              Sau khi đặt lịch thành công, chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-teal-600 text-white py-3 px-8 rounded-lg font-medium text-lg transition-all hover:bg-teal-700"
            >
              Đặt Lịch Khám
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;