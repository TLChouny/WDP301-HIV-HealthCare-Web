import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Phone, Mail, MapPin, Calendar, FileText, Briefcase, Cake, ChevronDown, ChevronUp } from 'lucide-react';
import type { User, Certification, Experience } from '../../types/user';
import { useAuth } from '../../context/AuthContext';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Chưa cập nhật';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Doctors = () => {
  const { getAllUsers } = useAuth();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // Accordion state: { [doctorId]: { personal: boolean, cert: boolean, exp: boolean } }
  const [openAccordions, setOpenAccordions] = useState<Record<string, { personal: boolean; cert: boolean; exp: boolean }>>({});

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const users = await getAllUsers();
        setDoctors((users as User[]).filter(u => u.role === 'doctor'));
      } catch (err) {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [getAllUsers]);

  const toggleAccordion = (doctorId: string, type: 'personal' | 'cert' | 'exp') => {
    setOpenAccordions(prev => ({
      ...prev,
      [doctorId]: {
        personal: type === 'personal' ? !prev[doctorId]?.personal : !!prev[doctorId]?.personal,
        cert: type === 'cert' ? !prev[doctorId]?.cert : !!prev[doctorId]?.cert,
        exp: type === 'exp' ? !prev[doctorId]?.exp : !!prev[doctorId]?.exp,
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Đội ngũ Y Bác sĩ
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-teal-100">
            Đội ngũ y bác sĩ của chúng tôi là những chuyên gia hàng đầu trong lĩnh vực chăm sóc sức khỏe cho người sống chung với HIV.
            Với kinh nghiệm và chuyên môn sâu rộng, chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao nhất.
          </p>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải danh sách bác sĩ...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor: User) => {
              const approvedCerts: Certification[] = (doctor.certifications || []).filter((cert: Certification) => cert.status === 'approved');
              const approvedExps: Experience[] = (doctor.experiences || []).filter((exp: Experience) => exp.status === 'approved');
              const accState = openAccordions[doctor._id] || { personal: false, cert: false, exp: false };
              return (
                <div key={doctor._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col items-center p-8">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    {doctor.avatar ? (
                      <img src={doctor.avatar} alt={doctor.userName} className="w-24 h-24 rounded-full object-cover border-2 border-white shadow" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-teal-600" />
                    )}
                  </div>
                  {/* Name & Email */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">{doctor.userName}</h2>
                  <p className="text-gray-500 text-center mb-4">{doctor.email || 'Chưa cập nhật'}</p>
                  {/* Accordions */}
                  <div className="w-full">
                    {/* Personal Info Accordion */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200 transition"
                      onClick={() => toggleAccordion(doctor._id, 'personal')}
                      type="button"
                    >
                      <span className="flex items-center gap-2 font-semibold text-teal-700">
                        <UserIcon className="w-5 h-5" /> Thông tin cá nhân
                      </span>
                      {accState.personal ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {accState.personal && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-200">
                        <ul className="space-y-4">
                          <li className="flex items-center gap-2 text-gray-700 text-sm">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">Giới tính:</span>
                            <span>{doctor.gender === 'male' ? 'Nam' : doctor.gender === 'female' ? 'Nữ' : doctor.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-700 text-sm">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">SĐT:</span>
                            <span>{doctor.phone_number || 'Chưa cập nhật'}</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-700 text-sm">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">Địa chỉ:</span>
                            <span>{doctor.address || 'Chưa cập nhật'}</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-700 text-sm">
                            <Cake className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">Ngày sinh:</span>
                            <span>{formatDate(doctor.dateOfBirth)}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {/* Certifications Accordion */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200 transition"
                      onClick={() => toggleAccordion(doctor._id, 'cert')}
                      type="button"
                    >
                      <span className="flex items-center gap-2 font-semibold text-teal-700">
                        <FileText className="w-5 h-5" /> Chứng chỉ làm việc
                      </span>
                      {accState.cert ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {accState.cert && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-200">
                        {approvedCerts.length === 0 ? (
                          <div className="text-gray-500 text-sm">Chứng chỉ làm việc chưa được cập nhật.</div>
                        ) : (
                          <ul className="space-y-4">
                            {approvedCerts.map(cert => (
                              <li key={cert._id || cert.title + cert.issueDate} className="flex flex-col gap-1 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText className="w-5 h-5 text-teal-600" />
                                  <span className="font-semibold text-gray-800 text-base">{cert.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <UserIcon className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">Cấp bởi:</span>
                                  <span>{cert.issuer || 'Chưa xác định'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>Ngày cấp: {formatDate(cert.issueDate)}</span>
                                  {cert.expiryDate && <><span className="mx-1">|</span><span>Ngày hết hạn: {formatDate(cert.expiryDate)}</span></>}
                                </div>
                                {cert.description && (
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FileText className="w-4 h-4 text-gray-300" />
                                    <span>{cert.description}</span>
                                  </div>
                                )}
                                {cert.fileUrl && (
                                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs mt-1">
                                    <FileText className="w-4 h-4" /> Xem tài liệu
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {/* Experiences Accordion */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200 transition"
                      onClick={() => toggleAccordion(doctor._id, 'exp')}
                      type="button"
                    >
                      <span className="flex items-center gap-2 font-semibold text-teal-700">
                        <Briefcase className="w-5 h-5" /> Kinh nghiệm làm việc
                      </span>
                      {accState.exp ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {accState.exp && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-200">
                        {approvedExps.length === 0 ? (
                          <div className="text-gray-500 text-sm">Kinh nghiệm làm việc chưa được cập nhật.</div>
                        ) : (
                          <ul className="space-y-4">
                            {approvedExps.map(exp => (
                              <li key={exp._id || exp.position + exp.startDate} className="flex flex-col gap-1 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <Briefcase className="w-5 h-5 text-blue-600" />
                                  <span className="font-semibold text-gray-800 text-base">{exp.position}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">Bệnh viện:</span>
                                  <span>{exp.hospital || 'Chưa xác định'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>Thời gian: {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Hiện tại'}</span>
                                </div>
                                {exp.description && (
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FileText className="w-4 h-4 text-gray-300" />
                                    <span>{exp.description}</span>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/appointment"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300 mt-auto"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Đặt lịch hẹn
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors; 