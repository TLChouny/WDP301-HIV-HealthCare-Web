import type React from "react"
import { useEffect, useState } from "react"
import {
  Eye,
  User,
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
} from "lucide-react"
import { useResult } from "../../context/ResultContext"
import { useAuth } from "../../context/AuthContext"

const MedicalRecords: React.FC = () => {
  const { getByUserId, loading } = useResult()
  const { getUserById, user } = useAuth()
  const [medicalRecords, setMedicalRecords] = useState<{ [key: string]: any[] }>({})
  const [userInfo, setUserInfo] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 3

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        console.error("User ID not available")
        return
      }
      try {
        const [userData, resultsData] = await Promise.all([getUserById(user._id), getByUserId(user._id)])
        setUserInfo(userData)
        console.log("Fetched user:", userData)

        // Group results by serviceName
        const groupedResults: { [key: string]: any[] } = {}
        resultsData.forEach((result: any) => {
          const serviceName = result.bookingId?.serviceId.serviceName
          if (!groupedResults[serviceName]) {
            groupedResults[serviceName] = []
          }
          groupedResults[serviceName].push(result)
        })
        setMedicalRecords(groupedResults)
        console.log("Grouped results:", groupedResults)
      } catch (error) {
        console.error("Lỗi fetch:", error)
        setMedicalRecords({})
      }
    }

    fetchData()
  }, [getByUserId, getUserById, user?._id])

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record)
    setOpenDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700"
      case "confirmed":
        return "bg-blue-50 text-blue-700"
      case "pending":
        return "bg-yellow-50 text-yellow-700"
      case "cancelled":
        return "bg-red-50 text-red-700"
      case "re-examination":
        return "bg-purple-50 text-purple-700"
      case "checked-in":
        return "bg-indigo-50 text-indigo-700"
      case "checked-out":
        return "bg-gray-50 text-gray-700"
      default:
        return "bg-gray-50 text-gray-700"
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
        return <XCircle className="h-4 w-4" />
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

  // Pagination logic
  const allRecords = Object.entries(medicalRecords)
    .flatMap(([_, results]) => results)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA // mới nhất lên trước
    })
  const totalRecords = allRecords.length
  const totalPages = Math.ceil(totalRecords / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = allRecords.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-gray-600" />
          <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Bệnh Án Điện Tử</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi lịch sử khám bệnh</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Left Panel - Patient Info (3/12) */}
          <div className="lg:w-1/3 w-full">
            {userInfo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Thông Tin Bệnh Nhân</h2>
                </div>

                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold shadow-sm mx-auto mb-4">
                    {userInfo.userName ? userInfo.userName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{userInfo.userName || "Chưa cập nhật"}</h3>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{userInfo.email || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">{userInfo.phone_number || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-medium text-gray-900">
                        {userInfo.dateOfBirth
                          ? new Date(userInfo.dateOfBirth).toLocaleDateString("vi-VN")
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">⚥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="font-medium text-gray-900">{userInfo.gender || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{userInfo.address || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Tổng số lần khám</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalRecords}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Medical Records (7/12) */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Lịch Sử Khám Bệnh</h2>
                    <p className="text-gray-600">Chi tiết các lần khám và kết quả điều trị</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                {currentRecords.length > 0 ? (
                  <div className="space-y-6">
                    {currentRecords.map((record: any) => (
                      <div key={record._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-4">
                          <div className="flex items-center gap-3">
                            <Stethoscope className="h-5 w-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {record.bookingId?.serviceId?.serviceName || record.bookingId?.serviceName || "Khác"}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">
                                    {record.reExaminationDate
                                      ? new Date(record.reExaminationDate).toLocaleDateString("vi-VN")
                                      : "Chưa xác định"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-700">
                                    {record.bookingId?.doctorName || "Chưa xác định"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                  <Activity className="h-3 w-3" />
                                  {record.resultName || "Chưa có tên"}
                                </span>
                                {record.bookingId?.status && (
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.bookingId.status)}`}
                                  >
                                    {getStatusIcon(record.bookingId.status)}
                                    {record.bookingId.status}
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 text-sm line-clamp-2">
                                {record.resultDescription || "Không có mô tả"}
                              </p>
                            </div>

                            <button
                              onClick={() => handleViewRecord(record)}
                              className="ml-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all shadow-sm"
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
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hồ sơ khám bệnh</h3>
                    <p className="text-gray-500">Hồ sơ khám bệnh sẽ được hiển thị tại đây sau khi bạn thực hiện khám</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalRecords > recordsPerPage && (
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                      } transition-all`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trang trước
                  </button>
                  <span className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                      } transition-all`}
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
            <div className="bg-white rounded-lg shadow-md max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Chi Tiết Hồ Sơ Khám Bệnh</h3>
                </div>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Result Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-600" />
                    Thông Tin Kết Quả
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên kết quả</label>
                      <p className="text-gray-900 bg-white p-2 rounded border">
                        {selectedRecord.resultName || "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tái khám</label>
                      <p className="text-gray-900 bg-white p-2 rounded border">
                        {selectedRecord.reExaminationDate
                          ? new Date(selectedRecord.reExaminationDate).toLocaleDateString("vi-VN")
                          : "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả kết quả</label>
                    <p className="text-gray-900 bg-white p-3 rounded border leading-relaxed">
                      {selectedRecord.resultDescription || "Không có mô tả"}
                    </p>
                  </div>
                </div>

                {/* Booking Information */}
                {selectedRecord.bookingId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      Thông Tin Đặt Lịch
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã đặt lịch</label>
                        <p className="text-gray-900 bg-white p-2 rounded border font-mono">
                          {selectedRecord.bookingId.bookingCode || "Chưa có"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRecord.bookingId.status)}`}
                        >
                          {getStatusIcon(selectedRecord.bookingId.status)}
                          {selectedRecord.bookingId.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                        <p className="text-gray-900 bg-white p-2 rounded border">
                          {selectedRecord.bookingId.bookingDate
                            ? new Date(selectedRecord.bookingId.bookingDate).toLocaleDateString("vi-VN")
                            : "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                        <p className="text-gray-900 bg-white p-2 rounded border">
                          {selectedRecord.bookingId.startTime} - {selectedRecord.bookingId.endTime || "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
                        <p className="text-gray-900 bg-white p-2 rounded border">
                          {selectedRecord.bookingId.doctorName || "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
                        <p className="text-gray-900 bg-white p-2 rounded border">
                          {selectedRecord.bookingId.startTime && selectedRecord.bookingId.endTime ? (
                            (() => {
                              const bookingDate = selectedRecord.bookingId.bookingDate; // "2025-07-20T00:00:00.000+00:00"

                              // Combine bookingDate + startTime
                              const datePart = new Date(bookingDate).toISOString().split("T")[0];
                              const start = new Date(`${datePart}T${selectedRecord.bookingId.startTime}:00`);
                              const end = new Date(`${datePart}T${selectedRecord.bookingId.endTime}:00`);

                              // Check valid
                              if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                                return "Không hợp lệ";
                              }

                              const diffMs = end.getTime() - start.getTime();
                              const diffMinutes = Math.round(diffMs / 60000);
                              return `${diffMinutes} phút`;
                            })()
                          ) : (
                            "Chưa xác định"
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedRecord.bookingId.notes && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <p className="text-gray-900 bg-white p-3 rounded border leading-relaxed">
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
                          className="text-blue-600 hover:text-blue-800 bg-white p-2 rounded border block break-all"
                        >
                          {selectedRecord.bookingId.meetLink}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* ARV Regimen Information */}
                {selectedRecord.arvregimenId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-gray-600" />
                      Thông Tin Phác Đồ ARV
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên phác đồ</label>
                        <p className="text-gray-900 bg-white p-2 rounded border font-medium">
                          {selectedRecord.arvregimenId.arvName || "Chưa có"}
                        </p>
                      </div>
                      {selectedRecord.arvregimenId.arvDescription && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                          <p className="text-gray-900 bg-white p-3 rounded border leading-relaxed">
                            {selectedRecord.arvregimenId.arvDescription}
                          </p>
                        </div>
                      )}
                      {selectedRecord.arvregimenId.drugs && selectedRecord.arvregimenId.drugs.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Danh sách thuốc</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedRecord.arvregimenId.drugs.map((drug: string, index: number) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {drug}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedRecord.arvregimenId.dosages && selectedRecord.arvregimenId.dosages.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Liều dùng</label>
                          <div className="bg-white rounded border">
                            {selectedRecord.arvregimenId.dosages.map((dosage: string, index: number) => (
                              <div key={index} className="p-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-gray-900">{dosage}</span>
                              </div>
                            ))}
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
                            <div className="bg-red-50 rounded border border-red-200">
                              {selectedRecord.arvregimenId.contraindications.map((item: string, index: number) => (
                                <div key={index} className="p-2 border-b border-red-100 last:border-b-0">
                                  <span className="text-red-700">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      {selectedRecord.arvregimenId.sideEffects &&
                        selectedRecord.arvregimenId.sideEffects.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              Tác dụng phụ
                            </label>
                            <div className="bg-yellow-50 rounded border border-yellow-200">
                              {selectedRecord.arvregimenId.sideEffects.map((effect: string, index: number) => (
                                <div key={index} className="p-2 border-b border-yellow-100 last:border-b-0">
                                  <span className="text-yellow-700">{effect}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Thông Tin Thời Gian
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                      <p className="text-gray-900 bg-white p-2 rounded border">
                        {selectedRecord.createdAt
                          ? new Date(selectedRecord.createdAt).toLocaleString("vi-VN")
                          : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật</label>
                      <p className="text-gray-900 bg-white p-2 rounded border">
                        {selectedRecord.updatedAt
                          ? new Date(selectedRecord.updatedAt).toLocaleString("vi-VN")
                          : "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
                <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                  In hồ sơ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicalRecords