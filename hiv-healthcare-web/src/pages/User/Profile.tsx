import type React from "react";
import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, FileText, Edit3, Save, X, Calendar, Camera, User, Shield, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import { uploadAvatar } from "../../api/authApi";
import type { User as UserType, Gender, Certification, Experience } from "../../types/user";

const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored" as const,
};

const showToast = (message: string, type: "error" | "success" = "error") => {
  if (!toast.isActive(message)) {
    toast[type](message, { ...TOAST_CONFIG, toastId: message });
  }
};

const UserProfile: React.FC = () => {
  const { user, getUserById, updateUser, logout, loading } = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState<{
  userName: string;
  phone_number: string;
  gender: "" | Gender; // <-- FIX HERE
  address: string;
  dateOfBirth: string;
  userDescription: string;
  avatar: string;
  dayOfWeek: string[];
  startTimeInDay: string;
  endTimeInDay: string;
  startDay: string;
  endDay: string;
  certifications: Certification[];
  experiences: Experience[];
}>({
  userName: "",
  phone_number: "",
  gender: "", // <-- default empty
  address: "",
  dateOfBirth: "",
  userDescription: "",
  avatar: "",
  dayOfWeek: [],
  startTimeInDay: "",
  endTimeInDay: "",
  startDay: "",
  endDay: "",
  certifications: [],
  experiences: [],
});

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (loading || !user?._id) return;
      try {
        const detailedUser = await getUserById(user._id);
        setUserData(detailedUser);
        setFormData({
          userName: detailedUser.userName || "",
          phone_number: detailedUser.phone_number || "",
          gender: detailedUser.gender || "",
          address: detailedUser.address || "",
          dateOfBirth: detailedUser.dateOfBirth || "",
          userDescription: detailedUser.userDescription || "",
          avatar: detailedUser.avatar || "",
          dayOfWeek: detailedUser.dayOfWeek || [],
          startTimeInDay: detailedUser.startTimeInDay || "",
          endTimeInDay: detailedUser.endTimeInDay || "",
          startDay: detailedUser.startDay || "",
          endDay: detailedUser.endDay || "",
          certifications: detailedUser.certifications || [],
          experiences: detailedUser.experiences || [],
        });
      } catch (err: any) {
        const msg = err.message?.toLowerCase().includes("authenticate")
          ? "Phiên đăng nhập hết hạn!"
          : "Không thể tải thông tin người dùng!";
        if (msg.includes("hết hạn")) logout();
        showToast(msg);
        setError(msg);
      }
    };
    fetchUserData();
  }, [user?._id]);

