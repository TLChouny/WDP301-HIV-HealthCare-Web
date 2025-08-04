import type React from "react";
import { useEffect, useState, useCallback } from "react";
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
  Heart,
  TestTube,
  User,
  Search,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useResult } from "../../context/ResultContext";
import { useAuth } from "../../context/AuthContext";
import type { User as UserType } from "../../types/user";
import type { Result } from "../../types/result";
import { getBookingStatusColor, translateBookingStatus, getStatusIcon } from "../../utils/status";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Format resultType
const formatResultType = (resultType: string | undefined): string => {
  if (!resultType) return "Chưa có";
  const resultTypeMap: { [key: string]: string } = {
    "positive-negative": "Dương tính/Âm tính",
    quantitative: "Định lượng",
    other: "Khác",
  };
  return resultTypeMap[resultType.toLowerCase()] || resultType;
};

// Format test result with color coding
const formatTestResult = (testResult: string | undefined): string => {
  if (!testResult) return "Chưa có";
  const resultMap: { [key: string]: string } = {
    positive: "Dương tính",
    negative: "Âm tính",
    invalid: "Không hợp lệ",
  };
  return resultMap[testResult.toLowerCase()] || testResult;
};

// Format viral load interpretation
const formatViralLoadInterpretation = (interpretation: string | undefined): string => {
  if (!interpretation) return "Chưa có";
  const interpretationMap: { [key: string]: string } = {
    undetectable: "Không phát hiện",
    low: "Thấp",
    high: "Cao",
  };
  return interpretationMap[interpretation.toLowerCase()] || interpretation;
};

// Format CD4 interpretation
const formatCD4Interpretation = (interpretation: string | undefined): string => {
  if (!interpretation) return "Chưa có";
  const interpretationMap: { [key: string]: string } = {
    normal: "Bình thường",
    low: "Thấp",
    very_low: "Rất thấp",
  };
  return interpretationMap[interpretation.toLowerCase()] || interpretation;
};

// Calculate and format BMI
const calculateBMI = (weight?: number, height?: number): string => {
  if (!weight || !height) return "Chưa có";
  const heightInMeters = height / 100; // convert cm to meters
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

// Get BMI status and color
const getBMIStatus = (weight?: number, height?: number): { status: string; color: string } => {
  if (!weight || !height) return { status: "Chưa có", color: "bg-gray-100 text-gray-800" };
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  if (bmi < 18.5) return { status: "Thiếu cân", color: "bg-blue-100 text-blue-800" };
  if (bmi >= 18.5 && bmi < 25) return { status: "Bình thường", color: "bg-green-100 text-green-800" };
  if (bmi >= 25 && bmi < 30) return { status: "Thừa cân", color: "bg-yellow-100 text-yellow-800" };
  return { status: "Béo phì", color: "bg-red-100 text-red-800" };
};

// Anonymize patient name
const anonymizeName = (name: string): string => {
  if (!name) return "Không xác định";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0) + "*".repeat(words[0].length - 1);
  }
  return (
    words[0].charAt(0) +
    "*".repeat(words[0].length - 1) +
    " " +
    words[words.length - 1].charAt(0) +
    "*".repeat(words[words.length - 1].length - 1)
  );
};

