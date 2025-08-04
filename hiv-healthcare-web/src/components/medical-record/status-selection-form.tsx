import type React from "react"
import { CalendarClock, CheckCircle2 } from "lucide-react"
import type { Booking } from "../../types/booking" // Assuming this path is correct

interface StatusSelectionFormProps {
  selectedStatusForSubmit: "re-examination" | "completed" | null
  setSelectedStatusForSubmit: (status: "re-examination" | "completed" | null) => void
  selectedBooking: Booking
}

const StatusSelectionForm: React.FC<StatusSelectionFormProps> = ({
  selectedStatusForSubmit,
  setSelectedStatusForSubmit,
  selectedBooking,
}) => {
  return (
    <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col items-center">
      <div className="mb-4 text-lg text-gray-800 font-semibold">
        Chọn trạng thái gửi hồ sơ <span className="text-red-500">*</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        {/* Ẩn nút Tái Khám nếu booking là xét nghiệm labo */}
        {!(selectedBooking && typeof selectedBooking.serviceId === "object" && selectedBooking.serviceId.isLabTest) && (
          <button
            type="button"
            className={`flex-1 px-5 py-3 border-2 rounded-xl shadow-md flex items-center justify-center gap-2 text-base font-semibold transition-all duration-150
              ${
                selectedStatusForSubmit === "re-examination"
                  ? "border-purple-600 bg-purple-500 text-white ring-2 ring-purple-400"
                  : "border-purple-400 bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            onClick={() => setSelectedStatusForSubmit("re-examination")}
          >
            <CalendarClock className="w-6 h-6" />
            Tái khám
          </button>
        )}
        <button
          type="button"
          className={`flex-1 px-5 py-3 border-2 rounded-xl shadow-md flex items-center justify-center gap-2 text-base font-semibold transition-all duration-150
            ${
              selectedStatusForSubmit === "completed"
                ? "border-green-600 bg-green-500 text-white ring-2 ring-green-400"
                : "border-green-400 bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          onClick={() => setSelectedStatusForSubmit("completed")}
        >
          <CheckCircle2 className="w-6 h-6" />
          Hoàn tất
        </button>
      </div>
    </div>
  )
}

export default StatusSelectionForm
