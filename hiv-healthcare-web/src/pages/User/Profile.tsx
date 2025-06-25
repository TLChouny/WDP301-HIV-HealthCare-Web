import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { User, Gender } from "../../types/user";

// Cấu hình toast chung
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

// Hàm tiện ích để hiển thị toast
const showToast = (message: string, type: "error" | "success" = "error") => {
  if (!toast.isActive(message)) {
    const config = { ...TOAST_CONFIG, toastId: message };
    if (type === "success") {
      toast.success(message, config);
    } else {
      toast.error(message, config);
    }
  }
};

const UserProfile: React.FC = () => {
  const { user, getUserById, updateUser, logout, loading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phone_number: "",
    gender: "",
    address: "",
    userDescription: "",
  });

  // Lấy dữ liệu người dùng khi component mount hoặc user._id thay đổi
  useEffect(() => {
    const fetchUserData = async () => {
      if (loading || !user?._id) {
        return; // Chờ xác thực hoàn tất hoặc user được thiết lập
      }
      try {
        console.log("Lấy dữ liệu người dùng với ID:", user._id);
        const detailedUser: User = await getUserById(user._id);
        setUserData(detailedUser);
        // Khởi tạo formData với dữ liệu từ API
        setFormData({
          userName: detailedUser.userName || "",
          phone_number: detailedUser.phone_number || "",
          gender: detailedUser.gender || "",
          address: detailedUser.address || "",
          userDescription: detailedUser.userDescription || "",
        });
        setError(null);
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error.message);
        let errorMessage = "Không thể tải thông tin người dùng!";
        if (error.message?.toLowerCase().includes("authenticate")) {
          errorMessage = "Phiên đăng nhập hết hạn!";
          logout();
        }
        setError(errorMessage);
        showToast(errorMessage);
      }
    };
    fetchUserData();
  }, [user?._id, getUserById, logout, loading]);

  // Xử lý thay đổi input trong form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xác thực dữ liệu trước khi gửi
  const validateForm = () => {
    if (!formData.userName.trim()) {
      return "Vui lòng nhập tên người dùng!";
    }
    if (formData.gender && !["male", "female", "other"].includes(formData.gender)) {
      return "Giới tính phải là 'male', 'female', hoặc 'other'!";
    }
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      return "Số điện thoại phải là 10 chữ số!";
    }
    return null;
  };

  // Xử lý submit form cập nhật
const handleUpdate = async () => {
  if (!user?._id) {
    const errorMessage = "Vui lòng đăng nhập để cập nhật!";
    setError(errorMessage);
    showToast(errorMessage);
    return;
  }

  // Xác thực dữ liệu
  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    showToast(validationError);
    return;
  }

  try {
    const updatePayload = {
      userName: formData.userName.trim(),
      phone_number: formData.phone_number || undefined,
      gender: formData.gender as Gender || undefined,
      address: formData.address || undefined,
      userDescription: formData.userDescription || undefined,
    };
    console.log("Payload gửi đi:", updatePayload);
    // Gọi API cập nhật
    await updateUser(user._id, updatePayload);
    // Lấy lại dữ liệu người dùng mới nhất
    const refreshedUser: User = await getUserById(user._id);
    console.log("Dữ liệu người dùng sau cập nhật:", refreshedUser);
    // Cập nhật trạng thái
    setUserData(refreshedUser);
    setIsEditing(false);
    setError(null);
    // Gọi toast ngay lập tức
    showToast("Cập nhật thông tin thành công!", "success");
    // Đồng bộ AuthContext nếu cần
  }
  catch (error: any) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error.message);
    const errorMessage = error.message || "Cập nhật thông tin thất bại!";
    setError(errorMessage);
    showToast(errorMessage);
  }
};

  // Chuyển sang chế độ chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  // Hủy chỉnh sửa và khôi phục dữ liệu ban đầu
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFormData({
      userName: userData?.userName || "",
      phone_number: userData?.phone_number || "",
      gender: userData?.gender || "",
      address: userData?.address || "",
      userDescription: userData?.userDescription || "",
    });
  };

  if (loading) {
    return <Typography variant="h6">Đang tải thông tin xác thực...</Typography>;
  }

  if (!user) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Vui lòng đăng nhập để xem thông tin!
        </Typography>
        <Button variant="contained" color="primary" onClick={() => (window.location.href = "/auth/login")}>
          Đăng nhập
        </Button>
      </Box>
    );
  }

  if (error && !isEditing) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        {error.includes("đăng nhập") && (
          <Button variant="contained" color="primary" onClick={() => (window.location.href = "/auth/login")}>
            Đăng nhập lại
          </Button>
        )}
      </Box>
    );
  }

  if (!userData) {
    return <Typography variant="h6">Đang tải thông tin người dùng...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Box sx={{ maxWidth: "800px" }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Tên người dùng"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                InputProps={{ readOnly: !isEditing }}
                required
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                InputProps={{ readOnly: !isEditing }}
                helperText="male, female, hoặc other"
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                InputProps={{ readOnly: !isEditing }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / span 2" } }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={userData.email || "Chưa cập nhật"}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / span 2" } }}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                InputProps={{ readOnly: !isEditing }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / span 2" } }}>
              <TextField
                fullWidth
                label="Mô tả cá nhân"
                name="userDescription"
                value={formData.userDescription}
                onChange={handleInputChange}
                InputProps={{ readOnly: !isEditing }}
                multiline
                rows={4}
              />
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {isEditing ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Lưu
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Hủy
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Cập nhật thông tin
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;