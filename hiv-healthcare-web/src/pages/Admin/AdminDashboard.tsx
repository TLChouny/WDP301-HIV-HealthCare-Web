import type React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  UsersIcon,
  StarIcon as StaffIcon,
  HospitalIcon as DoctorIcon,
  DollarSignIcon,
  DotIcon as DashboardIcon,
  UserCog,
  PieChart as PieIcon,
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { message, Select, DatePicker } from "antd"
import dayjs from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

import { getAllUsers } from "../../api/authApi"
import type { User } from "../../types/user"
import { getAllPayments } from "../../api/paymentApi"
import type { Payment } from "../../types/payment"
import { getAllServices } from "../../api/serviceApi"
import type { Service } from "../../types/service"
import { getAllBookings } from "../../api/bookingApi"
import type { Booking } from "../../types/booking"

const { Option } = Select
const { RangePicker } = DatePicker

const ROLE_COLORS = {
  admin: "#a78bfa",
  doctor: "#60a5fa",
  staff: "#34d399",
  tester: "#fb923c",
  user: "#9ca3af",
}
const PAYMENT_STATUS_COLORS = {
  success: "#22c55e",
  pending: "#f59e42",
  failed: "#ef4444",
  cancelled: "#a1a1aa",
}

const AdminDashboard = () => {
  // Removed unused totalUsers state
  const [totalDoctors, setTotalDoctors] = useState<number | null>(null)
  const [totalStaff, setTotalStaff] = useState<number | null>(null)
  const [totalTesters, setTotalTesters] = useState<number | null>(null)
  const [totalPatients, setTotalPatients] = useState<number | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [allPayments, setAllPayments] = useState<Payment[]>([])
  const [allServices, setAllServices] = useState<Service[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])

  // States cho bộ lọc biểu đồ doanh thu
  const [chartFilterType, setChartFilterType] = useState<"month" | "year">("month")
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    dayjs().startOf("year"),
    dayjs().endOf("month"),
  ])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoadingStats(true)
        const usersData = await getAllUsers()
        if (Array.isArray(usersData)) {
          setUsers(usersData)
          const doctors = usersData.filter((user: User) => user.role === "doctor").length
          const staff = usersData.filter((user: User) => user.role === "staff").length
          const testers = usersData.filter((user: User) => user.role === "tester").length
          const normalUsers = usersData.filter((user: User) => user.role === "user").length
          // const allUsersCount = usersData.length // removed unused variable

          setTotalDoctors(doctors)
          setTotalStaff(staff)
          setTotalTesters(testers)
          setTotalPatients(normalUsers)
          // setTotalUsers(allUsersCount) // removed unused state
        } else {
          message.error("Dữ liệu người dùng không hợp lệ.")
          setTotalDoctors(0)
          setTotalStaff(0)
          setTotalTesters(0)
          setTotalPatients(0)
          // setTotalUsers(0) // removed unused state
        }

        const paymentsData = await getAllPayments()
        if (Array.isArray(paymentsData)) {
          setAllPayments(paymentsData)
        } else {
          message.error("Dữ liệu thanh toán không hợp lệ.")
          setAllPayments([])
        }

        // Fetch services data
        const servicesData = await getAllServices()
        if (Array.isArray(servicesData)) {
          setAllServices(servicesData)
        } else {
          message.error("Dữ liệu dịch vụ không hợp lệ.")
          setAllServices([])
        }

        // Fetch bookings data
        const bookingsData = await getAllBookings()
        if (Array.isArray(bookingsData)) {
          setAllBookings(bookingsData)
        } else {
          message.error("Dữ liệu đặt lịch không hợp lệ.")
          setAllBookings([])
        }
      } catch (err: any) {
        message.error(err.message || "Lỗi khi tải dữ liệu thống kê")
        setTotalDoctors(0)
        setTotalStaff(0)
        setTotalTesters(0)
        setTotalPatients(0)
        // setTotalUsers(0) // removed unused state
        setAllPayments([])
        setAllServices([])
        setAllBookings([])
      } finally {
        setLoadingStats(false)
      }
    }
    loadDashboardData()
  }, [])

  // PieChart: Tỉ lệ vai trò
  const rolePieData = useMemo(() => {
    if (!users.length) return []
    const roleCounts: Record<string, number> = {}
    users.forEach(u => {
      roleCounts[u.role] = (roleCounts[u.role] || 0) + 1
    })
    return Object.entries(roleCounts).map(([role, value]) => ({
      name: role,
      value,
      color: ROLE_COLORS[role as keyof typeof ROLE_COLORS] || "#d1d5db",
      label: getRoleLabel(role),
    }))
  }, [users])

  // PieChart: Tỉ lệ trạng thái thanh toán
  const paymentStatusPieData = useMemo(() => {
    if (!allPayments.length) return []
    const statusCounts: Record<string, number> = {}
    allPayments.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1
    })
    return Object.entries(statusCounts).map(([status, value]) => ({
      name: status,
      value,
      color: PAYMENT_STATUS_COLORS[status as keyof typeof PAYMENT_STATUS_COLORS] || "#d1d5db",
      label: getPaymentStatusLabel(status),
    }))
  }, [allPayments])

  // Biểu đồ doanh thu
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
            key = paymentDate.format("YYYY-MM")
          } else {
            key = paymentDate.format("YYYY")
          }
          if (!filteredAndGroupedData[key]) {
            filteredAndGroupedData[key] = 0
          }
          filteredAndGroupedData[key] += p.amount
        }
      }
    })
    const fullChartData: { name: string; "Tổng tiền": number }[] = []
    let currentMoment = dayjs(dateRange[0]).startOf(chartFilterType)
    while (currentMoment.valueOf() <= dayjs(dateRange[1]).endOf(chartFilterType).valueOf()) {
      let key = ""
      let displayLabel = ""
      if (chartFilterType === "month") {
        key = currentMoment.format("YYYY-MM")
        displayLabel = currentMoment.format("MM/YYYY")
      } else {
        key = currentMoment.format("YYYY")
        displayLabel = currentMoment.format("YYYY")
      }
      fullChartData.push({
        name: displayLabel,
        "Tổng tiền": filteredAndGroupedData[key] || 0,
      })
      currentMoment = currentMoment.add(1, chartFilterType)
    }
    return fullChartData
  }, [allPayments, dateRange, chartFilterType])

  const totalRevenue = useMemo(() => {
    return revenueData.reduce((sum, item) => sum + (item["Tổng tiền"] || 0), 0)
  }, [revenueData])

  // Thống kê dịch vụ có doanh thu cao nhất
  const topRevenueServices = useMemo(() => {
    if (!allPayments.length || !allServices.length) return []
    
    const serviceRevenue: { [key: string]: number } = {}
    
    // Tính doanh thu cho từng dịch vụ
    allPayments.forEach(payment => {
      if (payment.status === "success" && payment.amount) {
        // Lấy booking từ bookingIds array (đã được populate từ backend)
        const bookings = Array.isArray(payment.bookingIds) && payment.bookingIds.length > 0 
          ? payment.bookingIds 
          : []
        
        bookings.forEach(booking => {
          if (booking && typeof booking === 'object' && booking.serviceId) {
            const serviceId = typeof booking.serviceId === 'string' 
              ? booking.serviceId 
              : booking.serviceId._id
            
            // Chia đều số tiền cho các booking (nếu có nhiều booking trong 1 payment)
            const amountPerBooking = payment.amount / bookings.length
            serviceRevenue[serviceId] = (serviceRevenue[serviceId] || 0) + amountPerBooking
          }
        })
      }
    })
    
    // Chuyển đổi thành array và sắp xếp
    return Object.entries(serviceRevenue)
      .map(([serviceId, revenue]) => {
        const service = allServices.find(s => s._id === serviceId)
        
        // Đếm số booking cho service này từ payment data
        let bookingCount = 0
        allPayments.forEach(payment => {
          if (Array.isArray(payment.bookingIds) && payment.bookingIds.length > 0) {
            payment.bookingIds.forEach(booking => {
              if (booking && typeof booking === 'object' && booking.serviceId) {
                const bookingServiceId = typeof booking.serviceId === 'string' 
                  ? booking.serviceId 
                  : booking.serviceId._id
                if (bookingServiceId === serviceId) {
                  bookingCount++
                }
              }
            })
          }
        })
        
        return {
          serviceId,
          serviceName: service?.serviceName || "Dịch vụ không xác định",
          revenue,
          bookingCount
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5) // Top 5 dịch vụ
  }, [allPayments, allServices])

  // Thống kê dịch vụ được đặt nhiều nhất
  const topBookedServices = useMemo(() => {
    if (!allPayments.length || !allServices.length) return []
    
    const serviceBookingCount: { [key: string]: number } = {}
    
    // Đếm booking cho từng dịch vụ từ payment data
    allPayments.forEach(payment => {
      if (Array.isArray(payment.bookingIds) && payment.bookingIds.length > 0) {
        payment.bookingIds.forEach(booking => {
          if (booking && typeof booking === 'object' && booking.serviceId) {
            const serviceId = typeof booking.serviceId === 'string' 
              ? booking.serviceId 
              : booking.serviceId._id
            
            serviceBookingCount[serviceId] = (serviceBookingCount[serviceId] || 0) + 1
          }
        })
      }
    })
    
    return Object.entries(serviceBookingCount)
      .map(([serviceId, count]) => {
        const service = allServices.find(s => s._id === serviceId)
        return {
          serviceId,
          serviceName: service?.serviceName || "Dịch vụ không xác định",
          bookingCount: count,
          price: service?.price || 0
        }
      })
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5) // Top 5 dịch vụ
  }, [allPayments, allServices])

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      setDateRange([dates[0], dates[1]])
    } else {
      setDateRange([null, null])
    }
  }

  function getRoleLabel(role: string) {
    switch (role) {
      case "admin": return "Quản trị viên"
      case "doctor": return "Bác sĩ"
      case "staff": return "Nhân viên"
      case "tester": return "Kĩ thuật viên"
      case "user": return "Người dùng"
      default: return role
    }
  }
  function getPaymentStatusLabel(status: string) {
    switch (status) {
      case "success": return "Thành công"
      case "pending": return "Chờ thanh toán"
      case "failed": return "Thất bại"
      case "cancelled": return "Đã huỷ"
      default: return status
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Tổng số Khách hàng */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 flex items-center gap-4">
              <UsersIcon className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng số Khách hàng</p>
                {loadingStats ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{totalPatients ?? "N/A"}</h2>
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
                  <h2 className="text-3xl font-bold text-gray-900">{totalDoctors ?? "N/A"}</h2>
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
                  <h2 className="text-3xl font-bold text-gray-900">{totalStaff ?? "N/A"}</h2>
                )}
              </div>
            </div>
          </div>
          {/* Tổng số Kĩ thuật viên */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 flex items-center gap-4">
              <UserCog className="h-10 w-10 text-orange-400" />
              <div>
                <p className="text-sm text-gray-600">Tổng số Kĩ thuật viên</p>
                {loadingStats ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{totalTesters ?? "N/A"}</h2>
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

        {/* PieCharts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* PieChart Vai trò */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900">Tỉ lệ vai trò người dùng</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={rolePieData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${getRoleLabel(name)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {rolePieData.map((entry) => (
                    <Cell key={`cell-role-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number, name: string, props: any) => [`${value}`, getRoleLabel(name)]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* PieChart Trạng thái thanh toán */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="h-6 w-6 text-green-500" />
              <h2 className="text-lg font-bold text-gray-900">Tỉ lệ trạng thái thanh toán</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={paymentStatusPieData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${getPaymentStatusLabel(name)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {paymentStatusPieData.map((entry) => (
                    <Cell key={`cell-status-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number, name: string, props: any) => [`${value}`, getPaymentStatusLabel(name)]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart Section */}
        <div className="w-full bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Biểu đồ doanh thu</h2>
          {/* Chart Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Lọc theo:</span>
            <Select
              value={chartFilterType}
              onChange={(value) => setChartFilterType(value)}
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
            <ResponsiveContainer width="100%" height={320}>
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
                  dataKey="Tổng tiền"
                  stroke="#6366f1"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                  name="Tổng tiền"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Service Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-12">
          {/* Top Revenue Services */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 dịch vụ có doanh thu cao nhất</h2>
            {(() => {
              if (loadingStats) {
                return (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                );
              } else if (topRevenueServices.length > 0) {
                return (
                  <div className="space-y-4">
                    {topRevenueServices.map((service, index) => (
                      <div key={service.serviceId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{service.serviceName}</p>
                            <p className="text-sm text-gray-500">{service.bookingCount} lượt đặt</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{service.revenue.toLocaleString("vi-VN")} VNĐ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                return <div className="text-center text-gray-500 py-8">Chưa có dữ liệu doanh thu</div>;
              }
            })()}
          </div>

          {/* Top Booked Services */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 dịch vụ được đặt nhiều nhất</h2>
            {(() => {
              if (loadingStats) {
                return (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                );
              } else if (topBookedServices.length > 0) {
                return (
                  <div className="space-y-4">
                    {topBookedServices.map((service, index) => (
                      <div key={service.serviceId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{service.serviceName}</p>
                            <p className="text-sm text-gray-500">{service.price.toLocaleString("vi-VN")} VNĐ/lượt</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{service.bookingCount} lượt</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                return <div className="text-center text-gray-500 py-8">Chưa có dữ liệu đặt lịch</div>;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
