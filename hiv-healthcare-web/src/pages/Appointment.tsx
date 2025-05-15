import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { type Doctor } from '../types/doctor';

const Appointment: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedDoctor) {
      toast.error('Vui lòng chọn đầy đủ ngày khám và bác sĩ.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    console.log({
      date: selectedDate,
      doctor: selectedDoctor,
      anonymous: isAnonymous,
    });

    toast.success('Đặt lịch thành công!', {
      position: 'top-right',
      autoClose: 3000,
    });

    // TODO: Gửi dữ liệu đến API
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Đặt Lịch Khám</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Chọn ngày khám</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày"
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
          className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
        >
          Đặt Lịch
        </button>
      </form>
    </div>
  );
};

export default Appointment;