import type React from "react"
import { Search } from "lucide-react"

interface BookingFiltersProps {
  search: string
  setSearch: (search: string) => void
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  setCalendarDate: (date: Date | null) => void
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  search,
  setSearch,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
  setCalendarDate,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã lịch hẹn, tên, SĐT, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={
              selectedDate
                ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
                    selectedDate.getDate(),
                  ).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              if (!e.target.value) {
                setSelectedDate(null)
                setCalendarDate(null)
              } else {
                const [year, month, day] = e.target.value.split("-").map(Number)
                const date = new Date(year, month - 1, day)
                setSelectedDate(date)
                setCalendarDate(date)
              }
            }}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="checked-in">Đã điểm danh</option>
            <option value="cancelled">Đã hủy</option>
            <option value="completed">Hoàn thành</option>
            <option value="paid">Đã thanh toán</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default BookingFilters