const MedicalRecords: React.FC = () => {
  const { getByUserId, loading } = useResult();
  const { getUserById, user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<Result[]>([]);
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Result | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recordsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        setError("Không tìm thấy thông tin người dùng");
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }
      try {
        setError(null);
        const [userData, resultsData] = await Promise.all([getUserById(user._id), getByUserId(user._id)]);
        setUserInfo(userData);
        setMedicalRecords(resultsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err: any) {
        setError(err.message || "Không thể tải hồ sơ bệnh án");
        toast.error(err.message || "Không thể tải hồ sơ bệnh án");
      }
    };
    fetchData();
  }, [getByUserId, getUserById, user?._id]);

  const handleViewRecord = useCallback((record: Result) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  }, []);

  // Filter records based on search term
  const filteredRecords = medicalRecords.filter((record: Result) => {
    const serviceName = record.bookingId?.serviceId?.serviceName || "Khác";
    const doctorName = record.bookingId?.doctorName || "";
    const resultName = record.resultName || "";
    const term = searchTerm.trim().toLowerCase();
    return (
      serviceName.toLowerCase().includes(term) ||
      doctorName.toLowerCase().includes(term) ||
      resultName.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

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

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo dịch vụ, bác sĩ hoặc tên kết quả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-red-700 font-medium text-lg">Lỗi tải dữ liệu</p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-base font-semibold"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!error && (
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
                      {currentRecords.map((record: Result) => {
                        const isAnonymous = record.bookingId?.isAnonymous || false;
                        const doctorName = isAnonymous
                          ? anonymizeName(record.bookingId?.doctorName || "")
                          : record.bookingId?.doctorName || "Chưa xác định";
                        return (
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
                                          : "Không tái khám"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Stethoscope className="h-4 w-4 text-teal-600" />
                                      <span className="text-gray-700">{doctorName}</span>
                                      {isAnonymous && (
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                          Ẩn danh
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Activity className="h-4 w-4 text-teal-600" />
                                      <span className="text-gray-700">{record.resultName || "Chưa có tên"}</span>
                                    </div>
                                    {record.bookingId?.status && (
                                      <span
                                        className={`inline-flex items-center w-[12vh] px-2.5 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getBookingStatusColor(
                                          record.bookingId.status
                                        )} text-white whitespace-nowrap`}
                                      >
                                        {getStatusIcon(record.bookingId.status)}
                                        <span className="ml-1">{translateBookingStatus(record.bookingId.status)}</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                    {record.symptoms || "Không có triệu chứng"}
                                  </p>
                                  {record.arvregimenId?.drugs && record.arvregimenId.drugs.length > 0 && (
                                    <div className="mt-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thông tin thuốc
                                      </label>
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
                                  className="ml-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                  Chi tiết
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-teal-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {searchTerm ? "Không tìm thấy hồ sơ nào" : "Chưa có hồ sơ khám bệnh"}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? "Thử thay đổi từ khóa tìm kiếm"
                          : "Hồ sơ khám bệnh sẽ được hiển thị tại đây sau khi bạn thực hiện khám"}
                      </p>
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
        )}

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
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
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
                          : "Không tái khám"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.symptoms || "Không có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhận xét của bác sĩ</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.notes || "Không có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú diễn giải</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.interpretationNote || "Không có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả kết quả</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.resultDescription || "Không có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.testerName || "Không có"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
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
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.weight && selectedRecord.height ? (
                          <span className="flex items-center gap-2">
                            <span className="font-medium">
                              {selectedRecord.bmi || calculateBMI(selectedRecord.weight, selectedRecord.height)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              getBMIStatus(selectedRecord.weight, selectedRecord.height).color
                            }`}>
                              {getBMIStatus(selectedRecord.weight, selectedRecord.height).status}
                            </span>
                          </span>
                        ) : "Chưa có"}
                      </p>
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
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.testerName || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả xét nghiệm</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.testResult ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                            selectedRecord.testResult === 'positive' ? 'bg-red-100 text-red-800' :
                            selectedRecord.testResult === 'negative' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {formatTestResult(selectedRecord.testResult)}
                          </span>
                        ) : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị đo</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.unit || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tải lượng virus</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.viralLoad ? `${selectedRecord.viralLoad} ${selectedRecord.unit || 'copies/mL'}` : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu VL</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.viralLoadReference || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diễn giải tải lượng virus</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.viralLoadInterpretation ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                            selectedRecord.viralLoadInterpretation === 'undetectable' ? 'bg-green-100 text-green-800' :
                            selectedRecord.viralLoadInterpretation === 'low' ? 'bg-yellow-100 text-yellow-800' :
                            selectedRecord.viralLoadInterpretation === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {formatViralLoadInterpretation(selectedRecord.viralLoadInterpretation)}
                          </span>
                        ) : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng CD4</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.cd4Count ? `${selectedRecord.cd4Count} cells/mm³` : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu CD4</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.cd4Reference || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diễn giải CD4</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.cd4Interpretation ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                            selectedRecord.cd4Interpretation === 'normal' ? 'bg-green-100 text-green-800' :
                            selectedRecord.cd4Interpretation === 'low' ? 'bg-yellow-100 text-yellow-800' :
                            selectedRecord.cd4Interpretation === 'very_low' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {formatCD4Interpretation(selectedRecord.cd4Interpretation)}
                          </span>
                        ) : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kháng nguyên P24</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.p24Antigen !== undefined ? 
                          (selectedRecord.p24Antigen > 0 ? 
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              Dương tính ({selectedRecord.p24Antigen})
                            </span> :
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Âm tính
                            </span>
                          ) : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kháng thể HIV</label>
                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                        {selectedRecord.hivAntibody !== undefined ? 
                          (selectedRecord.hivAntibody > 0 ? 
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              Dương tính ({selectedRecord.hivAntibody})
                            </span> :
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Âm tính
                            </span>
                          ) : "Chưa có"}
                      </p>
                    </div>
                  </div>

                  {/* Co-infections section */}
                  {selectedRecord.coInfections && selectedRecord.coInfections.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Các bệnh nhiễm kèm
                      </label>
                      <div className="bg-orange-50 rounded-xl border border-orange-200">
                        <div className="p-3">
                          <div className="flex flex-wrap gap-2">
                            {selectedRecord.coInfections.map((infection: string, index: number) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                              >
                                {infection}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ARV Regimen Information */}
                {selectedRecord.arvregimenId && (
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mã phác đồ</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {selectedRecord.arvregimenId.regimenCode || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến điều trị</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {selectedRecord.arvregimenId.treatmentLine || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {selectedRecord.arvregimenId.recommendedFor || "Chưa có"}
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
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Chống chỉ định</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tác dụng phụ</th>
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
                                      <td className="px-4 py-3 text-sm text-gray-800">
                                        {selectedRecord.arvregimenId?.contraindications[index] || "Chưa có"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-800">
                                        {selectedRecord.arvregimenId?.sideEffects[index] || "Chưa có"}
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
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
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
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getBookingStatusColor(
                            selectedRecord.bookingId.status
                          )} text-white`}
                        >
                          {getStatusIcon(selectedRecord.bookingId.status)}
                          <span className="ml-1">{translateBookingStatus(selectedRecord.bookingId.status)}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.serviceId?.serviceName || selectedRecord.serviceId?.serviceName || "Chưa có"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả dịch vụ</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.serviceId?.serviceDescription || selectedRecord.serviceId?.serviceDescription || "Chưa có"}
                        </p>
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
                          {selectedRecord.bookingId.startTime && selectedRecord.bookingId.endTime
                            ? `${selectedRecord.bookingId.startTime} - ${selectedRecord.bookingId.endTime}`
                            : "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                          {selectedRecord.bookingId.isAnonymous
                            ? anonymizeName(selectedRecord.bookingId.doctorName || "Chưa xác định")
                            : selectedRecord.bookingId.doctorName || "Chưa xác định"}
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
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
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
      <ToastContainer />
    </div>
  );
};

export default MedicalRecords;