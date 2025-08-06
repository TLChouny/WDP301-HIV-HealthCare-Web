import type React from "react";
import { useEffect, useState, useCallback } from "react";
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
  Heart,
  TestTube,
  CheckCircle,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import type { Result } from "../../types/result";
import { getBookingStatusColor, translateBookingStatus } from "../../utils/status";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditCard, XCircle } from "react-feather";

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

  const statusStyles: { [key: string]: string } = {
    "checked-in": "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    completed: "bg-purple-100 text-purple-700 border-purple-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    paid: "bg-orange-100 text-orange-700 border-orange-200",
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "checked-in":
      case "completed":
        return <CheckCircle2 className="w-4 h-4 mr-2" />;
      case "pending":
        return <Clock className="w-4 h-4 mr-2" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 mr-2" />;
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4 mr-2" />;
      case "paid":
        return <CreditCard className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

   // The following JSX was outside of a function and caused a syntax error. 
   // If you need a reusable status badge, consider making it a component or function.
   // Removed misplaced return statement and JSX.

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

const DoctorMedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const { getByDoctorName, loading } = useResult();
  const [records, setRecords] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expandedRecords, setExpandedRecords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user?.userName) {
        setError("Không tìm thấy thông tin bác sĩ");
        toast.error("Không tìm thấy thông tin bác sĩ");
        return;
      }
      try {
        setError(null);
        const data = await getByDoctorName(user.userName);
        setRecords(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải hồ sơ bệnh án");
        toast.error(err.message || "Không thể tải hồ sơ bệnh án");
      }
    };
    fetchRecords();
  }, [user, getByDoctorName]);

  const toggleExpand = useCallback((recordId: string) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  }, []);

  const getPatientDisplayInfo = useCallback(
    (record: Result) => {
      const isAnonymous = record.bookingId?.isAnonymous || false;
      const name = record.bookingId?.userId?.userName || record.bookingId?.customerName || "";
      return {
        name: isAnonymous ? anonymizeName(name) : name || "Không xác định",
        isAnonymous,
      };
    },
    []
  );

  const filteredRecords = records.filter((record: Result) => {
    const patientInfo = getPatientDisplayInfo(record);
    const bookingCode = record.bookingId?.bookingCode || "";
    const resultName = record.resultName || "";
    const term = searchTerm.trim().toLowerCase();
    return (
      patientInfo.name.toLowerCase().includes(term) ||
      bookingCode.toLowerCase().includes(term) ||
      resultName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Hồ Sơ Bệnh Án Bác Sĩ</h1>
          </div>
          <p className="text-gray-600">
            Quản lý và theo dõi hồ sơ khám bệnh của bệnh nhân. Thông tin ẩn danh chỉ áp dụng cho bệnh nhân ẩn danh.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên bệnh nhân, mã đặt lịch hoặc tên kết quả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 animate-spin text-teal-600" />
              <span className="mt-4 text-lg text-gray-600">Đang tải dữ liệu hồ sơ...</span>
            </div>
          </div>
        )}

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

        {/* Records List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {searchTerm ? "Không tìm thấy hồ sơ nào" : "Chưa có hồ sơ bệnh án"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Thử thay đổi từ khóa tìm kiếm"
                    : "Tất cả hồ sơ bệnh án sẽ hiển thị tại đây."}
                </p>
              </div>
            ) : (
              filteredRecords.map((record: Result) => {
                const patientInfo = getPatientDisplayInfo(record);
                return (
                  <div
                    key={record._id}
                    className="bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300 p-6"
                  >
                    <div
                      className="flex items-center justify-between gap-3 mb-4 border-b pb-4 border-gray-100 cursor-pointer"
                      onClick={() => toggleExpand(record._id!)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {record.resultName || "Tên kết quả chưa có"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Mã đặt lịch: {record.bookingId?.bookingCode || "N/A"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${expandedRecords[record._id!] ? "rotate-180" : ""
                          }`}
                      />
                    </div>

                    {expandedRecords[record._id!] && (
                      <div>
                        {(() => {
                          // Check if this is an ARV test booking
                          const isArvTest = typeof record.bookingId?.serviceId === 'object' && 
                                          record.bookingId.serviceId?.isArvTest === true;
                          
                          if (isArvTest) {
                            // For ARV test bookings, only show basic info and the 3 required sections
                            return (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Calendar className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Ngày tái khám</p>
                                      <p className="font-medium text-gray-800">
                                        {record.reExaminationDate
                                          ? new Date(record.reExaminationDate).toLocaleDateString("vi-VN")
                                          : "Chưa xác định"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <User className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Bệnh nhân</p>
                                      <p className="font-medium text-gray-800">
                                        {patientInfo.name}{" "}
                                        {patientInfo.isAnonymous && (
                                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                            Ẩn danh
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <FileText className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Mã đặt lịch</p>
                                      <p className="font-medium text-gray-800">{record.bookingId?.bookingCode || "Chưa có"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Stethoscope className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Bác sĩ</p>
                                      <p className="font-medium text-gray-800">{record.bookingId?.doctorName || "Chưa xác định"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Calendar className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Ngày khám</p>
                                      <p className="font-medium text-gray-800">
                                        {record.bookingId?.bookingDate
                                          ? new Date(record.bookingId.bookingDate).toLocaleDateString("vi-VN")
                                          : "Chưa xác định"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Thời gian</p>
                                      <p className="font-medium text-gray-800">
                                        {record.bookingId?.startTime && record.bookingId?.endTime
                                          ? `${record.bookingId.startTime} - ${record.bookingId.endTime}`
                                          : "Chưa xác định"}
                                      </p>
                                    </div>
                                  </div>
                                  {record.bookingId?.status && (
                                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-500">Trạng thái</p>
                                        <span
                                          className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold border ${statusStyles[record.bookingId.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                                        >
                                          {getStatusIcon(record.bookingId.status)}
                                          <span className="ml-2">{translateBookingStatus(record.bookingId.status)}</span>
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* General Information - Always show for ARV tests */}
                                {/* <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
                                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-teal-600" />
                                    Thông Tin Chung
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">{record.symptoms || "Không có"}</p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả kết quả (nếu có ARV)</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.resultDescription || "Không có"}
                                      </p>
                                    </div>
                                  </div>
                                </div> */}
                              </>
                            );
                          } else {
                            // For non-ARV test bookings, show all sections as before
                            return (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Calendar className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Ngày tái khám</p>
                                      <p className="font-medium text-gray-800">
                                        {record.reExaminationDate
                                          ? new Date(record.reExaminationDate).toLocaleDateString("vi-VN")
                                          : "Chưa xác định"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <User className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Bệnh nhân</p>
                                      <p className="font-medium text-gray-800">
                                        {patientInfo.name}{" "}
                                        {patientInfo.isAnonymous && (
                                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                            Ẩn danh
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <FileText className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Mã đặt lịch</p>
                                      <p className="font-medium text-gray-800">{record.bookingId?.bookingCode || "Chưa có"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Stethoscope className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Bác sĩ</p>
                                      <p className="font-medium text-gray-800">{record.bookingId?.doctorName || "Chưa xác định"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Calendar className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Ngày khám</p>
                                      <p className="font-medium text-gray-800">
                                        {record.bookingId?.bookingDate
                                          ? new Date(record.bookingId.bookingDate).toLocaleDateString("vi-VN")
                                          : "Chưa xác định"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Thời gian</p>
                                      <p className="font-medium text-gray-800">
                                        {record.bookingId?.startTime && record.bookingId?.endTime
                                          ? `${record.bookingId.startTime} - ${record.bookingId.endTime}`
                                          : "Chưa xác định"}
                                      </p>
                                    </div>
                                  </div>
                                  {record.bookingId?.status && (
                                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-500">Trạng thái</p>
                                        <span
                                          className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold border ${statusStyles[record.bookingId.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                                        >
                                          {getStatusIcon(record.bookingId.status)}
                                          <span className="ml-2">{translateBookingStatus(record.bookingId.status)}</span>
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* General Information */}
                                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
                                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-teal-600" />
                                    Thông Tin Chung
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">{record.symptoms || "Không có"}</p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả kết quả</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.resultDescription || "Không có"}
                                      </p>
                                    </div>
                                    {/* Show testerName for Lab Tests */}
                                    {typeof record.bookingId?.serviceId === 'object' && 
                                     record.bookingId.serviceId?.isLabTest === true && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện xét nghiệm</label>
                                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                          {record.testerName || "Chưa có"}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Vital Signs */}
                                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
                                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-teal-600" />
                                    Chỉ Số Cơ Thể
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.weight ? `${record.weight} kg` : "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.height ? `${record.height} m` : "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">{record.bmi || "Chưa có"}</p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Huyết áp</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.bloodPressure || "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Mạch</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.pulse ? `${record.pulse} lần/phút` : "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhiệt độ</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.temperature ? `${record.temperature} °C` : "Chưa có"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Lab Test Information */}
                                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
                                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <TestTube className="h-5 w-5 text-teal-600" />
                                    Xét Nghiệm
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại mẫu xét nghiệm</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.sampleType || "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp xét nghiệm</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.testMethod || "Chưa có"}
                                      </p>
                                    </div>
                                    {/* Show testerName for Lab Tests */}
                                    {typeof record.bookingId?.serviceId === 'object' && record.bookingId.serviceId?.isLabTest === true && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện xét nghiệm</label>
                                        <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                          {record.testerName || "Chưa có"}
                                        </p>
                                      </div>
                                    )}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả xét nghiệm</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.testResult || "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Tải lượng virus</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.viralLoad ? `${record.viralLoad} copies/mL` : "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Diễn giải tải lượng virus</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.viralLoadInterpretation || "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng CD4</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.cd4Count ? `${record.cd4Count} cells/mm³` : "Chưa có"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Diễn giải CD4</label>
                                      <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                        {record.cd4Interpretation || "Chưa có"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        })()}

                        {/* ARV Regimen Information - Show for all records that have arvregimenId */}
                        {record.arvregimenId && (
                          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Pill className="h-5 w-5 text-teal-600" />
                              Thông Tin Phác Đồ ARV
                            </h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên phác đồ</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border font-medium">
                                    {record.arvregimenId.arvName || "Chưa có"}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã phác đồ</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                    {record.arvregimenId.regimenCode || "Chưa có"}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến điều trị</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                    {record.arvregimenId.treatmentLine || "Chưa có"}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                    {record.arvregimenId.recommendedFor || "Chưa có"}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian uống thuốc</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                    {formatMedicationTimes(record.medicationTime, record.medicationSlot)}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Khe thời gian uống thuốc</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                    {record.medicationSlot || "Chưa có"}
                                  </p>
                                </div>
                              </div>

                              {record.arvregimenId.arvDescription && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                  <p className="text-gray-800 bg-white p-3 rounded-xl border leading-relaxed">
                                    {record.arvregimenId.arvDescription}
                                  </p>
                                </div>
                              )}

                              {record.arvregimenId.drugs?.length > 0 && (
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
                                        {record.arvregimenId.drugs.map((drug: string, index: number) => {
                                          const frequencies = record.arvregimenId?.frequency
                                            ? record.arvregimenId.frequency.split(";")
                                            : [];
                                          return (
                                            <tr key={index} className="border-t border-gray-100">
                                              <td className="px-4 py-3 text-sm text-gray-800">{drug}</td>
                                              <td className="px-4 py-3 text-sm text-gray-800">
                                                {record.arvregimenId?.dosages[index] || "Chưa có"}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-800">
                                                {formatFrequency(frequencies[index])}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-800">
                                                {record.arvregimenId?.contraindications[index] || "Chưa có"}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-800">
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
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    Chống chỉ định
                                  </label>
                                  <div className="bg-red-50 rounded-xl border border-red-200">
                                    {record.arvregimenId.contraindications.map((item: string, index: number) => (
                                      <div key={index} className="p-3 border-b border-red-100 last:border-b-0">
                                        <span className="text-red-700">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {record.arvregimenId.sideEffects?.length > 0 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    Tác dụng phụ
                                  </label>
                                  <div className="bg-amber-50 rounded-xl border border-amber-200">
                                    {record.arvregimenId.sideEffects.map((effect: string, index: number) => (
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

                        {/* Notes and Interpretation - Always show */}
                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
                          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-teal-600" />
                            Nhận xét và diễn giải
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nhận xét của bác sĩ</label>
                              <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                {record.notes || "Chưa có"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú diễn giải</label>
                              <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                {record.interpretationNote || "Chưa có"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span>
                              Tạo lúc: {record.createdAt ? new Date(record.createdAt).toLocaleString("vi-VN") : "Không rõ"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span>
                              Cập nhật: {record.updatedAt ? new Date(record.updatedAt).toLocaleString("vi-VN") : "Không rõ"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DoctorMedicalRecords;