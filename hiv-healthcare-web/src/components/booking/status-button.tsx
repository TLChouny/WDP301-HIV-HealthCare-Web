"use client"

import type React from "react"
import { CheckCircle2, Clock, XCircle, CreditCard, RefreshCcw } from "lucide-react"
import type { Booking } from "../../types/booking" // Assuming this path is correct
import { translateBookingStatus } from "../../utils/status"

interface StatusButtonProps {
  status: string
  bookingId?: string
  onStatusChange: (bookingId: string, newStatus: Booking["status"]) => void
  isOnlineConsultation?: boolean
  userRole?: string
  serviceName?: string
}

const StatusButton: React.FC<StatusButtonProps> = ({
  status,
  bookingId,
  onStatusChange,
  isOnlineConsultation = false,
  userRole = "user",
  serviceName = "",
}) => {
  if (!bookingId) {
    return (
      <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        Lỗi: Không có ID
      </span>
    )
  }

  // Nếu đã có kết quả hoặc trạng thái đặc biệt thì chỉ hiển thị trạng thái hiện tại
  if (["re-examination", "checked-in", "completed", "cancelled", "confirmed", "paid"].includes(status)) {
    const statusStyles: { [key: string]: string } = {
      "checked-in": "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-purple-100 text-purple-700 border-purple-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      paid: "bg-orange-100 text-orange-700 border-orange-200",
      "re-examination": "bg-purple-100 text-purple-700 border-purple-200",
    }
    const getStatusIcon = (s: string) => {
      switch (s) {
        case "checked-in":
        case "completed":
          return <CheckCircle2 className="w-4 h-4 mr-2" />
        case "pending":
          return <Clock className="w-4 h-4 mr-2" />
        case "cancelled":
          return <XCircle className="w-4 h-4 mr-2" />
        case "confirmed":
          return <CheckCircle2 className="w-4 h-4 mr-2" />
        case "paid":
          return <CreditCard className="w-4 h-4 mr-2" />
        case "re-examination":
          return <RefreshCcw className="w-4 h-4 mr-2" />
        default:
          return null
      }
    }
    return (
      <span
        className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold ${
          statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {getStatusIcon(status)}
        {translateBookingStatus(status)}
      </span>
    )
  }

  // Chỉ doctor được phép cập nhật status từ "pending" sang "completed" cho "Tư vấn trực tuyến"
  if (userRole === "doctor" && status === "pending" && isOnlineConsultation) {
    return (
      <div
        onClick={() => onStatusChange(bookingId, "completed")}
        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-black hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md"
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Hoàn thành
      </div>
    )
  }

  // Cho phép chuyển từ "pending" hoặc "checked-out" sang "checked-in" cho các vai trò khác hoặc trạng thái mặc định
  if ((userRole === "doctor" || status === "checked-out") && status !== "completed") {
    return (
      <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Điểm danh
      </div>
    )
  }
  return null
}

export default StatusButton
