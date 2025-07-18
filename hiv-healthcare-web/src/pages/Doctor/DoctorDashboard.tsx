import React, { useEffect, useState } from 'react';
import { getAllBookings } from '../../api/bookingApi';
import { getAllARVRRegimens } from '../../api/arvApi';
import { 
  Users, 
  Calendar, 
  Pill,
  FileText
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const [patientCount, setPatientCount] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [regimenCount, setRegimenCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy user hiện tại từ localStorage
        const userStr = localStorage.getItem('user');
        let doctorName = '';
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user && user.role === 'doctor' && user.userName) {
              doctorName = user.userName;
            }
          } catch {}
        }
        console.log('doctorName:', doctorName);
        let patientSet = new Set();
        let bookingCount = 0;

        // Lấy tất cả booking và lọc theo doctorName
        const bookings = await getAllBookings();
        console.log('bookings:', bookings);
        const normalize = (str: string) => str?.trim().toLowerCase();
        let myBookings = Array.isArray(bookings)
          ? bookings.filter((b: any) => b.doctorName ? normalize(b.doctorName) === normalize(doctorName) : true)
          : [];
        // Nếu không có trường doctorName, lấy toàn bộ booking
        if (myBookings.length === 0 && Array.isArray(bookings)) {
          myBookings = bookings;
        }
        bookingCount = myBookings.length;

        // Lấy userId từ các booking, chỉ lấy unique
        myBookings.forEach((b: any) => {
          if (b.userId && b.userId._id) {
            patientSet.add(b.userId._id);
          }
        });

        setPatientCount(patientSet.size);
        setBookingCount(bookingCount);

        // Lấy tất cả phác đồ của bác sĩ (nếu phác đồ có trường doctorName)
        const regimens = await getAllARVRRegimens();
        console.log('regimens:', regimens);
        let myRegimens = Array.isArray(regimens)
          ? regimens.filter((r: any) => r.doctorName ? normalize(r.doctorName) === normalize(doctorName) : true)
          : [];
        // Nếu không có trường doctorName, lấy toàn bộ regimens
        if (myRegimens.length === 0 && Array.isArray(regimens)) {
          myRegimens = regimens;
        }
        setRegimenCount(myRegimens.length);
      } catch (err) {
        setPatientCount(0);
        setBookingCount(0);
        setRegimenCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl px-4 py-6 text-left">
          <h1 className="text-2xl font-bold text-gray-800">Bác sĩ điều trị</h1>
          <p className="text-gray-600 mt-2">Tổng quan hệ thống</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-4 py-8 flex flex-col items-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-blue-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-blue-800 text-lg">Tổng số bệnh nhân</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {loading ? '...' : patientCount}
            </p>
          </div>
          <div className="bg-green-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-green-800 text-lg">Tổng số lịch hẹn</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {loading ? '...' : bookingCount}
            </p>
          </div>
          <div className="bg-purple-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-purple-800 text-lg">Tổng số phác đồ</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {loading ? '...' : regimenCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;