const handleUpdate = async () => {
  if (!user?._id || !userData) return;

  try {
    // Prepare payload
    const payload: Partial<UserType> = {
      userName: formData.userName,
      phone_number: formData.phone_number,
      gender: formData.gender,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      userDescription: formData.userDescription,
      dayOfWeek: formData.dayOfWeek,
      startTimeInDay: formData.startTimeInDay,
      endTimeInDay: formData.endTimeInDay,
      startDay: formData.startDay,
      endDay: formData.endDay,
      certifications: formData.certifications,
      experiences: formData.experiences,
    };

    // Gọi API update user info
    await updateUser(user._id, payload);

    // Check avatar changes
    const isAvatarFileChanged = !!avatarFile;
    const isAvatarUrlChanged =
      !avatarFile &&
      formData.avatar &&
      formData.avatar !== userData.avatar &&
      formData.avatar.startsWith("http");

    if (isAvatarFileChanged) {
      const formDataFile = new FormData();
      formDataFile.append("avatar", avatarFile);
      await uploadAvatar(user._id, formDataFile);
    } else if (isAvatarUrlChanged) {
      await uploadAvatar(user._id, { avatarUrl: formData.avatar });
    }

    // Refresh UI
    const refreshedUser = await getUserById(user._id);
    setUserData(refreshedUser);
    setIsEditing(false);
    setAvatarFile(null);
    showToast("Cập nhật thành công!", "success");
  } catch (err: any) {
    showToast(err.message || "Cập nhật thất bại!");
  }
};


  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayOfWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, dayOfWeek: selectedOptions }));
  };

  const handleCancel = () => {
    if (!userData) return;
    setFormData({
      userName: userData.userName || "",
      phone_number: userData.phone_number || "",
      gender: userData.gender || "",
      address: userData.address || "",
      dateOfBirth: userData.dateOfBirth || "",
      userDescription: userData.userDescription || "",
      avatar: userData.avatar || "",
      dayOfWeek: userData.dayOfWeek || [],
      startTimeInDay: userData.startTimeInDay || "",
      endTimeInDay: userData.endTimeInDay || "",
      startDay: userData.startDay || "",
      endDay: userData.endDay || "",
      certifications: userData.certifications || [],
      experiences: userData.experiences || [],
    });
    setIsEditing(false);
    setAvatarFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Thông Tin Cá Nhân</h1>
          </div>
          <p className="text-gray-600">Quản lý và cập nhật thông tin cá nhân của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Left Panel - Avatar & Basic Info */}
          <div className="lg:col-span-1 h-full flex flex-col">
            <div className="bg-white rounded-2xl shadow border p-6 text-center h-[440px]">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-teal-50 mx-auto">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar || "/placeholder.svg?height=128&width=128"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-teal-600" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:from-teal-700 hover:to-blue-700 transition-all">
                    <Camera className="h-5 w-5 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{userData?.userName || "Chưa cập nhật"}</h2>
              <p className="text-gray-600 mb-6">{userData?.email || "Chưa cập nhật"}</p>

              {isEditing && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nhập URL ảnh đại diện"
                    value={formData.avatar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
              )}

              <div className="flex justify-center gap-3 mt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all"
                    >
                      <Save className="h-4 w-4" />
                      Lưu
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow border p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Bảo Mật Tài Khoản</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trạng thái tài khoản</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Hoạt động
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Xác thực email</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Đã xác thực
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Detailed Information */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-2xl shadow border">
              {/* Personal Information Section */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Info className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Thông Tin Cá Nhân</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Họ và tên"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<User className="h-5 w-5" />}
                    placeholder="Nhập họ và tên"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full rounded-xl border-2 py-3 px-4 pl-12 ${
                          !isEditing
                            ? "bg-gray-50 text-gray-600 border-gray-200"
                            : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        }`}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <Input
                    label="Số điện thoại"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<Phone className="h-5 w-5" />}
                    placeholder="Nhập số điện thoại"
                  />

                  <Input
                    label="Email"
                    name="email"
                    value={userData?.email || ""}
                    disabled={true}
                    icon={<Mail className="h-5 w-5" />}
                    placeholder="Email không thể thay đổi"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <div className="relative">
                      <ReactDatePicker
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                          }))
                        }
                        dateFormat="dd/MM/yyyy"
                        disabled={!isEditing}
                        placeholderText="Chọn ngày sinh"
                        className={`w-full rounded-xl border-2 py-3 px-4 pl-12 ${
                          !isEditing
                            ? "bg-gray-50 text-gray-600 border-gray-200"
                            : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        }`}
                      />
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <Input
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<MapPin className="h-5 w-5" />}
                    placeholder="Nhập địa chỉ"
                  />

                  {userData?.role === "doctor" && (
                    <>
                      <div className="space-y-2 col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Ngày làm việc</label>
                        <div className="relative">
                          <select
                            name="dayOfWeek"
                            value={formData.dayOfWeek}
                            onChange={handleDayOfWeekChange}
                            multiple
                            disabled={!isEditing}
                            className={`w-full rounded-xl border-2 py-3 px-4 pl-12 ${
                              !isEditing
                                ? "bg-gray-50 text-gray-600 border-gray-200"
                                : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            }`}
                          >
                            <option value="Monday">Thứ Hai</option>
                            <option value="Tuesday">Thứ Ba</option>
                            <option value="Wednesday">Thứ Tư</option>
                            <option value="Thursday">Thứ Năm</option>
                            <option value="Friday">Thứ Sáu</option>
                            <option value="Saturday">Thứ Bảy</option>
                            <option value="Sunday">Chủ Nhật</option>
                          </select>
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <Input
                        label="Thời gian bắt đầu"
                        name="startTimeInDay"
                        value={formData.startTimeInDay}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        icon={<Calendar className="h-5 w-5" />}
                        placeholder="VD: 08:00"
                      />

                      <Input
                        label="Thời gian kết thúc"
                        name="endTimeInDay"
                        value={formData.endTimeInDay}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        icon={<Calendar className="h-5 w-5" />}
                        placeholder="VD: 16:00"
                      />

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu làm việc</label>
                        <div className="relative">
                          <ReactDatePicker
                            selected={formData.startDay ? new Date(formData.startDay) : null}
                            onChange={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                startDay: date ? date.toISOString().split("T")[0] : "",
                              }))
                            }
                            dateFormat="dd/MM/yyyy"
                            disabled={!isEditing}
                            placeholderText="Chọn ngày bắt đầu"
                            className={`w-full rounded-xl border-2 py-3 px-4 pl-12 ${
                              !isEditing
                                ? "bg-gray-50 text-gray-600 border-gray-200"
                                : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            }`}
                          />
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Ngày kết thúc làm việc</label>
                        <div className="relative">
                          <ReactDatePicker
                            selected={formData.endDay ? new Date(formData.endDay) : null}
                            onChange={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                endDay: date ? date.toISOString().split("T")[0] : "",
                              }))
                            }
                            dateFormat="dd/MM/yyyy"
                            disabled={!isEditing}
                            placeholderText="Chọn ngày kết thúc"
                            className={`w-full rounded-xl border-2 py-3 px-4 pl-12 ${
                              !isEditing
                                ? "bg-gray-50 text-gray-600 border-gray-200"
                                : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            }`}
                          />
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Mô Tả Cá Nhân</h3>
                </div>

                <div className="relative">
                  <textarea
                    name="userDescription"
                    value={formData.userDescription}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    rows={4}
                    placeholder="Viết một vài dòng về bản thân bạn..."
                    className={`w-full rounded-xl border-2 py-3 px-4 pl-12 resize-none ${
                      !isEditing
                        ? "bg-gray-50 text-gray-600 border-gray-200"
                        : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />
                  <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;

const Input = ({
  label,
  name,
  value,
  onChange,
  disabled,
  icon,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  icon: React.ReactNode;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={disabled}
        placeholder={placeholder}
        className={`w-full rounded-xl border-2 py-3 px-4 pl-12 ${
          disabled
            ? "bg-gray-50 text-gray-600 border-gray-200"
            : "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        }`}
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
    </div>
  </div>
);