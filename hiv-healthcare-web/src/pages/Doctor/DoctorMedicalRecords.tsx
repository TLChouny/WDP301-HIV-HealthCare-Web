import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useResult } from "../../context/ResultContext";
import {
  Loader,
  Stethoscope,
  Calendar,
  Activity,
  User,
  FileText,
  MapPin,
  Pill,
  AlertTriangle,
  AlertCircle,
  Clock,
  Search,
} from "lucide-react";
import { Result } from "../../types/result";

// Format frequency value (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có";
  const num = parseInt(freq, 10);
  return isNaN(num) ? freq : `${num} lần/ngày`;
};

const DoctorMedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const { getByDoctorName, loading } = useResult();
  const [records, setRecords] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user?.userName) return;
      try {
        const data = await getByDoctorName(user.userName);
        setRecords(data);
        console.log("Fetched doctor medical records:", data);
      } catch (err) {
        console.error("Error fetching doctor medical records:", err);
      }
    };

    fetchRecords();
  }, [user, getByDoctorName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-gray-600" />
        <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Stethoscope className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Bệnh Án Bác Sĩ</h1>
              <p className="text-gray-600 mt-1">Quản lý hồ sơ khám bệnh của bệnh nhân</p>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-6 flex justify-start">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm theo tên bệnh nhân, mã đặt lịch hoặc tên kết quả..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Records list */}
        {records.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hồ sơ bệnh án</h3>
            <p className="text-gray-500">Không tìm thấy hồ sơ nào cho bác sĩ {user?.userName}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {records
              .filter((record: Result) => {
                const patientName = record.bookingId?.userId?.userName || record.bookingId?.customerName || "";
                const bookingCode = record.bookingId?.bookingCode || "";
                const resultName = record.resultName || "";
                const term = searchTerm.trim().toLowerCase();
                return (
                  patientName.toLowerCase().includes(term) ||
                  bookingCode.toLowerCase().includes(term) ||
                  resultName.toLowerCase().includes(term)
                );
              })
              .map((record: Result) => (
                <div
                  key={record._id}
                  className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {record.resultName || "Tên kết quả chưa có"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Tái khám:{" "}
                        {record.reExaminationDate
                          ? new Date(record.reExaminationDate).toLocaleDateString("vi-VN")
                          : "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Bệnh nhân:{" "}
                        {record.bookingId?.userId?.userName || record.bookingId?.customerName || "Không xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Địa chỉ: {record.bookingId?.userId?.address || "Chưa có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Trạng thái: {record.bookingId?.status || "Không có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Ngày khám:{" "}
                        {record.bookingId?.bookingDate
                          ? new Date(record.bookingId.bookingDate).toLocaleDateString("vi-VN")
                          : "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Bác sĩ: {record.bookingId?.doctorName || "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Thời gian: {record.bookingId?.startTime && record.bookingId?.endTime
                          ? `${record.bookingId.startTime} - ${record.bookingId.endTime}`
                          : "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">
                        Mã đặt lịch: {record.bookingId?.bookingCode || "Chưa có"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-1">Tải lượng HIV</h4>
                    <p className="text-gray-700 bg-white p-2 rounded border">
                      {record.resultDescription || "Không có mô tả"}
                    </p>
                  </div>

                  {record.medicationTime && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-1">Thời gian uống thuốc</h4>
                      <p className="text-gray-700 bg-white p-2 rounded border">{record.medicationTime}</p>
                    </div>
                  )}

                  {record.medicationSlot && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-1">Khe thời gian uống thuốc</h4>
                      <p className="text-gray-700 bg-white p-2 rounded border">{record.medicationSlot}</p>
                    </div>
                  )}

                  {record.arvregimenId && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Phác đồ ARV</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tên phác đồ</label>
                          <p className="text-gray-900 bg-white p-2 rounded border">
                            {record.arvregimenId.arvName || "Chưa có"}
                          </p>
                        </div>
                        {record.arvregimenId.arvDescription && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <p className="text-gray-900 bg-white p-2 rounded border">
                              {record.arvregimenId.arvDescription}
                            </p>
                          </div>
                        )}
                      </div>
                      {record.arvregimenId.drugs?.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin thuốc</label>
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tên thuốc</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Liều dùng</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tần suất</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">CCI</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">TDP</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {record.arvregimenId.drugs.map((drug: string, index: number) => {
                                  const frequencies = record.arvregimenId?.frequency
                                    ? record.arvregimenId.frequency.split(";")
                                    : [];
                                  return (
                                    <tr key={index} className="border-t border-gray-200">
                                      <td className="px-4 py-2 text-sm text-gray-900">{drug}</td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {record.arvregimenId?.dosages[index] || "Chưa có"}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {formatFrequency(frequencies[index])}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {record.arvregimenId?.contraindications[index] || "Chưa có"}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {record.arvregimenId?.sideEffects[index] || "Chưa có"}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {record.arvregimenId.contraindications?.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Chống chỉ định
                          </label>
                          <div className="bg-red-50 rounded border border-red-200">
                            {record.arvregimenId.contraindications.map((item: string, index: number) => (
                              <div key={index} className="p-2 border-b border-red-100 last:border-b-0">
                                <span className="text-red-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {record.arvregimenId.sideEffects?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            Tác dụng phụ
                          </label>
                          <div className="bg-yellow-50 rounded border border-yellow-200">
                            {record.arvregimenId.sideEffects.map((effect: string, index: number) => (
                              <div key={index} className="p-2 border-b border-yellow-100 last:border-b-0">
                                <span className="text-yellow-700">{effect}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>
                        Tạo lúc:{" "}
                        {record.createdAt
                          ? new Date(record.createdAt).toLocaleString("vi-VN")
                          : "Không rõ"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>
                        Cập nhật:{" "}
                        {record.updatedAt
                          ? new Date(record.updatedAt).toLocaleString("vi-VN")
                          : "Không rõ"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;