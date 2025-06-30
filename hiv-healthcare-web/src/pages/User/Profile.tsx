import type React from "react"
import { useEffect, useState } from "react"
import { UserIcon, Phone, Mail, MapPin, FileText, Edit3, Save, X } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import type { User, Gender } from "../../types/user"

// Toast configuration
const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as const,
}

const showToast = (message: string, type: "error" | "success" = "error") => {
  if (!toast.isActive(message)) {
    const config = { ...TOAST_CONFIG, toastId: message }
    if (type === "success") {
      toast.success(message, config)
    } else {
      toast.error(message, config)
    }
  }
}

const UserProfile: React.FC = () => {
  const { user, getUserById, updateUser, logout, loading } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    phone_number: "",
    gender: "",
    address: "",
    userDescription: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (loading || !user?._id) {
        return
      }

      try {
        console.log("Lấy dữ liệu người dùng với ID:", user._id)
        const detailedUser: User = await getUserById(user._id)
        setUserData(detailedUser)
        setFormData({
          userName: detailedUser.userName || "",
          phone_number: detailedUser.phone_number || "",
          gender: detailedUser.gender || "",
          address: detailedUser.address || "",
          userDescription: detailedUser.userDescription || "",
        })
        setError(null)
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error.message)
        let errorMessage = "Không thể tải thông tin người dùng!"
        if (error.message?.toLowerCase().includes("authenticate")) {
          errorMessage = "Phiên đăng nhập hết hạn!"
          logout()
        }
        setError(errorMessage)
        showToast(errorMessage)
      }
    }

    fetchUserData()
  }, [user?._id, getUserById, logout, loading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.userName.trim()) {
      return "Vui lòng nhập tên người dùng!"
    }
    if (formData.gender && !["male", "female", "other"].includes(formData.gender)) {
      return "Giới tính phải là 'male', 'female', hoặc 'other'!"
    }
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      return "Số điện thoại phải là 10 chữ số!"
    }
    return null
  }

  const handleUpdate = async () => {
    if (!user?._id) {
      const errorMessage = "Vui lòng đăng nhập để cập nhật!"
      setError(errorMessage)
      showToast(errorMessage)
      return
    }

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      showToast(validationError)
      return
    }

    try {
      const updatePayload = {
        userName: formData.userName.trim(),
        phone_number: formData.phone_number || undefined,
        gender: (formData.gender as Gender) || undefined,
        address: formData.address || undefined,
        userDescription: formData.userDescription || undefined,
      }

      console.log("Payload gửi đi:", updatePayload)
      await updateUser(user._id, updatePayload)
      const refreshedUser: User = await getUserById(user._id)
      console.log("Dữ liệu người dùng sau cập nhật:", refreshedUser)

      setUserData(refreshedUser)
      setIsEditing(false)
      setError(null)
      showToast("Cập nhật thông tin thành công!", "success")
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error.message)
      const errorMessage = error.message || "Cập nhật thông tin thất bại!"
      setError(errorMessage)
      showToast(errorMessage)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
    setFormData({
      userName: userData?.userName || "",
      phone_number: userData?.phone_number || "",
      gender: userData?.gender || "",
      address: userData?.address || "",
      userDescription: userData?.userDescription || "",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải thông tin xác thực...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin cá nhân</p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    )
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {error.includes("đăng nhập") && (
            <button
              onClick={() => (window.location.href = "/auth/login")}
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
            >
              Đăng nhập lại
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h1>
          </div>
          <p className="text-gray-600">Quản lý và cập nhật thông tin cá nhân của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{userData.userName || "Chưa cập nhật"}</h2>
                <p className="text-blue-100">{userData.email || "Chưa cập nhật"}</p>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Hủy</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tên người dùng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                      isEditing
                        ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                    placeholder="Nhập tên người dùng"
                    required
                  />
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Giới tính</label>
                <div className="relative">
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                      isEditing
                        ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                    placeholder="male, female, hoặc other"
                  />
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Số điện thoại</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                      isEditing
                        ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                    placeholder="Nhập số điện thoại"
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={userData.email || "Chưa cập nhật"}
                    readOnly
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-4 px-4 pl-12 text-lg text-gray-600"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Địa chỉ</label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 ${
                      isEditing
                        ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                    placeholder="Nhập địa chỉ"
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Mô tả cá nhân</label>
                <div className="relative">
                  <textarea
                    name="userDescription"
                    value={formData.userDescription}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    rows={4}
                    className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg transition-all duration-200 resize-none ${
                      isEditing
                        ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                    placeholder="Nhập mô tả về bản thân"
                  />
                  <FileText className="absolute left-4 top-6 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default UserProfile
