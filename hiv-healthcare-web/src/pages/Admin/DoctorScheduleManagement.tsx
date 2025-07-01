import type React from "react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Calendar,
  Clock,
  Settings,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  CalendarDays,
  Stethoscope,
  Mail,
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import type { User as UserType } from "../../types/user"

const DoctorScheduleManagement: React.FC = () => {
  const { getAllUsers, getWorkSchedule, updateWorkSchedule, clearWorkSchedule, isAdmin } = useAuth()
  const [doctors, setDoctors] = useState<UserType[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<{ [key: string]: Partial<UserType> | null }>({})
  const [newSchedule, setNewSchedule] = useState<Partial<UserType>>({
    dayOfWeek: [],
    startTimeInDay: "08:00",
    endTimeInDay: "17:00",
    startDay: "",
    endDay: "",
  })
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  const daysOfWeek = [
    { value: "Monday", label: "Thứ 2", short: "T2" },
    { value: "Tuesday", label: "Thứ 3", short: "T3" },
    { value: "Wednesday", label: "Thứ 4", short: "T4" },
    { value: "Thursday", label: "Thứ 5", short: "T5" },
    { value: "Friday", label: "Thứ 6", short: "T6" },
    { value: "Saturday", label: "Thứ 7", short: "T7" },
    { value: "Sunday", label: "Chủ nhật", short: "CN" },
  ]

  useEffect(() => {
    const fetchDoctorsAndSchedules = async () => {
      if (!isAdmin) {
        toast.error("Bạn không có quyền truy cập trang này!", { position: "top-right", autoClose: 3000 })
        return
      }

      try {
        setLoading(true)
        const users = await getAllUsers()
        const doctorUsers = users.filter((user: UserType) => user.role === "doctor")
        setDoctors(doctorUsers)

        const schedulesData: { [key: string]: Partial<UserType> | null } = {}
        for (const doctor of doctorUsers) {
          try {
            const schedule = await getWorkSchedule(doctor._id)
            schedulesData[doctor._id] = schedule || null
          } catch (error) {
            schedulesData[doctor._id] = null
          }
        }
        setSchedules(schedulesData)
      } catch (error: any) {
        toast.error(error.message || "Không thể tải danh sách bác sĩ.", { position: "top-right", autoClose: 3000 })
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorsAndSchedules()
  }, [getAllUsers, getWorkSchedule, isAdmin])

  const handleDayToggle = (day: string) => {
    setNewSchedule((prev) => {
      const days = prev.dayOfWeek || []
      if (days.includes(day)) {
        return { ...prev, dayOfWeek: days.filter((d) => d !== day) }
      }
      return { ...prev, dayOfWeek: [...days, day] }
    })
  }

  const handleEditSchedule = (doctor: UserType) => {
    setSelectedDoctorId(doctor._id)
    setNewSchedule({
      dayOfWeek: schedules[doctor._id]?.dayOfWeek || [],
      startTimeInDay: schedules[doctor._id]?.startTimeInDay || "08:00",
      endTimeInDay: schedules[doctor._id]?.endTimeInDay || "17:00",
      startDay: schedules[doctor._id]?.startDay || "",
      endDay: schedules[doctor._id]?.endDay || "",
    })
    setShowEditModal(true)
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctorId) {
      toast.error("Vui lòng chọn bác sĩ!", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!newSchedule.dayOfWeek || newSchedule.dayOfWeek.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ngày!", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!newSchedule.startDay || !newSchedule.endDay) {
      toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc!", { position: "top-right", autoClose: 3000 })
      return
    }

    try {
      const scheduleData = {
        dayOfWeek: newSchedule.dayOfWeek,
        startTimeInDay: newSchedule.startTimeInDay,
        endTimeInDay: newSchedule.endTimeInDay,
        startDay: newSchedule.startDay,
        endDay: newSchedule.endDay,
      }

      await updateWorkSchedule(selectedDoctorId, scheduleData)
      const updatedSchedule = await getWorkSchedule(selectedDoctorId)
      setSchedules((prev) => ({ ...prev, [selectedDoctorId]: updatedSchedule }))
      setShowEditModal(false)
      toast.success("Cập nhật lịch làm việc thành công!", { position: "top-right", autoClose: 3000 })
    } catch (error: any) {
      toast.error(error.message || "Cập nhật lịch làm việc thất bại.", { position: "top-right", autoClose: 3000 })
    }
  }

  const handleClearSchedule = async (doctorId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch làm việc này?")) return

    try {
      await clearWorkSchedule(doctorId)
      setSchedules((prev) => ({ ...prev, [doctorId]: null }))
      toast.success("Xóa lịch làm việc thành công!", { position: "top-right", autoClose: 3000 })
    } catch (error: any) {
      toast.error(error.message || "Xóa lịch làm việc thất bại.", { position: "top-right", autoClose: 3000 })
    }
  }

  const hasSchedule = (doctorId: string) => {
    return schedules[doctorId] && schedules[doctorId]?.dayOfWeek && schedules[doctorId]?.dayOfWeek!.length > 0
  }

  const getScheduleStatus = (doctorId: string) => {
    if (hasSchedule(doctorId)) {
      return { status: "active", text: "Đã thiết lập", color: "text-green-600", bgColor: "bg-green-100" }
    }
    return { status: "inactive", text: "Chưa thiết lập", color: "text-amber-600", bgColor: "bg-amber-100" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh sách bác sĩ...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Không có quyền truy cập</h2>
          <p className="text-red-600">Bạn không có quyền truy cập trang này!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý lịch làm việc</h1>
          </div>
          <p className="text-gray-600">Thiết lập và quản lý lịch làm việc cho các bác sĩ trong hệ thống</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Tổng số bác sĩ</p>
                <p className="text-3xl font-bold text-gray-800">{doctors.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Đã thiết lập lịch</p>
                <p className="text-3xl font-bold text-gray-800">
                  {doctors.filter((doctor) => hasSchedule(doctor._id)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Chưa thiết lập</p>
                <p className="text-3xl font-bold text-gray-800">
                  {doctors.filter((doctor) => !hasSchedule(doctor._id)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Danh sách bác sĩ</h2>
                <p className="text-gray-600">Quản lý lịch làm việc cho từng bác sĩ</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {doctors.length === 0 ? (
              <div className="text-center py-12">
                <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có bác sĩ nào</h3>
                <p className="text-gray-500">Chưa có bác sĩ nào trong hệ thống</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => {
                  const scheduleStatus = getScheduleStatus(doctor._id)
                  const schedule = schedules[doctor._id]

                  return (
                    <div
                      key={doctor._id}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      {/* Doctor Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center">
                          {doctor.avatar ? (
                            <img
                              src={doctor.avatar || "/placeholder.svg"}
                              alt={doctor.userName}
                              className="w-full h-full rounded-2xl object-cover"
                            />
                          ) : (
                            <Stethoscope className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{doctor.userName}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{doctor.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Status */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Trạng thái lịch làm việc</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${scheduleStatus.bgColor} ${scheduleStatus.color}`}
                          >
                            {scheduleStatus.text}
                          </span>
                        </div>

                        {hasSchedule(doctor._id) && schedule && (
                          <div className="bg-white rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarDays className="h-4 w-4 text-teal-600" />
                              <span className="font-medium">Ngày làm việc:</span>
                              <span className="text-gray-600">
                                {schedule.dayOfWeek
                                  ?.map((day) => {
                                    const dayInfo = daysOfWeek.find((d) => d.value === day || d.label === day)
                                    return dayInfo?.short || day
                                  })
                                  .join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Giờ làm việc:</span>
                              <span className="text-gray-600">
                                {schedule.startTimeInDay} - {schedule.endTimeInDay}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">Thời gian:</span>
                              <span className="text-gray-600">
                                {schedule.startDay ? new Date(schedule.startDay).toLocaleDateString("vi-VN") : "N/A"} -{" "}
                                {schedule.endDay ? new Date(schedule.endDay).toLocaleDateString("vi-VN") : "N/A"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSchedule(doctor)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors duration-200 font-medium"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>{hasSchedule(doctor._id) ? "Chỉnh sửa" : "Thiết lập"}</span>
                        </button>
                        {hasSchedule(doctor._id) && (
                          <button
                            onClick={() => handleClearSchedule(doctor._id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Edit Schedule Modal */}
        {showEditModal && selectedDoctorId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Thiết lập lịch làm việc</h2>
                    <p className="text-gray-600">Bác sĩ: {doctors.find((d) => d._id === selectedDoctorId)?.userName}</p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleScheduleSubmit} className="space-y-6">
                  {/* Days of Week */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Chọn ngày làm việc <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {daysOfWeek.map((day) => (
                        <label
                          key={day.value}
                          className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            newSchedule.dayOfWeek?.includes(day.value) || newSchedule.dayOfWeek?.includes(day.label)
                              ? "border-teal-500 bg-teal-50 text-teal-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              newSchedule.dayOfWeek?.includes(day.value) ||
                              newSchedule.dayOfWeek?.includes(day.label) ||
                              false
                            }
                            onChange={() => handleDayToggle(day.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-semibold">{day.short}</div>
                            <div className="text-xs">{day.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Giờ bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={newSchedule.startTimeInDay || "08:00"}
                          onChange={(e) => setNewSchedule((prev) => ({ ...prev, startTimeInDay: e.target.value }))}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-12 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                        />
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Giờ kết thúc <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={newSchedule.endTimeInDay || "17:00"}
                          onChange={(e) => setNewSchedule((prev) => ({ ...prev, endTimeInDay: e.target.value }))}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-12 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                        />
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={newSchedule.startDay || ""}
                          onChange={(e) => setNewSchedule((prev) => ({ ...prev, startDay: e.target.value }))}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-12 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                        />
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={newSchedule.endDay || ""}
                          onChange={(e) => setNewSchedule((prev) => ({ ...prev, endDay: e.target.value }))}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-12 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                        />
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
                    >
                      <Save className="h-5 w-5" />
                      <span>Lưu lịch làm việc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  )
}

export default DoctorScheduleManagement
