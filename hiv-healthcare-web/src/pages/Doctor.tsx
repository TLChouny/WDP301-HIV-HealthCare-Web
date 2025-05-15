// src/pages/Doctor.tsx
import React, { useState } from 'react';
import type { Doctor } from '../types/doctor'; // Sử dụng import type

const Doctor: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      specialty: 'HIV/AIDS',
      degree: 'Thạc sĩ Y khoa',
      schedule: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      specialty: 'HIV/AIDS',
      degree: 'Tiến sĩ Y khoa',
      schedule: 'Thứ 3 - Thứ 7: 9:00 - 18:00',
    },
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-semibold text-primary text-center">Quản Lý Thông Tin Bác Sĩ</h2>
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Tìm kiếm bác sĩ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-medium text-primary">{doctor.name}</h3>
            <p className="text-gray-600 mt-2">Chuyên môn: {doctor.specialty}</p>
            <p className="text-gray-600">Bằng cấp: {doctor.degree}</p>
            <p className="text-gray-600">Lịch làm việc: {doctor.schedule}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctor;