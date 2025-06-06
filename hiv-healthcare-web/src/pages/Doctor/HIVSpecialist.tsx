import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Calendar, Search, FileText } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  license: string;
  schedule: string;
  phone?: string;
  email?: string;
  location?: string;
}

const HIVSpecialist: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      specialty: 'Chuyên gia HIV',
      degree: 'Tiến sĩ Y khoa',
      license: 'Số: 12345/HN-CC',
      schedule: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
      phone: '0123 456 789',
      email: 'dr.nguyenvana@example.com',
      location: 'Bệnh viện Bạch Mai, Hà Nội',
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      specialty: 'Chuyên gia HIV',
      degree: 'Thạc sĩ Y khoa',
      license: 'Số: 23456/HCM-CC',
      schedule: 'Thứ 3 - Thứ 7: 9:00 - 18:00',
      phone: '0987 654 321',
      email: 'dr.tranthib@example.com',
      location: 'Bệnh viện Chợ Rẫy, TP.HCM',
    },
    {
      id: '3',
      name: 'BS. Lê Văn C',
      specialty: 'Chuyên gia HIV',
      degree: 'Tiến sĩ Y khoa',
      license: 'Số: 34567/HUE-CC',
      schedule: 'Thứ 2 - Thứ 7: 8:00 - 16:00',
      phone: '0988 777 666',
      email: 'dr.levanc@example.com',
      location: 'Bệnh viện Trung ương Huế',
    }
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Đội ngũ Bác sĩ Chuyên khoa HIV
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-teal-100">
            Đội ngũ bác sĩ chuyên khoa HIV của chúng tôi là những chuyên gia hàng đầu trong lĩnh vực điều trị và chăm sóc bệnh nhân HIV/AIDS. 
            Với kinh nghiệm lâu năm và chuyên môn sâu rộng, họ cam kết mang đến dịch vụ chăm sóc y tế chất lượng cao nhất cho bệnh nhân.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-teal-600" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{doctor.name}</h3>
                  <span className="inline-block bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-medium">
                    {doctor.specialty}
                  </span>
                </div>

                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-red-600">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">Bằng cấp</p>
                      <p>{doctor.degree}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-red-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">Chứng chỉ hành nghề</p>
                      <p>{doctor.license}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-teal-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">Lịch làm việc</p>
                      <p>{doctor.schedule}</p>
                    </div>
                  </div>

                  {doctor.phone && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 text-teal-600">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">Điện thoại</p>
                        <p>{doctor.phone}</p>
                      </div>
                    </div>
                  )}

                  {doctor.email && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 text-teal-600">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">Email</p>
                        <p>{doctor.email}</p>
                      </div>
                    </div>
                  )}

                  {doctor.location && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 text-teal-600">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">Địa chỉ</p>
                        <p>{doctor.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <Link
                    to="/appointment"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Đặt lịch hẹn
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HIVSpecialist; 