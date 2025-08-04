// Hàm so sánh ngày theo local
export const isSameDayLocal = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

// Hàm parse ngày
export const parseBookingDateLocal = (dateStr: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    const [datePart] = dateStr.split("T")
    const [y, m, d] = datePart.split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(dateStr)
}
