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
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import Sidebar, { drawerWidth, collapsedDrawerWidth } from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
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
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout; 