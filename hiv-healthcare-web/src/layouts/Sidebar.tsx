import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  CalendarMonth as CalendarIcon,
  Medication as MedicationIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

export const drawerWidth = 240;
export const collapsedDrawerWidth = 65;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { text: 'Tổng quan', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Quản lý bệnh nhân', icon: <PeopleIcon />, path: '/admin/patients' },
    { text: 'Quản lý bác sĩ', icon: <HospitalIcon />, path: '/admin/doctors' },
    { text: 'Lịch hẹn', icon: <CalendarIcon />, path: '/admin/appointments' },
    { text: 'Thuốc & Vật tư', icon: <MedicationIcon />, path: '/admin/medications' },
    { text: 'Báo cáo & Thống kê', icon: <AssessmentIcon />, path: '/admin/statistics' },
    { text: 'Cài đặt', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#115E59', // teal-800
          color: 'white',
          borderRight: 'none',
          top: '64px', // Height of the header
          height: 'calc(100% - 64px)', // Subtract header height
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between' 
      }}>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ color: 'white' }}>
            HIV Healthcare
          </Typography>
        )}
        <Tooltip title={isCollapsed ? "Mở rộng" : "Thu gọn"}>
          <IconButton 
            onClick={toggleCollapse} 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.text} 
            title={isCollapsed ? item.text : ""} 
            placement="right"
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                '&:hover': {
                  backgroundColor: '#0F766E', // teal-700
                },
                '&.Mui-selected': {
                  backgroundColor: '#0F766E', // teal-700
                  '&:hover': {
                    backgroundColor: '#0D9488', // teal-600
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: 1,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <List>
        <Tooltip title={isCollapsed ? "Đăng xuất" : ""} placement="right">
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2.5,
              '&:hover': {
                backgroundColor: '#0F766E', // teal-700
              },
            }}
          >
            <ListItemIcon 
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 3,
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText 
                primary="Đăng xuất" 
                sx={{ 
                  opacity: 1,
                  transition: 'opacity 0.2s ease-in-out',
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
