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
} from '@mui/icons-material';
import Sidebar, { drawerWidth } from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: '#115E59',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            HIV Healthcare - Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        variant="permanent"
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          marginTop: '64px', // Height of AppBar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 