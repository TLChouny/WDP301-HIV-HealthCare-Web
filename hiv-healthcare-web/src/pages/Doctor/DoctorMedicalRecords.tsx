import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useResult } from "../../context/ResultContext"
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
} from "lucide-react"
import type { Result } from "../../types/result"

// Format frequency value (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có"
  const num = Number.parseInt(freq, 10)
  return isNaN(num) ? freq : `${num} lần/ngày`
}

// Format medication times based on medicationSlot
const formatMedicationTimes = (medicationTime: string | undefined, medicationSlot: string | undefined): string => {
  if (!medicationTime || !medicationSlot) return "Chưa có"
  const times = medicationTime.split(";").filter((t) => t)
  const slots =
    {
      Sáng: ["Sáng"],
      Trưa: ["Trưa"],
      Tối: ["Tối"],
      "Sáng và Trưa": ["Sáng", "Trưa"],
      "Trưa và Tối": ["Trưa", "Tối"],
      "Sáng và Tối": ["Sáng", "Tối"],
      "Sáng, Trưa và Tối": ["Sáng", "Trưa", "Tối"],
    }[medicationSlot] || []
  if (times.length !== slots.length) return medicationTime // Fallback if lengths don't match
  return times.map((time, i) => `${slots[i]}: ${time}`).join(", ")
}

const DoctorMedicalRecords: React.FC = () => {
  const { user } = useAuth()
  const { getByDoctorName, loading } = useResult()
  const [records, setRecords] = useState<Result[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  // State to manage expanded/collapsed records
  const [expandedRecords, setExpandedRecords] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user?.userName) return
      try {
        const data = await getByDoctorName(user.userName)
        setRecords(data)
        console.log("Fetched doctor medical records:", data)
      } catch (err) {
        console.error("Error fetching doctor medical records:", err)
      }
    }
    fetchRecords()
  }, [user, getByDoctorName])

  // Function to toggle expand/collapse state for a record
  const toggleExpand = (recordId: string) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "re-examination":
        return "bg-purple-100 text-purple-700"
      case "checked-in":
        return "bg-teal-100 text-teal-700"
      case "checked-out":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      case "re-examination":
        return <Activity className="h-4 w-4" />
      case "checked-in":
        return <MapPin className="h-4 w-4" />
      case "checked-out":
        return <MapPin className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  const filteredRecords = records.filter((record: Result) => {
    const patientName = record.bookingId?.userId?.userName || record.bookingId?.customerName || ""
    const bookingCode = record.bookingId?.bookingCode || ""
    const resultName = record.resultName || ""
    const term = searchTerm.trim().toLowerCase()
    return (
      patientName.toLowerCase().includes(term) ||
      bookingCode.toLowerCase().includes(term) ||
      resultName.toLowerCase().includes(term)
    )
  })

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
          <p className="text-gray-600">Quản lý và theo dõi hồ sơ khám bệnh của bệnh nhân</p>
        </div>

        {/* Search input */}
        <div className="mb-6 flex justify-start">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="border border-gray-300 rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
              placeholder="Tìm kiếm theo tên bệnh nhân, mã đặt lịch hoặc tên kết quả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Records list */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow border">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-10 w-10 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có hồ sơ bệnh án</h3>
            <p className="text-gray-500">
              {searchTerm
                ? `Không tìm thấy hồ sơ nào phù hợp với "${searchTerm}"`
                : `Không tìm thấy hồ sơ nào cho bác sĩ ${user?.userName || "này"}`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRecords.map((record: Result) => (
              <div
                key={record._id}
                className="bg-white rounded-2xl shadow border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                {/* Collapsible Header */}
                <div
                  className="flex items-center justify-between gap-3 mb-4 border-b pb-4 border-gray-100 cursor-pointer"
                  onClick={() => toggleExpand(record._id!)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {record.resultName || "Tên kết quả chưa có"}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${
                      expandedRecords[record._id!] ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Collapsible Content */}
                {expandedRecords[record._id!] && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <Calendar className="h-5 w-5 text-teal-600" />
                        <div className="flex-1">
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
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Bệnh nhân</p>
                          <p className="font-medium text-gray-800">
                            {record.bookingId?.userId?.userName || record.bookingId?.customerName || "Không xác định"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <FileText className="h-5 w-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Mã đặt lịch</p>
                          <p className="font-medium text-gray-800">{record.bookingId?.bookingCode || "Chưa có"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <Stethoscope className="h-5 w-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Bác sĩ</p>
                          <p className="font-medium text-gray-800">{record.bookingId?.doctorName || "Chưa xác định"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <Calendar className="h-5 w-5 text-teal-600" />
                        <div className="flex-1">
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
                        <div className="flex-1">
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
                          {getStatusIcon(record.bookingId.status)}
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Trạng thái</p>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.bookingId.status)}`}
                            >
                              {record.bookingId.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* General Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-teal-600" />
                        Thông Tin Chung
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {record.symptoms || "Không có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả kết quả</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {record.resultDescription || "Không có"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-teal-600" />
                        Dấu Hiệu Sinh Tồn
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
                            {record.height ? `${record.height} cm` : "Chưa có"}
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
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-6">
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại kết quả xét nghiệm
                          </label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {record.resultType || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả xét nghiệm</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {record.testResult || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị xét nghiệm</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {record.testValue ? `${record.testValue} ${record.unit || ""}` : "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu</label>
                          <p className="text-gray-800 bg-white p-3 rounded-xl border">
                            {record.referenceRange || "Chưa có"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {record.arvregimenId && (
                      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-6">
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thời gian uống thuốc
                              </label>
                              <p className="text-gray-800 bg-white p-3 rounded-xl border">
                                {formatMedicationTimes(record.medicationTime, record.medicationSlot)}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Khe thời gian uống thuốc
                              </label>
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
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                        Tên thuốc
                                      </th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                        Liều dùng
                                      </th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                        Tần suất
                                      </th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">CCI</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">TDP</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                    {record.arvregimenId.drugs.map((drug: string, index: number) => {
                                      const frequencies = record.arvregimenId?.frequency
                                        ? record.arvregimenId.frequency.split(";")
                                        : []
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
                                      )
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorMedicalRecords
