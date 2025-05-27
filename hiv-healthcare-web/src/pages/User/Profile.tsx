import React from 'react';
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
} from '@mui/material';
import { Person as PersonIcon, Phone as PhoneIcon } from '@mui/icons-material';

const UserProfile: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const userData = {
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '01/01/1990',
    gender: 'Nam',
    phone: '0123456789',
    email: 'nguyenvana@example.com',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    idNumber: '123456789',
    insuranceNumber: '987654321',
  };

  const emergencyContacts = [
    {
      name: 'Nguyễn Thị B',
      relationship: 'Vợ',
      phone: '0987654321',
    },
    {
      name: 'Nguyễn Văn C',
      relationship: 'Anh trai',
      phone: '0123456788',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Personal Information */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={userData.fullName}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  value={userData.dateOfBirth}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Giới tính"
                  value={userData.gender}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={userData.phone}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userData.email}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={userData.address}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin bảo hiểm
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Số CMND/CCCD"
                  value={userData.idNumber}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Số thẻ BHYT"
                  value={userData.insuranceNumber}
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
              {emergencyContacts.map((contact, index) => (
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
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary">
          Cập nhật thông tin
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile; 