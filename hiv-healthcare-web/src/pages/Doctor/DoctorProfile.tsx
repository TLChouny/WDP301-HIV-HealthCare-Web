import type React from "react";
import { useEffect, useState } from "react";
import {
  UserIcon,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit3,
  Save,
  X,
  Calendar,
  Award,
  Briefcase,
  Plus,
  Trash2,
  Building,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import type { User, Gender, Certification, Experience } from "../../types/user";
import ReactDatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

// Hàm định dạng ngày tháng để bỏ phần T00:00:00.000Z
const formatDate = (dateString: string) => {
  if (!dateString) return "Chưa xác định";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
};

const showToast = (message: string, type: "error" | "success" = "error") => {
  if (!toast.isActive(message)) {
    const config = { ...TOAST_CONFIG, toastId: message };
    type === "success" ? toast.success(message, config) : toast.error(message, config);
  }
};

const DoctorProfile: React.FC = () => {
  const { user, getUserById, updateUser, logout, loading, addCertification, deleteCertification, updateCertification, addExperience, updateExperience, deleteExperience } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    avatar: "",
    userName: "",
    phone_number: "",
    gender: "",
    address: "",
    dateOfBirth: "",
    userDescription: "",
  });
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Add state
  const [showCertForm, setShowCertForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [newCertification, setNewCertification] = useState<Certification>({
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    description: "",
    fileUrl: "",
    status: "pending",
  });
  const [newExperience, setNewExperience] = useState<Experience>({
    hospital: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "pending",
  });

  // Edit state
  const [editCertId, setEditCertId] = useState<string | null>(null);
  const [editCertification, setEditCertification] = useState<Certification | null>(null);
  const [editExpId, setEditExpId] = useState<string | null>(null);
  const [editExperience, setEditExperience] = useState<Experience | null>(null);

  // Handler input change for certification/experience
  const handleNewCertificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCertification((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCertificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditCertification((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEditExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditExperience((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Accept select changes for gender
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Certification
  const handleAddCertification = async () => {
    if (!newCertification.title || !newCertification.issuer || !newCertification.issueDate) {
      showToast("Vui lòng nhập đủ thông tin chứng chỉ (tên, tổ chức cấp, ngày cấp)!");
      return;
    }
    if (!user?._id) {
      showToast("Không tìm thấy user!", "error");
      return;
    }
    try {
      await addCertification(user._id, newCertification);
      const refreshedUser: User = await getUserById(user._id);
      setCertifications(refreshedUser.certifications || []);
      setNewCertification({ title: "", issuer: "", issueDate: "", expiryDate: "", description: "", fileUrl: "", status: "pending" });
      setShowCertForm(false);
      showToast("Thêm chứng chỉ thành công!", "success");
    } catch (error: any) {
      showToast(error.message || "Thêm chứng chỉ thất bại!");
    }
  };

  // Update Certification
  const handleUpdateCertification = async () => {
    if (!editCertification || !editCertId || !user?._id) {
      showToast("Không tìm thấy chứng chỉ hoặc user!", "error");
      return;
    }
    if (!editCertification.title || !editCertification.issuer || !editCertification.issueDate) {
      showToast("Vui lòng nhập đủ thông tin chứng chỉ (tên, tổ chức cấp, ngày cấp)!");
      return;
    }
    try {
      await updateCertification(user._id, editCertId, editCertification);
      const refreshedUser: User = await getUserById(user._id);
      setCertifications(refreshedUser.certifications || []);
      setEditCertId(null);
      setEditCertification(null);
      showToast("Cập nhật chứng chỉ thành công!", "success");
    } catch (error: any) {
      if (error.message?.includes("Only pending certifications can be updated")) {
        showToast("Chỉ có thể chỉnh sửa chứng chỉ khi đang chờ duyệt!", "error");
      } else {
        showToast(error.message || "Cập nhật chứng chỉ thất bại!");
      }
    }
  };

  // Delete Certification
  const handleDeleteCertification = async (certId: string) => {
    if (!user?._id) {
      showToast("Không tìm thấy user!", "error");
      return;
    }
    try {
      await deleteCertification(user._id, certId);
      const refreshedUser: User = await getUserById(user._id);
      setCertifications(refreshedUser.certifications || []);
      showToast("Xoá chứng chỉ thành công!", "success");
    } catch (error: any) {
      showToast(error.message || "Xoá chứng chỉ thất bại!");
    }
  };

  // Add Experience
  const handleAddExperience = async () => {
    if (!newExperience.hospital || !newExperience.position || !newExperience.startDate) {
      showToast("Vui lòng nhập đủ thông tin kinh nghiệm (bệnh viện, chức vụ, ngày bắt đầu)!");
      return;
    }
    if (!user?._id) {
      showToast("Không tìm thấy user!", "error");
      return;
    }
    try {
      await addExperience(user._id, newExperience);
      const refreshedUser: User = await getUserById(user._id);
      setExperiences(refreshedUser.experiences || []);
      setNewExperience({ hospital: "", position: "", startDate: "", endDate: "", description: "", status: "pending" });
      setShowExpForm(false);
      showToast("Thêm kinh nghiệm thành công!", "success");
    } catch (error: any) {
      showToast(error.message || "Thêm kinh nghiệm thất bại!");
    }
  };

  // Update Experience
  const handleUpdateExperience = async () => {
    if (!editExperience || !editExpId || !user?._id) {
      showToast("Không tìm thấy kinh nghiệm hoặc user!", "error");
      return;
    }
    if (!editExperience.hospital || !editExperience.position || !editExperience.startDate) {
      showToast("Vui lòng nhập đủ thông tin kinh nghiệm (bệnh viện, chức vụ, ngày bắt đầu)!");
      return;
    }
    try {
      await updateExperience(user._id, editExpId, editExperience);
      const refreshedUser: User = await getUserById(user._id);
      setExperiences(refreshedUser.experiences || []);
      setEditExpId(null);
      setEditExperience(null);
      showToast("Cập nhật kinh nghiệm thành công!", "success");
    } catch (error: any) {
      showToast(error.message || "Cập nhật kinh nghiệm thất bại!");
    }
  };

  // Delete Experience
  const handleDeleteExperience = async (expId: string) => {
    if (!user?._id) {
      showToast("Không tìm thấy user!", "error");
      return;
    }
    try {
      await deleteExperience(user._id, expId);
      const refreshedUser: User = await getUserById(user._id);
      setExperiences(refreshedUser.experiences || []);
      showToast("Xoá kinh nghiệm thành công!", "success");
    } catch (error: any) {
      showToast(error.message || "Xoá kinh nghiệm thất bại!");
    }
  };

  // Start editing certification
  const startEditCertification = (cert: Certification) => {
    if (!cert._id) {
      showToast("Chứng chỉ không có ID hợp lệ!", "error");
      return;
    }
    setEditCertId(cert._id);
    setEditCertification({ ...cert });
    setShowCertForm(false);
  };

  // Start editing experience
  const startEditExperience = (exp: Experience) => {
    if (!exp._id) {
      showToast("Kinh nghiệm không có ID hợp lệ!", "error");
      return;
    }
    setEditExpId(exp._id);
    setEditExperience({ ...exp });
    setShowExpForm(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (loading || !user?._id) return;
      try {
        const detailedUser: User = await getUserById(user._id);
        console.log("User data:", detailedUser);
        setUserData(detailedUser);
        setFormData({
          avatar: detailedUser.avatar || "",
          userName: detailedUser.userName || "",
          phone_number: detailedUser.phone_number || "",
          gender: detailedUser.gender || "",
          address: detailedUser.address || "",
          dateOfBirth: detailedUser.dateOfBirth || "",
          userDescription: detailedUser.userDescription || "",
        });
        setCertifications(detailedUser.certifications || []);
        setExperiences(detailedUser.experiences || []);
        setError(null);
      } catch (error: any) {
        const msg = error.message?.toLowerCase().includes("authenticate")
          ? "Phiên đăng nhập hết hạn!"
          : "Không thể tải thông tin người dùng!";
        if (msg === "Phiên đăng nhập hết hạn!") logout();
        setError(msg);
        showToast(msg);
      }
    };
    fetchUserData();
  }, [user?._id, getUserById, logout, loading]);

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const validateForm = () => {
    if (!formData.userName.trim()) return "Vui lòng nhập tên người dùng!";
    if (formData.gender && !["male", "female", "other"].includes(formData.gender))
      return "Giới tính phải là 'male', 'female', hoặc 'other'!";
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) return "Số điện thoại phải là 10 chữ số!";
    return null;
  };

  const handleUpdate = async () => {
    if (!user?._id) {
      const msg = "Vui lòng đăng nhập để cập nhật!";
      setError(msg);
      showToast(msg);
      return;
    }
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      showToast(validationError);
      return;
    }
    try {
      const updatePayload = {
        avatar: formData.avatar || undefined,
        userName: formData.userName.trim(),
        phone_number: formData.phone_number || undefined,
        gender: (formData.gender as Gender) || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        userDescription: formData.userDescription || undefined,
      };
      await updateUser(user._id, updatePayload);
      const refreshedUser: User = await getUserById(user._id);
      setUserData(refreshedUser);
      setIsEditing(false);
      setError(null);
      showToast("Cập nhật thông tin thành công!", "success");
    } catch (error: any) {
      const msg = error.message || "Cập nhật thông tin thất bại!";
      setError(msg);
      showToast(msg);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCertForm(false);
    setShowExpForm(false);
    setEditCertId(null);
    setEditCertification(null);
    setEditExpId(null);
    setEditExperience(null);
    setError(null);
    if (!userData) return;
    setFormData({
      avatar: userData.avatar || "",
      userName: userData.userName || "",
      phone_number: userData.phone_number || "",
      gender: userData.gender || "",
      address: userData.address || "",
      dateOfBirth: userData.dateOfBirth || "",
      userDescription: userData.userDescription || "",
    });
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Thông tin bác sĩ</h1>
          </div>
          <p className="text-gray-600">Quản lý và cập nhật thông tin cá nhân của bác sĩ</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6 flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.userName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow"
                />
              ) : (
                <UserIcon className="h-10 w-10 text-white" />
              )}
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
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl"
                  >
                    <Save className="h-4 w-4" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl"
                >
                  <Edit3 className="h-4 w-4" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Avatar */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Ảnh đại diện (URL)</label>
              <div className="relative">
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg ${isEditing ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  placeholder="Nhập url ảnh đại diện"
                />
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {formData.avatar && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={formData.avatar}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-2xl object-cover border-2 border-teal-500 shadow"
                  />
                  <span className="text-gray-500 text-sm">Xem trước ảnh đại diện</span>
                </div>
              )}
            </div>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên bác sĩ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg ${isEditing ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  placeholder="Nhập tên bác sĩ"
                  required
                />
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Giới tính</label>
              <div className="relative">
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : formData.gender === 'other' ? 'Khác' : ''}
                    readOnly
                    className="w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg bg-gray-50 border-gray-200 text-gray-600"
                  />
                )}
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
                  className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg ${isEditing ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100" : "bg-gray-50 border-gray-200 text-gray-600"}`}
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
                  className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg ${isEditing ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  placeholder="Nhập địa chỉ"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Ngày sinh</label>
              <div className="relative">
                <ReactDatePicker
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày sinh"
                  disabled={!isEditing}
                  className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg ${isEditing ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  className={`w-full rounded-xl border-2 py-4 px-4 pl-12 text-lg resize-none ${isEditing ? "border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  placeholder="Nhập mô tả về bản thân"
                />
                <FileText className="absolute left-4 top-6 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Chứng chỉ</h3>
                </div>
                {isEditing && !showCertForm && !editCertId && (
                  <button
                    onClick={() => setShowCertForm(true)}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm chứng chỉ
                  </button>
                )}
              </div>

              {/* Certification Form (Add) */}
              {isEditing && showCertForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Thêm chứng chỉ mới</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Tên chứng chỉ</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="title"
                          value={newCertification.title}
                          onChange={handleNewCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Nhập tên chứng chỉ"
                        />
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Cấp bởi</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="issuer"
                          value={newCertification.issuer}
                          onChange={handleNewCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Tên tổ chức cấp"
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày cấp</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="issueDate"
                          value={newCertification.issueDate}
                          onChange={handleNewCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày hết hạn</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="expiryDate"
                          value={newCertification.expiryDate}
                          onChange={handleNewCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                      <textarea
                        name="description"
                        value={newCertification.description}
                        onChange={handleNewCertificationChange}
                        rows={3}
                        className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100 resize-none"
                        placeholder="Mô tả ngắn về chứng chỉ"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">URL tài liệu</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="fileUrl"
                          value={newCertification.fileUrl}
                          onChange={handleNewCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="URL tài liệu chứng chỉ "
                        />
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowCertForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddCertification}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      Lưu chứng chỉ
                    </button>
                  </div>
                </div>
              )}

              {/* Certification Form (Edit) */}
              {isEditing && editCertId && editCertification && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Chỉnh sửa chứng chỉ</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Tên chứng chỉ</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="title"
                          value={editCertification.title}
                          onChange={handleEditCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Nhập tên chứng chỉ"
                        />
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Cấp bởi</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="issuer"
                          value={editCertification.issuer}
                          onChange={handleEditCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Tên tổ chức cấp"
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày cấp (hiện tại: {editCertification.issueDate ? formatDate(editCertification.issueDate) : "Chưa xác định"})</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="issueDate"
                          value={editCertification.issueDate}
                          onChange={handleEditCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày hết hạn (hiện tại: {editCertification.expiryDate ? formatDate(editCertification.expiryDate) : "Chưa xác định"})</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="expiryDate"
                          value={editCertification.expiryDate}
                          onChange={handleEditCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                      <textarea
                        name="description"
                        value={editCertification.description}
                        onChange={handleEditCertificationChange}
                        rows={3}
                        className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100 resize-none"
                        placeholder="Mô tả ngắn về chứng chỉ"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">URL tài liệu</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="fileUrl"
                          value={editCertification.fileUrl}
                          onChange={handleEditCertificationChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="URL tài liệu chứng chỉ (nếu có)"
                        />
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setEditCertId(null);
                        setEditCertification(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleUpdateCertification}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      Lưu chỉnh sửa
                    </button>
                  </div>
                </div>
              )}

              {/* Certifications List */}
              {certifications.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Chưa có chứng chỉ nào.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert._id || cert.title + cert.issueDate}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow relative group h-48 flex flex-col"
                    >
                      <div className="flex items-start gap-4 flex-1 overflow-hidden">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-semibold text-gray-800 truncate">{cert.title || "Chưa có tiêu đề"}</h4>
                          <p className="text-gray-600 text-sm mt-1 truncate">Cấp bởi: {cert.issuer || "Chưa xác định"}</p>
                          <p className="text-gray-500 text-sm mt-1">Ngày cấp: {formatDate(cert.issueDate)}</p>
                          {cert.expiryDate && (
                            <p className="text-gray-500 text-sm mt-1">Ngày hết hạn: {formatDate(cert.expiryDate)}</p>
                          )}
                          {cert.description && (
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">Mô tả: {cert.description}</p>
                          )}
                          {cert.fileUrl && (
                            <p className="text-gray-500 text-sm mt-1 truncate">
                              <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Xem chứng chỉ
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          cert.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : cert.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            cert.status === "approved"
                              ? "bg-green-500"
                              : cert.status === "rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        ></span>
                        <span>
                          {cert.status === "approved"
                            ? "Đã duyệt"
                            : cert.status === "rejected"
                              ? "Từ chối"
                              : "Đang chờ duyệt"}
                        </span>
                      </div>
                      {isEditing && cert._id && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => startEditCertification(cert)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all"
                            aria-label="Chỉnh sửa chứng chỉ"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCertification(cert._id!)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                            aria-label="Xóa chứng chỉ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Experiences Section */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Kinh nghiệm làm việc</h3>
                </div>
                {isEditing && !showExpForm && !editExpId && (
                  <button
                    onClick={() => setShowExpForm(true)}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm kinh nghiệm
                  </button>
                )}
              </div>

              {/* Experience Form (Add) */}
              {isEditing && showExpForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Thêm kinh nghiệm làm việc mới</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bệnh viện/Tổ chức</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="hospital"
                          value={newExperience.hospital}
                          onChange={handleNewExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Tên bệnh viện/tổ chức"
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="position"
                          value={newExperience.position}
                          onChange={handleNewExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Chức vụ của bạn"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="startDate"
                          value={newExperience.startDate}
                          onChange={handleNewExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày kết thúc (để trống nếu hiện tại)
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="endDate"
                          value={newExperience.endDate}
                          onChange={handleNewExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Mô tả công việc</label>
                      <textarea
                        name="description"
                        value={newExperience.description}
                        onChange={handleNewExperienceChange}
                        rows={3}
                        className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100 resize-none"
                        placeholder="Mô tả ngắn về công việc của bạn"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowExpForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddExperience}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      Lưu kinh nghiệm
                    </button>
                  </div>
                </div>
              )}

              {/* Experience Form (Edit) */}
              {isEditing && editExpId && editExperience && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Chỉnh sửa kinh nghiệm làm việc</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bệnh viện/Tổ chức</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="hospital"
                          value={editExperience.hospital}
                          onChange={handleEditExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Tên bệnh viện/tổ chức"
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="position"
                          value={editExperience.position}
                          onChange={handleEditExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                          placeholder="Chức vụ của bạn"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu (hiện tại: {editExperience.startDate ? formatDate(editExperience.startDate) : "Chưa xác định"})</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="startDate"
                          value={editExperience.startDate}
                          onChange={handleEditExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày kết thúc (hiện tại: {editExperience.endDate ? formatDate(editExperience.endDate) : "Chưa xác định"})</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="endDate"
                          value={editExperience.endDate}
                          onChange={handleEditExperienceChange}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 pl-10 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Mô tả công việc</label>
                      <textarea
                        name="description"
                        value={editExperience.description}
                        onChange={handleEditExperienceChange}
                        rows={3}
                        className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-base focus:border-teal-500 focus:ring-4 focus:ring-teal-100 resize-none"
                        placeholder="Mô tả ngắn về công việc của bạn"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setEditExpId(null);
                        setEditExperience(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleUpdateExperience}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      Lưu chỉnh sửa
                    </button>
                  </div>
                </div>
              )}

              {/* Experiences List */}
              {experiences.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Chưa có kinh nghiệm làm việc nào.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {experiences.map((exp) => (
                    <div
                      key={exp._id || exp.position + exp.startDate}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow relative group h-48 flex flex-col"
                    >
                      <div className="flex items-start gap-4 flex-1 overflow-hidden">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-semibold text-gray-800 truncate">Vị trí: {exp.position || "Chưa xác định"}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Hiện tại"}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 font-medium mt-1 truncate">Bệnh viện: {exp.hospital || "Chưa xác định"}</p>
                          {exp.description && <p className="text-gray-600 text-sm mt-2 line-clamp-2">Mô tả: {exp.description}</p>}
                        </div>
                      </div>
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          exp.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : exp.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            exp.status === "approved"
                              ? "bg-green-500"
                              : exp.status === "rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        ></span>
                        <span>
                          {exp.status === "approved"
                            ? "Đã duyệt"
                            : exp.status === "rejected"
                              ? "Từ chối"
                              : "Đang chờ duyệt"}
                        </span>
                      </div>
                      {isEditing && exp._id && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => startEditExperience(exp)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all"
                            aria-label="Chỉnh sửa kinh nghiệm"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp._id!)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                            aria-label="Xóa kinh nghiệm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-8 mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DoctorProfile;