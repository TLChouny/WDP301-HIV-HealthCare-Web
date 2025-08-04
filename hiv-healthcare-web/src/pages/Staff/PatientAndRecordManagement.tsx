import type React from "react";
import { useState, useEffect } from "react";
import {
  Users,
  Phone,
  Mail,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader,
  AlertTriangle,
  User,
  Stethoscope,
  Clock,
  XCircle,
  MapPin,
  Activity,
  Heart,
  TestTube,
  Pill,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useResult } from "../../context/ResultContext";
import { getBookingStatusColor, translateBookingStatus, getStatusIcon } from "../../utils/status";
import type { User as UserType } from "../../types/user"; // Giả sử Result được định nghĩa ở đây
import { Result } from "../../types/result";
// Helper function to format frequency (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có";
  const num = Number.parseInt(freq, 10);
  return isNaN(num) ? freq : `${num} lần/ngày`;
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

const StaffPatientAndRecordManagement: React.FC = () => {
  const { getAllUsers, isAuthenticated } = useAuth();
  const { results, getByUserId, loading: resultsLoading } = useResult();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<"patients" | "records">("patients");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("Vui lòng đăng nhập để xem danh sách bệnh nhân.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        const filteredUsers = usersData.filter((user: UserType) => user.role === "user");
        setUsers(filteredUsers);
        setError(null);
      } catch (err: any) {
        setError(`Không thể tải danh sách bệnh nhân: ${err.message}`);
        console.error("Lỗi khi lấy danh sách người dùng:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, getAllUsers]);

  // Fetch results when user is selected and records tab is active
  useEffect(() => {
    let isMounted = true;
    if (activeTab === "records" && selectedUser) {
      setLoading(true);
      setError(null);
      getByUserId(selectedUser._id)
        .then((data) => {
          console.log("Fetched results:", data); // Debug log to check data structure
          if (isMounted) setLoading(false);
        })
        .catch((err: any) => {
          if (isMounted) {
            setError(`Không thể tải hồ sơ bệnh án: ${err.response?.data?.message || err.message}`);
            setLoading(false);
          }
        });
    } else if (activeTab === "records" && !selectedUser) {
      setError("Vui lòng chọn một bệnh nhân để xem hồ sơ bệnh án.");
      if (isMounted) setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, selectedUser, getByUserId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Bệnh Nhân & Hồ Sơ Bệnh Án</h1>
          </div>
          <p className="text-gray-600">Quản lý thông tin bệnh nhân và hồ sơ bệnh án của họ</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-2xl shadow border p-2">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab("patients");
                setSelectedUser(null);
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-lg font-semibold transition-all duration-200 ${activeTab === "patients"
                  ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              Danh sách Bệnh nhân
            </button>
            <button
              onClick={() => setActiveTab("records")}
              disabled={!selectedUser}
              className={`flex-1 py-3 px-4 rounded-xl text-lg font-semibold transition-all duration-200 ${activeTab === "records" && selectedUser
                  ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
                } ${!selectedUser ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Hồ sơ Bệnh án
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {(loading || resultsLoading) && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 animate-spin text-teal-600" />
              <span className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}
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

        {/* Patient List */}
        {!loading && !resultsLoading && !error && activeTab === "patients" && (
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Thông tin bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <div className="text-base font-medium text-gray-900">
                                {user.userName || "Không xác định"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 flex items-center space-x-2 mb-1">
                            <Phone className="w-4 h-4 text-teal-600" />
                            <span>{user.phone_number || "N/A"}</span>
                          </div>
                          <div className="text-sm text-gray-700 flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-teal-600" />
                            <span>{user.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => {
                              console.log("Selected user:", user);
                              setSelectedUser(user);
                              setActiveTab("records");
                              setError(null);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-md"
                          >
                            <FileText className="w-4 h-4" />
                            Xem Hồ sơ
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Users className="h-10 w-10 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Không tìm thấy bệnh nhân nào</h3>
                        <p className="text-gray-600">Danh sách bệnh nhân sẽ hiển thị tại đây.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Record List */}
        {!loading && !resultsLoading && !error && activeTab === "records" && (
          <div className="space-y-6">
            {results.length > 0 ? (
              results.map((result: Result) => (
                <div
                  key={result._id}
                  className="bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Hồ sơ khám: {result.resultName || "Không xác định"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Patient Info & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4 text-teal-600" />
                        <span>Bệnh nhân: {selectedUser?.userName || "Không xác định"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        <span>Ngày khám: {new Date(result.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-teal-600" />
                        Chẩn đoán & Thông tin chung
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <p className="text-gray-700">
                            <span className="font-medium">Tên kết quả:</span> {result.resultName || "Không có"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Mô tả:</span> {result.resultDescription || "Không có"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Người thực hiện XN:</span> {result.testerName || "Không có"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Ghi chú bác sĩ:</span> {result.notes || "Không có"}
                          </p>
                        </div>
                        {result.symptoms && (
                          <p className="text-gray-700 mt-2">
                            <span className="font-medium">Triệu chứng:</span> {result.symptoms}
                          </p>
                        )}
                        {result.interpretationNote && (
                          <p className="text-gray-700 mt-2">
                            <span className="font-medium">Ghi chú diễn giải:</span> {result.interpretationNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-teal-600" />
                        Chỉ số sinh tồn
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-gray-700">
                          <span className="font-medium">Cân nặng:</span> {result.weight ? `${result.weight} kg` : "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Chiều cao:</span>{" "}
                          {result.height ? `${result.height} cm` : "N/A"}
                        </p>
                        <div className="text-gray-700">
                          <span className="font-medium">BMI:</span>{" "}
                          {result.weight && result.height ? (
                            <span className="inline-flex items-center gap-2">
                              <span>{result.bmi || calculateBMI(result.weight, result.height)}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                getBMIStatus(result.weight, result.height).color
                              }`}>
                                {getBMIStatus(result.weight, result.height).status}
                              </span>
                            </span>
                          ) : "N/A"}
                        </div>
                        <p className="text-gray-700">
                          <span className="font-medium">Huyết áp:</span> {result.bloodPressure || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Mạch:</span> {result.pulse ? `${result.pulse} lần/phút` : "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Nhiệt độ:</span> {result.temperature ? `${result.temperature} °C` : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Lab Test Information */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-teal-600" />
                        Xét nghiệm chi tiết
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <p className="text-gray-700">
                            <span className="font-medium">Loại mẫu:</span> {result.sampleType || "N/A"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Phương pháp:</span> {result.testMethod || "N/A"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Đơn vị đo:</span> {result.unit || "N/A"}
                          </p>
                          <div className="text-gray-700">
                            <span className="font-medium">Kết quả XN:</span>{" "}
                            {result.testResult ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                result.testResult === 'positive' ? 'bg-red-100 text-red-800' :
                                result.testResult === 'negative' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {formatTestResult(result.testResult)}
                              </span>
                            ) : "N/A"}
                          </div>
                        </div>

                        {/* Viral Load Section */}
                        {(result.viralLoad || result.viralLoadInterpretation || result.viralLoadReference) && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-gray-700 mb-2">Tải lượng virus (VL)</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Giá trị:</span>{" "}
                                {result.viralLoad ? `${result.viralLoad} ${result.unit || 'copies/mL'}` : "N/A"}
                              </p>
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Tham chiếu:</span> {result.viralLoadReference || "N/A"}
                              </p>
                              <div className="text-gray-700 text-sm">
                                <span className="font-medium">Diễn giải:</span>{" "}
                                {result.viralLoadInterpretation ? (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    result.viralLoadInterpretation === 'undetectable' ? 'bg-green-100 text-green-800' :
                                    result.viralLoadInterpretation === 'low' ? 'bg-yellow-100 text-yellow-800' :
                                    result.viralLoadInterpretation === 'high' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {formatViralLoadInterpretation(result.viralLoadInterpretation)}
                                  </span>
                                ) : "N/A"}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CD4 Section */}
                        {(result.cd4Count || result.cd4Interpretation || result.cd4Reference) && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-gray-700 mb-2">Số lượng CD4</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Giá trị:</span>{" "}
                                {result.cd4Count ? `${result.cd4Count} cells/mm³` : "N/A"}
                              </p>
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Tham chiếu:</span> {result.cd4Reference || "N/A"}
                              </p>
                              <div className="text-gray-700 text-sm">
                                <span className="font-medium">Diễn giải:</span>{" "}
                                {result.cd4Interpretation ? (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    result.cd4Interpretation === 'normal' ? 'bg-green-100 text-green-800' :
                                    result.cd4Interpretation === 'low' ? 'bg-yellow-100 text-yellow-800' :
                                    result.cd4Interpretation === 'very_low' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {formatCD4Interpretation(result.cd4Interpretation)}
                                  </span>
                                ) : "N/A"}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Antibody/Antigen Tests */}
                        {(result.p24Antigen !== undefined || result.hivAntibody !== undefined) && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-gray-700 mb-2">Kháng thể & Kháng nguyên</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="text-gray-700 text-sm">
                                <span className="font-medium">P24 Antigen:</span>{" "}
                                {result.p24Antigen !== undefined ? (
                                  result.p24Antigen > 0 ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Dương tính ({result.p24Antigen})
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Âm tính
                                    </span>
                                  )
                                ) : "N/A"}
                              </div>
                              <div className="text-gray-700 text-sm">
                                <span className="font-medium">HIV Antibody:</span>{" "}
                                {result.hivAntibody !== undefined ? (
                                  result.hivAntibody > 0 ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Dương tính ({result.hivAntibody})
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Âm tính
                                    </span>
                                  )
                                ) : "N/A"}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Co-infections */}
                        {result.coInfections && result.coInfections.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              Các bệnh nhiễm kèm
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {result.coInfections.map((infection: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                >
                                  {infection}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ARV Regimen */}
                    {result.arvregimenId && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <Pill className="h-5 w-5 text-teal-600" />
                          Phác đồ điều trị ARV
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <p className="text-gray-700">
                              <span className="font-medium">Tên phác đồ:</span>{" "}
                              {result.arvregimenId.arvName || "Không có"}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Mã phác đồ:</span>{" "}
                              {result.arvregimenId.regimenCode || "Không có"}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Tuyến điều trị:</span>{" "}
                              {result.arvregimenId.treatmentLine || "Không có"}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Đối tượng:</span>{" "}
                              {result.arvregimenId.recommendedFor || "Không có"}
                            </p>
                          </div>

                          {/* Medication Schedule */}
                          {(result.medicationTime || result.medicationSlot) && (
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <h5 className="font-medium text-gray-700 mb-2">Lịch uống thuốc</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <p className="text-gray-700 text-sm">
                                  <span className="font-medium">Thời gian:</span> {result.medicationTime || "Chưa có"}
                                </p>
                                <p className="text-gray-700 text-sm">
                                  <span className="font-medium">Khe thời gian:</span> {result.medicationSlot || "Chưa có"}
                                </p>
                              </div>
                            </div>
                          )}

                          {result.arvregimenId.arvDescription && (
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <h5 className="font-medium text-gray-700 mb-2">Mô tả</h5>
                              <p className="text-gray-700 text-sm leading-relaxed">{result.arvregimenId.arvDescription}</p>
                            </div>
                          )}

                          {result.arvregimenId.drugs && result.arvregimenId.drugs.length > 0 && (
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <h5 className="font-medium text-gray-700 mb-2">Thông tin thuốc:</h5>
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200 rounded-xl">
                                  <thead className="bg-white">
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
                                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                        Chống chỉ định
                                      </th>
                                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                        Tác dụng phụ
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                    {result.arvregimenId.drugs.map((drug: string, index: number) => {
                                      // Handle dosages as array or split string if needed
                                      const dosages: string[] =
                                        Array.isArray(result.arvregimenId?.dosages)
                                          ? result.arvregimenId!.dosages
                                          : typeof result.arvregimenId?.dosages === "string"
                                            ? result.arvregimenId!.dosages
                                            : [];
                                      // Handle frequency as array or split string if needed
                                      const frequencies = Array.isArray(result.arvregimenId?.frequency)
                                        ? result.arvregimenId.frequency
                                        : result.arvregimenId?.frequency
                                          ? result.arvregimenId.frequency.split(";").filter((f) => f)
                                          : [];

                                      const dosage = dosages[index] || "Chưa có";
                                      const frequency = frequencies[index]
                                        ? formatFrequency(frequencies[index])
                                        : "Chưa có";

                                      return (
                                        <tr key={index} className="border-t border-gray-100">
                                          <td className="px-4 py-2 text-sm text-gray-800">{drug}</td>
                                          <td className="px-4 py-2 text-sm text-gray-800">{dosage}</td>
                                          <td className="px-4 py-2 text-sm text-gray-800">{frequency}</td>
                                          <td className="px-4 py-2 text-sm text-gray-800">
                                            {result.arvregimenId?.contraindications?.[index] || "Chưa có"}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-800">
                                            {result.arvregimenId?.sideEffects?.[index] || "Chưa có"}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Contraindications */}
                          {Array.isArray(result.arvregimenId.contraindications) &&
                            result.arvregimenId.contraindications.length > 0 && (
                              <div className="border-t border-gray-200 pt-3 mt-3">
                                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  Chống chỉ định tổng quát
                                </h5>
                                <div className="bg-red-50 rounded-xl border border-red-200 p-3">
                                  {result.arvregimenId.contraindications.map((c: string, idx: number) => (
                                    <p key={idx} className="text-red-700 text-sm">
                                      • {c}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Side Effects */}
                          {Array.isArray(result.arvregimenId.sideEffects) &&
                            result.arvregimenId.sideEffects.length > 0 && (
                              <div className="border-t border-gray-200 pt-3 mt-3">
                                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                  Tác dụng phụ chung
                                </h5>
                                <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
                                  {result.arvregimenId.sideEffects.map((s: string, idx: number) => (
                                    <p key={idx} className="text-amber-700 text-sm">
                                      • {s}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                    {/* Service Information & Re-examination */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-teal-600" />
                        Thông tin dịch vụ & Tái khám
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <p className="text-gray-700">
                            <span className="font-medium">Dịch vụ:</span>{" "}
                            {result.bookingId?.serviceId?.serviceName || result.serviceId?.serviceName || "Không có"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Mô tả dịch vụ:</span>{" "}
                            {result.bookingId?.serviceId?.serviceDescription || result.serviceId?.serviceDescription || "Không có"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Bác sĩ phụ trách:</span>{" "}
                            {result.bookingId?.doctorName || "Không có"}
                          </p>
                          {result.reExaminationDate && (
                            <p className="text-gray-700">
                              <span className="font-medium">Ngày tái khám:</span>{" "}
                              <span className="text-orange-600 font-medium">
                                {new Date(result.reExaminationDate).toLocaleDateString("vi-VN")}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status and timestamps */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getBookingStatusColor(
                            result.bookingId?.status || "pending"
                          )}`}
                        >
                          {getStatusIcon(result.bookingId?.status || "pending")}
                          {translateBookingStatus(result.bookingId?.status || "pending")}
                        </span>
                        {result.reExaminationDate && (
                          <div className="text-sm text-gray-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-600 font-medium">
                              Tái khám: {new Date(result.reExaminationDate).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Tạo: {new Date(result.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Cập nhật: {new Date(result.updatedAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {selectedUser ? "Không tìm thấy hồ sơ bệnh án." : "Vui lòng chọn một bệnh nhân để xem hồ sơ."}
                </h3>
                <p className="text-gray-600">Hồ sơ bệnh án sẽ hiển thị tại đây sau khi được tạo.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPatientAndRecordManagement;