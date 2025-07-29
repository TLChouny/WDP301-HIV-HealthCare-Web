import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookingApi";
import { getAllARVRRegimens } from "../../api/arvApi";
import {
  Users,
  Calendar,
  Pill,
  FileText,
  Clock,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

const DoctorDashboard: React.FC = () => {
  const [patientCount, setPatientCount] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [regimenCount, setRegimenCount] = useState<number>(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [regimens, setRegimens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy user hiện tại từ localStorage
        const userStr = localStorage.getItem("user");
        let doctorName = "";
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user && user.role === "doctor" && user.userName) {
              doctorName = user.userName;
            }
          } catch {}
        }
        console.log("doctorName:", doctorName);
        let patientSet = new Set();
        let bookingCount = 0;

        // Lấy tất cả booking và lọc theo doctorName
        const bookingsData = await getAllBookings();
        console.log("bookings:", bookingsData);
        const normalize = (str: string) => str?.trim().toLowerCase();
        let myBookings = Array.isArray(bookingsData)
          ? bookingsData.filter((b: any) =>
              b.doctorName ? normalize(b.doctorName) === normalize(doctorName) : true
            )
          : [];
        // Nếu không có trường doctorName, lấy toàn bộ booking
        if (myBookings.length === 0 && Array.isArray(bookingsData)) {
          myBookings = bookingsData;
        }
        bookingCount = myBookings.length;
        setBookings(myBookings);

        // Lấy userId từ các booking, chỉ lấy unique
        myBookings.forEach((b: any) => {
          if (b.userId && b.userId._id) {
            patientSet.add(b.userId._id);
          }
        });

        setPatientCount(patientSet.size);
        setBookingCount(bookingCount);

        // Lấy tất cả phác đồ của bác sĩ
        const regimensData = await getAllARVRRegimens();
        console.log("regimens:", regimensData);
        let myRegimens = Array.isArray(regimensData)
          ? regimensData.filter((r: any) =>
              r.doctorName ? normalize(r.doctorName) === normalize(doctorName) : true
            )
          : [];
        // Nếu không có trường doctorName, lấy toàn bộ regimens
        if (myRegimens.length === 0 && Array.isArray(regimensData)) {
          myRegimens = regimensData;
        }
        setRegimens(myRegimens);
        setRegimenCount(myRegimens.length);
      } catch (err: any) {
        setError(`Lỗi tải dữ liệu: ${err.message}`);
        setPatientCount(0);
        setBookingCount(0);
        setRegimenCount(0);
        setBookings([]);
        setRegimens([]);
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
          <div className="bg-blue-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-blue-800 text-lg">Tổng số bệnh nhân</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {loading ? "..." : patientCount}
            </p>
          </div>
          <div className="bg-green-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-green-800 text-lg">Tổng số lịch hẹn</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {loading ? "..." : bookingCount}
            </p>
          </div>
          <div className="bg-purple-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-purple-800 text-lg">Tổng số phác đồ</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {loading ? "..." : regimenCount}
            </p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="w-full bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Lịch hẹn gần đây
            </h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-600">Đang tải...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ngày hẹn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.userId?.userName || "Không xác định"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(booking.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : booking.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status || "Chưa xác định"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              Không có lịch hẹn nào.
            </div>
          )}
        </div>

        {/* Notable Regimens Table */}
        <div className="w-full bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Pill className="h-5 w-5 text-gray-600" />
              Phác đồ nổi bật
            </h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-600">Đang tải...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : regimens.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tên phác đồ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Số thuốc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cập nhật gần nhất
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regimens.slice(0, 5).map((regimen: any) => (
                    <tr key={regimen._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {regimen.arvName || "Không xác định"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {regimen.drugs?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(regimen.updatedAt || regimen.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              Không có phác đồ nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;