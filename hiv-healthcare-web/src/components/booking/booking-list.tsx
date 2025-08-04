import type React from "react"
import { Calendar } from "lucide-react"
import type { Booking } from "../../types/booking" // Assuming this path is correct
import BookingCard from "./booking-card"

interface BookingListProps {
  loading: boolean
  error: string | null
  sortedBookings: Booking[]
  search: string
  selectedDate: Date | null
  selectedStatus: string
  getPatientDisplayInfo: (booking: Booking) => {
    name: string
    phone: string
    email: string
    doctorName: string
  }
  setSelectedBooking: (booking: Booking) => void
  setMedicalDate: (date: string) => void
  setMedicalType: (type: string) => void
  setOpenMedicalModal: (open: boolean) => void
  medicalRecordSent: { [bookingId: string]: boolean }
  hasResult: boolean
  onBookingUpdate?: () => void // Callback để refresh danh sách booking
}

const BookingList: React.FC<BookingListProps> = ({
  loading,
  error,
  sortedBookings,
  search,
  selectedDate,
  selectedStatus,
  getPatientDisplayInfo,
  setSelectedBooking,
  setMedicalDate,
  setMedicalType,
  setOpenMedicalModal,
  medicalRecordSent,
  hasResult,
  onBookingUpdate,
}) => {
  if (loading || error) {
    return null // Handled in parent component
  }

  if (sortedBookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow border p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-10 w-10 text-teal-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {search || selectedDate || selectedStatus !== "all"
            ? "Không tìm thấy lịch hẹn nào"
            : "Chưa có lịch hẹn nào được tạo"}
        </h3>
        <p className="text-gray-600">
          {search || selectedDate || selectedStatus !== "all"
            ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            : "Tất cả lịch hẹn sẽ hiển thị tại đây."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedBookings.map((booking) => (
        <BookingCard
          key={booking._id || Math.random()}
          booking={booking}
          getPatientDisplayInfo={getPatientDisplayInfo}
          setSelectedBooking={setSelectedBooking}
          setMedicalDate={setMedicalDate}
          setMedicalType={setMedicalType}
          setOpenMedicalModal={setOpenMedicalModal}
          medicalRecordSent={medicalRecordSent}
          hasResult={hasResult}
          onBookingUpdate={onBookingUpdate}
        />
      ))}
    </div>
  )
}

export default BookingList
