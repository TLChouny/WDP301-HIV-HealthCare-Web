import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { type Doctor } from '../types/doctor';

const Appointment: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [appointmentNumber, setAppointmentNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [previousTest, setPreviousTest] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      specialty: 'HIV/AIDS',
      degree: 'Thạc sĩ',
      schedule: 'Thứ 2-6',
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      specialty: 'HIV/AIDS',
      degree: 'Tiến sĩ',
      schedule: 'Thứ 3-7',
    },
  ];

  const appointmentTypes = [
    { id: '1', name: 'Xét nghiệm HIV lần đầu' },
    { id: '2', name: 'Tư vấn trước xét nghiệm' },
    { id: '3', name: 'Tư vấn sau xét nghiệm' },
    { id: '4', name: 'Khám định kỳ' },
    { id: '5', name: 'Tư vấn điều trị ARV' },
  ];

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
  ];

  const generateAppointmentNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `AP${year}${month}${day}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedDoctor || !appointmentType || !preferredTime || 
        (!isAnonymous && (!fullName || !dateOfBirth || !phoneNumber))) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const newAppointmentNumber = generateAppointmentNumber();
    setAppointmentNumber(newAppointmentNumber);

    console.log({
      appointmentNumber: newAppointmentNumber,
      date: selectedDate,
      doctor: selectedDoctor,
      appointmentType,
      preferredTime,
      anonymous: isAnonymous,
      fullName: isAnonymous ? 'Ẩn danh' : fullName,
      dateOfBirth: isAnonymous ? null : dateOfBirth,
      phoneNumber: isAnonymous ? null : phoneNumber,
      email: isAnonymous ? null : email,
      previousTest,
      symptoms,
    });

    toast.success(`Đặt lịch thành công! Số thứ tự của bạn là: ${newAppointmentNumber}`, {
      position: 'top-right',
      autoClose: 5000,
    });

    // TODO: Gửi dữ liệu đến API
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Đặt Lịch Khám HIV</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Thông tin quan trọng</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Dịch vụ khám và xét nghiệm HIV hoàn toàn bảo mật</li>
            <li>Không phân biệt đối xử</li>
            <li>Hỗ trợ tư vấn trước và sau xét nghiệm</li>
            <li>Chi phí hợp lý, có bảo hiểm y tế</li>
          </ul>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Loại lịch hẹn <span className="text-red-500">*</span></label>
          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">-- Chọn loại lịch hẹn --</option>
            {appointmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {!isAnonymous && (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Họ và tên <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Ngày sinh <span className="text-red-500">*</span></label>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date: Date | null) => setDateOfBirth(date)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày sinh"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Nhập email (không bắt buộc)"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">Chọn ngày khám <span className="text-red-500">*</span></label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày"
            minDate={new Date()}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Chọn khung giờ <span className="text-red-500">*</span></label>
          <select
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">-- Chọn khung giờ --</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Chọn bác sĩ <span className="text-red-500">*</span></label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Bạn đã từng xét nghiệm HIV chưa?</label>
          <select
            value={previousTest}
            onChange={(e) => setPreviousTest(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">-- Chọn --</option>
            <option value="never">Chưa từng xét nghiệm</option>
            <option value="negative">Đã xét nghiệm, kết quả âm tính</option>
            <option value="positive">Đã xét nghiệm, kết quả dương tính</option>
            <option value="unknown">Đã xét nghiệm nhưng không nhớ kết quả</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Triệu chứng (nếu có)</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Mô tả các triệu chứng bạn đang gặp phải (nếu có)"
            rows={3}
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">Đăng ký ẩn danh</span>
          </label>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800">
            <strong>Lưu ý:</strong> Vui lòng đến đúng giờ hẹn. Nếu có thay đổi, vui lòng liên hệ trước ít nhất 24 giờ.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-all hover:scale-105"
        >
          Đặt Lịch
        </button>
      </form>
    </div>
  );
};

export default Appointment;