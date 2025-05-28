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
    if (!selectedDate || !selectedDoctor || (!isAnonymous && (!fullName || !dateOfBirth))) {
      toast.error('Vui lòng điền đầy đủ thông tin.', {
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
      anonymous: isAnonymous,
      fullName: isAnonymous ? 'Ẩn danh' : fullName,
      dateOfBirth: isAnonymous ? null : dateOfBirth,
    });

    toast.success(`Đặt lịch thành công! Số thứ tự của bạn là: ${newAppointmentNumber}`, {
      position: 'top-right',
      autoClose: 5000,
    });

    // TODO: Gửi dữ liệu đến API
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Đặt Lịch Khám</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isAnonymous && (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Ngày sinh</label>
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
          </>
        )}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Chọn ngày khám</label>
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
          <label className="block text-gray-700 font-medium mb-2">Chọn bác sĩ</label>
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