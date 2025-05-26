import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
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

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={userData.fullName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  value={userData.dateOfBirth}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giới tính"
                  value={userData.gender}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={userData.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userData.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={userData.address}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin bảo hiểm
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số CMND/CCCD"
                  value={userData.idNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số thẻ BHYT"
                  value={userData.insuranceNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Emergency Contacts */}
        <Grid item xs={12} md={4}>
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
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary">
          Cập nhật thông tin
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile; 