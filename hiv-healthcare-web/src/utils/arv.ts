// Format frequency value (e.g., "2" → "2 lần/ngày")
export const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có"
  const num = Number.parseInt(freq, 10)
  return isNaN(num) ? freq : `${num} lần/ngày`
}

// Map frequency display text to numeric values for storage
export const mapFrequencyToNumeric = (freq: string): string => {
  switch (freq) {
    case "Một lần/ngày":
      return "1"
    case "Hai lần/ngày":
      return "2"
    case "Ba lần/ngày":
      return "3"
    case "Khác":
      return "0"
    default:
      return freq || "0"
  }
}
