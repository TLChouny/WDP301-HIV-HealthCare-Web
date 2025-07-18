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
} from "lucide-react"

const DoctorMedicalRecords: React.FC = () => {
  const { user } = useAuth()
  const { getByDoctorName, loading } = useResult()
  const [records, setRecords] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-gray-600" />
        <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
      </div>
    )
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
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm theo tên bệnh nhân hoặc tên kết quả..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter records by searchTerm */}
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
              .filter((record: any) => {
                const patientName = record.bookingId?.userId?.userName || record.bookingId?.userName || ""
                const resultName = record.resultName || ""
                const term = searchTerm.trim().toLowerCase()
                return (
                  patientName.toLowerCase().includes(term) ||
                  resultName.toLowerCase().includes(term)
                )
              })
              .map((record: any) => (
                <div
                  key={record._id}
                  className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  {/* ...existing code.... */}
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {record.resultName || "Tên kết quả chưa có"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {record.bookingId?.userId?.userName ||
                          record.bookingId?.userName ||
                          "Không xác định"}
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
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-1">Tải lượng HIV</h4>
                    <p className="text-gray-700">{record.resultDescription || "Không có mô tả"}</p>
                  </div>

                  {record.arvregimenId && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Phác đồ ARV</h4>
                      </div>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Tên: </span>
                        {record.arvregimenId.arvName || "Chưa có"}
                      </p>
                      {record.arvregimenId.arvDescription && (
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Mô tả: </span>
                          {record.arvregimenId.arvDescription}
                        </p>
                      )}
                      {record.arvregimenId.drugs?.length > 0 && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-900">Thuốc:</span>
                          <ul className="list-disc list-inside text-gray-700">
                            {record.arvregimenId.drugs.map((drug: string, index: number) => (
                              <li key={index}>{drug}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {record.arvregimenId.contraindications?.length > 0 && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1 text-red-600 font-medium mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            Chống chỉ định:
                          </div>
                          <ul className="list-disc list-inside text-gray-700">
                            {record.arvregimenId.contraindications.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {record.arvregimenId.sideEffects?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 text-yellow-600 font-medium mb-1">
                            <AlertCircle className="h-4 w-4" />
                            Tác dụng phụ:
                          </div>
                          <ul className="list-disc list-inside text-gray-700">
                            {record.arvregimenId.sideEffects.map((effect: string, index: number) => (
                              <li key={index}>{effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
{/* 
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Tạo lúc:{" "}
                      {record.createdAt
                        ? new Date(record.createdAt).toLocaleString("vi-VN")
                        : "Không rõ"}
                    </p>
                    <p>
                      Cập nhật:{" "}
                      {record.updatedAt
                        ? new Date(record.updatedAt).toLocaleString("vi-VN")
                        : "Không rõ"}
                    </p>
                  </div> */}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorMedicalRecords
