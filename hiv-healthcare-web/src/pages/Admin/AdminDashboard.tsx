import type React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  UsersIcon,
  StarIcon as StaffIcon,
  HospitalIcon as DoctorIcon,
  DollarSignIcon,
  DotIcon as DashboardIcon,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { message, Select, DatePicker } from "antd"
import dayjs from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

// IMPORT API THỰC TẾ ĐỂ LẤY DỮ LIỆU NGƯỜI DÙNG VÀ THANH TOÁN
import { getAllUsers } from "../../api/authApi"
import type { User } from "../../types/user"
import { getAllPayments } from "../../api/paymentApi"
import type { Payment } from "../../types/payment"

const { Option } = Select
const { RangePicker } = DatePicker

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [totalDoctors, setTotalDoctors] = useState<number | null>(null)
  const [totalStaff, setTotalStaff] = useState<number | null>(null)
  const [totalPatients, setTotalPatients] = useState<number | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // States mới cho bộ lọc biểu đồ doanh thu
  const [chartFilterType, setChartFilterType] = useState<"month" | "year">("month") // Lọc theo tháng hoặc năm
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    dayjs().startOf("year"), // Mặc định từ đầu năm hiện tại
    dayjs().endOf("month"), // Đến cuối tháng hiện tại
  ])
  const [allPayments, setAllPayments] = useState<Payment[]>([]) // Lưu trữ tất cả payments để lọc cho biểu đồ

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoadingStats(true)
        // Lấy tất cả người dùng từ API
        const usersData = await getAllUsers()
        if (Array.isArray(usersData)) {
          const doctors = usersData.filter((user: User) => user.role === "doctor").length
          const staff = usersData.filter((user: User) => user.role === "staff").length
          const normalUsers = usersData.filter((user: User) => user.role === "user").length
          const allUsersCount = usersData.length

          setTotalDoctors(doctors)
          setTotalStaff(staff)
          setTotalPatients(normalUsers)
          setTotalUsers(allUsersCount)
        } else {
          message.error("Dữ liệu người dùng không hợp lệ.")
          setTotalDoctors(0)
          setTotalStaff(0)
          setTotalPatients(0)
          setTotalUsers(0)
        }

        // Lấy tất cả dữ liệu thanh toán để dùng cho biểu đồ và tổng doanh thu
        const paymentsData = await getAllPayments()
        if (Array.isArray(paymentsData)) {
          setAllPayments(paymentsData) // Lưu trữ toàn bộ dữ liệu thanh toán
        } else {
          message.error("Dữ liệu thanh toán không hợp lệ.")
          setAllPayments([])
        }
      } catch (err: any) {
        message.error(err.message || "Lỗi khi tải dữ liệu thống kê")
        setTotalDoctors(0)
        setTotalStaff(0)
        setTotalPatients(0)
        setTotalUsers(0)
        setAllPayments([])
      } finally {
        setLoadingStats(false)
      }
    }
    loadDashboardData()
  }, [])

  // Logic xử lý dữ liệu cho biểu đồ (sử dụng useMemo để tối ưu)
  const revenueData = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return []

    const startDate = dateRange[0].startOf(chartFilterType).valueOf()
    const endDate = dateRange[1].endOf(chartFilterType).valueOf()

    const filteredAndGroupedData: { [key: string]: number } = {}
    ;(Array.isArray(allPayments) ? allPayments : []).forEach((p) => {
      if (p.status === "success" && p.amount && p.createdAt) {
        const paymentDate = dayjs(p.createdAt)
        if (paymentDate.valueOf() >= startDate && paymentDate.valueOf() <= endDate) {
          let key = ""
          if (chartFilterType === "month") {
            key = paymentDate.format("YYYY-MM") // Ví dụ: 2025-07
          } else {
            // year
            key = paymentDate.format("YYYY") // Ví dụ: 2025
          }
          if (!filteredAndGroupedData[key]) {
            filteredAndGroupedData[key] = 0
          }
          filteredAndGroupedData[key] += p.amount
        }
      }
    })

    const fullChartData: { name: string; "Total Amount": number }[] = []
    let currentMoment = dayjs(dateRange[0]).startOf(chartFilterType)

    while (currentMoment.valueOf() <= dayjs(dateRange[1]).endOf(chartFilterType).valueOf()) {
      let key = ""
      let displayLabel = ""
      if (chartFilterType === "month") {
        key = currentMoment.format("YYYY-MM")
        displayLabel = currentMoment.format("MM/YYYY") // Hiển thị MM/YYYY trên trục X
      } else {
        key = currentMoment.format("YYYY")
        displayLabel = currentMoment.format("YYYY") // Hiển thị YYYY trên trục X
      }

      fullChartData.push({
        name: displayLabel,
        "Total Amount": filteredAndGroupedData[key] || 0,
      })
      currentMoment = currentMoment.add(1, chartFilterType)
    }
    return fullChartData
  }, [allPayments, dateRange, chartFilterType])

  // Tính tổng doanh thu từ dữ liệu biểu đồ
  const totalRevenue = useMemo(() => {
    return revenueData.reduce((sum, item) => sum + (item["Total Amount"] || 0), 0)
  }, [revenueData])

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]])
    } else {
      setDateRange([null, null]) // Có thể reset về năm hiện tại hoặc để null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between p-8 mb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <DashboardIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Tổng quan Admin</h1>
              <p className="text-base text-gray-600">Thống kê và hoạt động của hệ thống</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tổng số Khách hàng */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 flex items-center gap-4">
              <UsersIcon className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng số Khách hàng</p>
                {loadingStats ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{totalPatients !== null ? totalPatients : "N/A"}</h2>
                )}
              </div>
            </div>
          </div>

          {/* Tổng số Bác sĩ */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 flex items-center gap-4">
              <DoctorIcon className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng số Bác sĩ</p>
                {loadingStats ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{totalDoctors !== null ? totalDoctors : "N/A"}</h2>
                )}
              </div>
            </div>
          </div>

          {/* Tổng số Nhân viên */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 flex items-center gap-4">
              <StaffIcon className="h-10 w-10 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng số Nhân viên</p>
                {loadingStats ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{totalStaff !== null ? totalStaff : "N/A"}</h2>
                )}
              </div>
            </div>
          </div>

          {/* Tổng Doanh thu */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 flex items-center gap-4">
              <DollarSignIcon className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng Doanh thu (theo bộ lọc)</p>
                {loadingStats ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString("vi-VN")} VNĐ</h2>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart Section */}
        <div className="w-full bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Biểu đồ thanh toán</h2>
          {/* Chart Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Lọc theo:</span>
            <Select
              value={chartFilterType}
              onChange={(value) => setChartFilterType(value as "month" | "year")}
              style={{ width: 120 }}
            >
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
            </Select>
            {chartFilterType === "month" && (
              <>
                <span className="text-gray-700 font-medium">Khoảng thời gian:</span>
                <RangePicker
                  picker="month"
                  value={dateRange as [dayjs.Dayjs, dayjs.Dayjs]}
                  onChange={handleDateRangeChange}
                  format="MM/YYYY"
                  style={{ width: 250 }}
                />
              </>
            )}
            {chartFilterType === "year" && (
              <>
                <span className="text-gray-700 font-medium">Khoảng thời gian:</span>
                <RangePicker
                  picker="year"
                  value={dateRange as [dayjs.Dayjs, dayjs.Dayjs]}
                  onChange={handleDateRangeChange}
                  format="YYYY"
                  style={{ width: 250 }}
                />
              </>
            )}
          </div>
          {loadingStats ? (
            <div className="flex justify-center items-center h-80">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => value.toLocaleString("vi-VN")}
                  label={{ value: "Tổng số tiền (VNĐ)", angle: -90, position: "insideLeft" }}
                />
                <RechartsTooltip formatter={(value: number) => `${value.toLocaleString("vi-VN")} VNĐ`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Total Amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="Tổng tiền"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
