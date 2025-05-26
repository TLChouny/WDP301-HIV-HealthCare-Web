import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  EventNote as EventIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Sidebar, { drawerWidth, collapsedDrawerWidth } from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Menu states
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mock data - replace with actual data from your backend
  const stats = {
    totalPatients: 150,
    totalDoctors: 25,
    appointmentsToday: 45,
    pendingTasks: 12,
  };

  const recentActivities = [
    { id: 1, title: 'New patient registration', time: '10 minutes ago' },
    { id: 2, title: 'Appointment scheduled', time: '30 minutes ago' },
    { id: 3, title: 'Medical record updated', time: '1 hour ago' },
  ];

  // Mock notifications data
  const notifications = [
    { id: 1, message: 'Bệnh nhân mới đăng ký khám', time: '5 phút trước' },
    { id: 2, message: 'Có lịch hẹn mới', time: '10 phút trước' },
    { id: 3, message: 'Cập nhật hồ sơ bệnh nhân', time: '30 phút trước' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#115E59',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HIV Healthcare
          </Typography>

          {/* Notification Menu */}
          <IconButton 
            color="inherit"
            onClick={(e) => setNotificationAnchor(e.currentTarget)}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={() => setNotificationAnchor(null)}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 }
            }}
          >
            {notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={() => setNotificationAnchor(null)}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          {/* Profile Menu */}
          <IconButton
            color="inherit"
            onClick={(e) => setProfileAnchor(e.currentTarget)}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            PaperProps={{
              sx: { width: 200 }
            }}
          >
            <MenuItem onClick={() => setProfileAnchor(null)}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={() => setProfileAnchor(null)}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Cài đặt
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setProfileAnchor(null)}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: '#f5f5f5',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 