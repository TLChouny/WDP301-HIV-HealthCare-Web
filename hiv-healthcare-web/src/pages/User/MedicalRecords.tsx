import type React from "react";
import { useEffect, useState } from "react";
import {
  Eye,
  Calendar,
  Phone,
  Mail,
  Stethoscope,
  FileText,
  X,
  Clock,
  MapPin,
  AlertTriangle,
  Pill,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  ChevronLeft,
  ChevronRight,
  Heart,
  TestTube,
  User,
} from "lucide-react";
import { useResult } from "../../context/ResultContext";
import { useAuth } from "../../context/AuthContext";
import type { User as UserType } from "../../types/user";
import type { Result } from "../../types/result";

// Format frequency value (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có";
  const num = Number.parseInt(freq, 10);
  return isNaN(num) ? freq : `${num} lần/ngày`;
};

// Format medication times based on medicationSlot
const formatMedicationTimes = (medicationTime: string | undefined, medicationSlot: string | undefined): string => {
  if (!medicationTime || !medicationSlot) return "Chưa có";
  const times = medicationTime.split(";").filter((t) => t);
  const slots =
    {
      Sáng: ["Sáng"],
      Trưa: ["Trưa"],
      Tối: ["Tối"],
      "Sáng và Trưa": ["Sáng", "Trưa"],
      "Trưa và Tối": ["Trưa", "Tối"],
      "Sáng và Tối": ["Sáng", "Tối"],
      "Sáng, Trưa và Tối": ["Sáng", "Trưa", "Tối"],
    }[medicationSlot] || [];
  if (times.length !== slots.length) return medicationTime;
  return times.map((time, i) => `${slots[i]}: ${time}`).join(", ");
};

