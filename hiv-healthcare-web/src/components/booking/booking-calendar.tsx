"use client"

import type React from "react"
import { useCallback } from "react"
import CalendarComponent from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { isSameDayLocal } from "../../utils/date"

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface BookingCalendarProps {
  calendarDate: Date | null
  setCalendarDate: (date: Date | null) => void
  setSelectedDate: (date: Date | null) => void
  bookingDates: Date[]
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  calendarDate,
  setCalendarDate,
  setSelectedDate,
  bookingDates,
}) => {
  const handleCalendarChange = useCallback(
    (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
      if (value instanceof Date) {
        setCalendarDate(value)
        setSelectedDate(value)
      } else if (Array.isArray(value)) {
        const [start] = value
        if (start instanceof Date) {
          setCalendarDate(start)
          setSelectedDate(start)
        }
      } else {
        setCalendarDate(null)
        setSelectedDate(null)
      }
    },
    [setCalendarDate, setSelectedDate],
  )

  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Lịch hẹn theo ngày</h3>
      <CalendarComponent
        onChange={handleCalendarChange}
        value={calendarDate}
        selectRange={false}
        locale="vi-VN"
        className="react-calendar-custom"
        tileContent={({ date, view }) => {
          if (view === "month" && bookingDates.some((d) => isSameDayLocal(d, date))) {
            return (
              <div className="flex justify-center">
                <span className="block w-2 h-2 bg-teal-600 rounded-full mt-1"></span>
              </div>
            )
          }
          return null
        }}
      />
    </div>
  )
}

export default BookingCalendar
