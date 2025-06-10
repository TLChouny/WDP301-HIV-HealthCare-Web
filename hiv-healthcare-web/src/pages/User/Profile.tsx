import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Person as PersonIcon, Phone as PhoneIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const UserProfile: React.FC = () => {
  const { user, getUserById, logout } = useAuth();
  const [userData, setUserData] = React.useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) {
        setError("Vui lòng đăng nhập để xem thông tin.");
        return;
      }
      try {
        console.log("Fetching user with ID:", user._id);
        const detailedUser = await getUserById(user._id);
        setUserData(detailedUser);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
        if (error.message === "Please authenticate") {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          logout(); // Đăng xuất nếu token không hợp lệ
        } else {
          setError(error.message || "Lỗi khi lấy thông tin người dùng.");
        }
      }
    };
    fetchUserData();
  }, [user?._id, getUserById, logout]);

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        {error.includes("đăng nhập") && (
          <Button variant="contained" color="primary" onClick={() => (window.location.href = "/login")}>
            Đăng nhập lại
          </Button>
        )}
      </Box>
    );
  }

  if (!userData) {
    return <Typography variant="h6">Đang tải thông tin...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
        {/* Personal Information */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={userData.fullName || userData.userName || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  value={userData.dateOfBirth || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Giới tính"
                  value={userData.gender || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={userData.phone || userData.phone_number || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "1", sm: "1 / span 2" } }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userData.email || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "1", sm: "1 / span 2" } }}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={userData.address || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin bảo hiểm
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Số CMND/CCCD"
                  value={userData.idNumber || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Số thẻ BHYT"
                  value={userData.insuranceNumber || "Chưa cập nhật"}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Emergency Contacts */}
        <Box>
          <Card>
            <CardHeader
              title="Liên hệ khẩn cấp"
              avatar={<PhoneIcon color="primary" />}
            />
            <CardContent>
              {emergencyContacts.length > 0 ? (
                emergencyContacts.map((contact, index) => (
                  <Box key={index}>
                    <Typography variant="subtitle1">{contact.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.relationship}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.phone}
                    </Typography>
                    {index < emergencyContacts.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có thông tin liên hệ khẩn cấp.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary">
          Cập nhật thông tin
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile;