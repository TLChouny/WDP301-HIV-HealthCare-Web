import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material';
import {
  Event as EventIcon,
  MedicalServices as MedicalIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual data from your backend
  const upcomingAppointments = [
    {
      id: 1,
      date: '20/03/2024',
      time: '09:00',
      type: 'Khám định kỳ',
      doctor: 'BS. Trần Thị B',
    },
    {
      id: 2,
      date: '25/03/2024',
      time: '14:30',
      type: 'Xét nghiệm',
      doctor: 'BS. Lê Văn C',
    },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Lịch hẹn mới',
      message: 'Lịch hẹn khám định kỳ đã được xác nhận',
      time: '5 phút trước',
    },
    {
      id: 2,
      title: 'Nhắc nhở',
      message: 'Đừng quên uống thuốc ARV vào 8h sáng',
      time: '1 giờ trước',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader
            title="Lịch hẹn sắp tới"
            action={
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/user/appointments')}
              >
                Xem tất cả
              </Button>
            }
          />
          <CardContent>
            <List>
              {upcomingAppointments.map((appointment) => (
                <ListItem key={appointment.id} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/user/appointments/${appointment.id}`)}
                  >
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={appointment.type}
                      secondary={
                        <>
                          {appointment.date} - {appointment.time}
                          <br />
                          {appointment.doctor}
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader
            title="Thông báo"
            action={
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/user/notifications')}
              >
                Xem tất cả
              </Button>
            }
          />
          <CardContent>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemIcon>
                    <NotificationsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        {notification.message}
                        <br />
                        {notification.time}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thao tác nhanh
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EventIcon />}
                onClick={() => navigate('/user/appointments/new')}
              >
                Đặt lịch mới
              </Button>
              <Button
                variant="outlined"
                startIcon={<MedicalIcon />}
                onClick={() => navigate('/user/medical-records')}
              >
                Xem hồ sơ bệnh án
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard; 