const MedicalRecords: React.FC = () => {
  const { getByUserId, loading } = useResult();
  const { getUserById, user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<{ [key: string]: Result[] }>({});
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Result | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        console.error("User ID not available");
        return;
      }
      try {
        const [userData, resultsData] = await Promise.all([getUserById(user._id), getByUserId(user._id)]);
        setUserInfo(userData);
        console.log("Fetched user:", userData);
        // Group results by serviceName
        const groupedResults: { [key: string]: Result[] } = {};
        resultsData.forEach((result: Result) => {
          const serviceName = result.bookingId?.serviceId?.serviceName || "Khác";
          if (!groupedResults[serviceName]) {
            groupedResults[serviceName] = [];
          }
          groupedResults[serviceName].push(result);
        });
        setMedicalRecords(groupedResults);
        console.log("Grouped results:", groupedResults);
      } catch (error) {
        console.error("Lỗi fetch:", error);
        setMedicalRecords({});
      }
    };
    fetchData();
  }, [getByUserId, getUserById, user?._id]);

  const handleViewRecord = (record: Result) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "re-examination":
        return "bg-purple-100 text-purple-700";
      case "checked-in":
        return "bg-teal-100 text-teal-700";
      case "checked-out":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "re-examination":
        return <Activity className="h-4 w-4" />;
      case "checked-in":
        return <MapPin className="h-4 w-4" />;
      case "checked-out":
        return <MapPin className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Pagination logic
  const allRecords = Object.entries(medicalRecords)
    .flatMap(([_, results]) => results)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const totalRecords = allRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = allRecords.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-teal-600" />
          <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Hồ Sơ Bệnh Án Điện Tử</h1>
          </div>
          <p className="text-gray-600">Quản lý và theo dõi lịch sử khám bệnh của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Patient Info */}
          <div className="lg:col-span-1">
            {userInfo && (
              <div className="bg-white rounded-2xl shadow border p-6 h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Thông Tin Bệnh Nhân</h2>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt={userInfo.userName || "Avatar"}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {userInfo.userName ? userInfo.userName.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{userInfo.userName || "Chưa cập nhật"}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <Mail className="h-5 w-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{userInfo.email || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <Phone className="h-5 w-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-800">{userInfo.phone_number || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-medium text-gray-800">
                        {userInfo.dateOfBirth
                          ? new Date(userInfo.dateOfBirth).toLocaleDateString("vi-VN")
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <span className="text-teal-600 text-lg">⚥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="font-medium text-gray-800">{userInfo.gender || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-800">{userInfo.address || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl text-white">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <span className="font-medium">Tổng số lần khám</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{totalRecords}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Medical Records */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow border">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Lịch Sử Khám Bệnh</h2>
                    <p className="text-gray-600">Chi tiết các lần khám và kết quả điều trị</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {currentRecords.length > 0 ? (
                  <div className="space-y-6">
                    {currentRecords.map((record: Result) => (
                      <div
                        key={record._id}
                        className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                              <Stethoscope className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {record.bookingId?.serviceId?.serviceName || "Khác"}
                            </h3>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-teal-600" />
                                  <span className="font-medium text-gray-800">
                                    {record.reExaminationDate
                                      ? new Date(record.reExaminationDate).toLocaleDateString("vi-VN")
                                      : "Chưa xác định"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4 text-teal-600" />
                                  <span className="text-gray-700">
                                    {record.bookingId?.doctorName || "Chưa xác định"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-teal-600" />
                                  <span className="text-gray-700">{record.resultName || "Chưa có tên"}</span>
                                </div>
                                {record.bookingId?.status && (
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                      record.bookingId.status
                                    )}`}
                                  >
                                    {getStatusIcon(record.bookingId.status)}
                                    {record.bookingId.status}
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                {record.resultDescription || "Không có mô tả"}
                              </p>

                              {record.arvregimenId?.drugs && record.arvregimenId.drugs.length > 0 && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin thuốc</label>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 rounded-xl">
                                      <thead className="bg-gradient-to-r from-blue-50 to-teal-50">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Tên thuốc
                                          </th>
                                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Liều dùng
                                          </th>
                                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Tần suất
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white">
                                        {record.arvregimenId.drugs.map((drug: string, index: number) => {
                                          const frequencies = record.arvregimenId?.frequency
                                            ? record.arvregimenId.frequency.split(";")
                                            : [];
                                          return (
                                            <tr key={index} className="border-t border-gray-100">
                                              <td className="px-4 py-2 text-sm text-gray-800">{drug}</td>
                                              <td className="px-4 py-2 text-sm text-gray-800">
                                                {record.arvregimenId?.dosages[index] || "Chưa có"}
                                              </td>
                                              <td className="px-4 py-2 text-sm text-gray-800">
                                                {formatFrequency(frequencies[index])}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleViewRecord(record)}
                              className="ml-4 inline-flex items-center gap-2 px-4 py-2 mt-8 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-sm"
                            >
                              <Eye className="h-4 w-4" />
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có hồ sơ khám bệnh</h3>
                    <p className="text-gray-500">Hồ sơ khám bệnh sẽ được hiển thị tại đây sau khi bạn thực hiện khám</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalRecords > recordsPerPage && (
                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trang trước
                  </button>

                  <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-xl">
                    Trang {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700"
                    }`}
                  >
                    Trang sau
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Record Dialog */}
        {openDialog && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Chi Tiết Hồ Sơ Khám Bệnh</h3>
                </div>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* General Information */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-600" />
                    Thông Tin Chung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên kết quả</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.resultName || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tái khám</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.reExaminationDate
                          ? new Date(selectedRecord.reExaminationDate).toLocaleDateString("vi-VN")
                          : "Chưa xác định"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.symptoms || "Không có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả kết quả</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.resultDescription || "Không có"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-teal-600" />
                    Dấu Hiệu Sinh Tồn
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.weight ? `${selectedRecord.weight} kg` : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.height ? `${selectedRecord.height} cm` : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">{selectedRecord.bmi || "Chưa có"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Huyết áp</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.bloodPressure || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mạch</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.pulse ? `${selectedRecord.pulse} lần/phút` : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhiệt độ</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.temperature ? `${selectedRecord.temperature} °C` : "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lab Test Information */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-teal-600" />
                    Xét Nghiệm
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại mẫu xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.sampleType || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.testMethod || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại kết quả xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.resultType || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.testResult || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.testValue
                          ? `${selectedRecord.testValue} ${selectedRecord.unit || ""}`
                          : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.referenceRange || "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ARV Regimen Information */}
                {selectedRecord.arvregimenId && (
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-teal-600" />
                      Thông Tin Phác Đồ ARV
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tên phác đồ</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border font-medium">
                            {selectedRecord.arvregimenId.arvName || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian uống thuốc</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {formatMedicationTimes(selectedRecord.medicationTime, selectedRecord.medicationSlot)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Khe thời gian uống thuốc</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {selectedRecord.medicationSlot || "Chưa có"}
                          </p>
                        </div>
                      </div>

                      {selectedRecord.arvregimenId.arvDescription && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border leading-relaxed">
                            {selectedRecord.arvregimenId.arvDescription}
                          </p>
                        </div>
                      )}

                      {selectedRecord.arvregimenId.drugs && selectedRecord.arvregimenId.drugs.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin thuốc</label>
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-xl">
                              <thead className="bg-white">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên thuốc</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Liều dùng</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tần suất</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {selectedRecord.arvregimenId.drugs.map((drug: string, index: number) => {
                                  const frequencies = selectedRecord.arvregimenId?.frequency
                                    ? selectedRecord.arvregimenId.frequency.split(";")
                                    : [];
                                  return (
                                    <tr key={index} className="border-t border-gray-100">
                                      <td className="px-4 py-3 text-sm text-gray-800">{drug}</td>
                                      <td className="px-4 py-3 text-sm text-gray-800">
                                        {selectedRecord.arvregimenId?.dosages[index] || "Chưa có"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-800">
                                        {formatFrequency(frequencies[index])}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {selectedRecord.arvregimenId.contraindications &&
                        selectedRecord.arvregimenId.contraindications.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              Chống chỉ định
                            </label>
                            <div className="bg-red-50 rounded-xl border border-red-200">
                              {selectedRecord.arvregimenId.contraindications.map((item: string, index: number) => (
                                <div key={index} className="p-3 border-b border-red-100 last:border-b-0">
                                  <span className="text-red-700">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {selectedRecord.arvregimenId.sideEffects && selectedRecord.arvregimenId.sideEffects.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            Tác dụng phụ
                          </label>
                          <div className="bg-amber-50 rounded-xl border border-amber-200">
                            {selectedRecord.arvregimenId.sideEffects.map((effect: string, index: number) => (
                              <div key={index} className="p-3 border-b border-amber-100 last:border-b-0">
                                <span className="text-amber-700">{effect}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Booking Information */}
                {selectedRecord.bookingId && (
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-teal-600" />
                      Thông Tin Đặt Lịch
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã đặt lịch</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border font-mono">
                          {selectedRecord.bookingId.bookingCode || "Chưa có"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedRecord.bookingId.status
                          )}`}
                        >
                          {getStatusIcon(selectedRecord.bookingId.status)}
                          {selectedRecord.bookingId.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.bookingDate
                            ? new Date(selectedRecord.bookingId.bookingDate).toLocaleDateString("vi-VN")
                            : "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.startTime} - {selectedRecord.bookingId.endTime || "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.doctorName || "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.startTime && selectedRecord.bookingId.endTime
                            ? (() => {
                                const bookingDate = selectedRecord.bookingId.bookingDate;
                                const datePart = new Date(bookingDate).toISOString().split("T")[0];
                                const start = new Date(`${datePart}T${selectedRecord.bookingId.startTime}:00`);
                                const end = new Date(`${datePart}T${selectedRecord.bookingId.endTime}:00`);
                                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                                  return "Không hợp lệ";
                                }
                                const diffMs = end.getTime() - start.getTime();
                                const diffMinutes = Math.round(diffMs / 60000);
                                return `${diffMinutes} phút`;
                              })()
                            : "Chưa xác định"}
                        </p>
                      </div>
                    </div>

                    {selectedRecord.bookingId.notes && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border leading-relaxed">
                          {selectedRecord.bookingId.notes}
                        </p>
                      </div>
                    )}

                    {selectedRecord.bookingId.meetLink && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link cuộc họp</label>
                        <a
                          href={selectedRecord.bookingId.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-800 bg-white p-3 rounded-xl border block break-all"
                        >
                          {selectedRecord.bookingId.meetLink}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                    Thông Tin Thời Gian
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.createdAt
                          ? new Date(selectedRecord.createdAt).toLocaleString("vi-VN")
                          : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.updatedAt
                          ? new Date(selectedRecord.updatedAt).toLocaleString("vi-VN")
                          : "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all">
                  In hồ sơ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;