import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MessageSquare, AlertCircle, FileText, Heart, Shield } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    hivStatus: '',
    currentMedication: '',
    lastTestDate: '',
    reason: '',
    notes: ''
  });

  // Danh sách các khung giờ khám
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Danh sách bác sĩ chuyên khoa HIV
  const doctors = [
    { id: '1', name: 'BS. Nguyễn Văn A', specialty: 'Chuyên gia điều trị HIV' },
    { id: '2', name: 'BS. Trần Thị B', specialty: 'Tư vấn xét nghiệm HIV' },
    { id: '3', name: 'BS. Lê Văn C', specialty: 'Chuyên gia tâm lý' },
    { id: '4', name: 'BS. Phạm Thị D', specialty: 'Chuyên gia dinh dưỡng' }
  ];

  // Danh sách dịch vụ
  const services = [
    { id: '1', name: 'Tư vấn xét nghiệm HIV', description: 'Tư vấn trước và sau xét nghiệm HIV' },
    { id: '2', name: 'Điều trị ARV', description: 'Tư vấn và theo dõi điều trị ARV' },
    { id: '3', name: 'Tư vấn tâm lý', description: 'Hỗ trợ tâm lý cho người nhiễm HIV' },
    { id: '4', name: 'Tư vấn dinh dưỡng', description: 'Tư vấn chế độ dinh dưỡng phù hợp' },
    { id: '5', name: 'Khám tổng quát', description: 'Khám sức khỏe định kỳ' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc
    if (!selectedDate || !selectedTime || !selectedDoctor || !selectedService || 
        !formData.fullName || !formData.phone || !formData.hivStatus) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // TODO: Gửi dữ liệu đặt lịch lên server
    console.log({
      date: selectedDate,
      time: selectedTime,
      doctor: selectedDoctor,
      service: selectedService,
      ...formData
    });

    // Hiển thị thông báo thành công
    toast.success('Đặt lịch khám thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    
    // Chuyển hướng về trang chủ sau 2 giây
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Đặt Lịch Khám HIV</h1>
            <p className="text-gray-600">
              Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch khám với bác sĩ chuyên khoa HIV.
              Mọi thông tin của bạn sẽ được bảo mật tuyệt đối.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tuổi
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Nhập tuổi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tình trạng HIV <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hivStatus"
                    value={formData.hivStatus}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="positive">Dương tính</option>
                    <option value="negative">Âm tính</option>
                    <option value="unknown">Chưa xét nghiệm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thuốc đang sử dụng
                  </label>
                  <input
                    type="text"
                    name="currentMedication"
                    value={formData.currentMedication}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Nhập tên thuốc (nếu có)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày xét nghiệm gần nhất
                  </label>
                  <DatePicker
                    selected={formData.lastTestDate ? new Date(formData.lastTestDate) : null}
                    onChange={(date) => setFormData(prev => ({ ...prev, lastTestDate: date?.toISOString() || '' }))}
                    className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày"
                  />
                </div>
              </div>

              {/* Chọn bác sĩ và dịch vụ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn bác sĩ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Heart className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn dịch vụ</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Chọn ngày và giờ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngày <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Chọn ngày khám"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn giờ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn giờ khám</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Lý do khám */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do khám <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Nhập lý do khám"
                  required
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </div>
              </div>

              {/* Thông báo bảo mật */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="text-sm text-blue-600">
                    Mọi thông tin của bạn sẽ được bảo mật tuyệt đối. Chúng tôi cam kết không tiết lộ thông tin cá nhân của bạn cho bất kỳ ai.
                  </p>
                </div>
              </div>

              {/* Thông báo xác nhận */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-600">
                    Sau khi đặt lịch thành công, chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.
                  </p>
                </div>
              </div>

              {/* Nút đặt lịch */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-teal-600 text-white py-3 px-8 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg active:scale-95 active:bg-teal-800"
                >
                  Đặt Lịch Khám
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment; 