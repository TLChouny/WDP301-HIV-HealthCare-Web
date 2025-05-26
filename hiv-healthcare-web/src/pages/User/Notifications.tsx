import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const UserNotifications: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const notifications = [
    {
      id: 1,
      title: 'Lịch hẹn mới',
      message: 'Lịch hẹn khám định kỳ đã được xác nhận',
      time: '5 phút trước',
      read: false,
    },
    {
      id: 2,
      title: 'Nhắc nhở',
      message: 'Đừng quên uống thuốc ARV vào 8h sáng',
      time: '1 giờ trước',
      read: true,
    },
    {
      id: 3,
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm CD4 đã có sẵn',
      time: '2 giờ trước',
      read: true,
    },
  ];

  const notificationSettings = [
    {
      id: 'appointment',
      title: 'Thông báo lịch hẹn',
      description: 'Nhận thông báo khi có lịch hẹn mới hoặc thay đổi',
      enabled: true,
    },
    {
      id: 'medication',
      title: 'Nhắc nhở uống thuốc',
      description: 'Nhận thông báo nhắc nhở uống thuốc ARV',
      enabled: true,
    },
    {
      id: 'test',
      title: 'Kết quả xét nghiệm',
      description: 'Nhận thông báo khi có kết quả xét nghiệm mới',
      enabled: true,
    },
    {
      id: 'news',
      title: 'Tin tức y tế',
      description: 'Nhận thông báo về tin tức y tế và sự kiện',
      enabled: false,
    },
  ];

  const handleDeleteNotification = (id: number) => {
    // Implement delete notification logic
    console.log('Delete notification:', id);
  };

  const handleToggleSetting = (id: string) => {
    // Implement toggle setting logic
    console.log('Toggle setting:', id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thông báo
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Notifications List */}
        <Paper>
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem>
                  <ListItemIcon>
                    {notification.read ? (
                      <NotificationsOffIcon color="action" />
                    ) : (
                      <NotificationsActiveIcon color="primary" />
                    )}
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
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Notification Settings */}
        <Card>
          <CardHeader
            title="Cài đặt thông báo"
            avatar={<NotificationsIcon color="primary" />}
          />
          <CardContent>
            <List>
              {notificationSettings.map((setting) => (
                <ListItem key={setting.id}>
                  <ListItemText
                    primary={setting.title}
                    secondary={setting.description}
                  />
                  <Switch
                    edge="end"
                    checked={setting.enabled}
                    onChange={() => handleToggleSetting(setting.id)}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserNotifications; 