import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  History as HistoryIcon,
  MedicalServices as MedicalIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const drawerWidth = 240;

const UserLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }
      
      await logout(token);
      
      // Xóa token và thông tin user khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chuyển về trang chủ và reload lại trang
      navigate('/');
      window.location.reload(),2000;
      // toast.success('Đăng xuất thành công');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Đăng xuất thất bại');
      
      // Nếu có lỗi vẫn xóa token và chuyển về trang chủ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
      window.location.reload();
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Tổng quan', icon: <DashboardIcon />, path: '/user' },
    { text: 'Lịch hẹn', icon: <EventIcon />, path: '/user/appointments' },
    // { text: 'Lịch sử khám', icon: <HistoryIcon />, path: '/user/history' },
    { text: 'Hồ sơ bệnh án', icon: <MedicalIcon />, path: '/user/medical-records' },
    { text: 'Thông tin cá nhân', icon: <PersonIcon />, path: '/user/profile' },

  ];

  const drawer = (
    <Box sx={{ background: '#fff', height: '100%', borderTopRightRadius: 32, borderBottomRightRadius: 32, boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: 'center', py: 3 }}>
        <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 'bold', color: '#3b82f6', letterSpacing: 1 }}>
          HIV Healthcare
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)', color: '#fff' },
                transition: 'background 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: '#11706A', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
        
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: '#11706A',
          boxShadow: 3,
          borderBottomLeftRadius: { md: 32 },
          borderBottomRightRadius: 0,
        }}
        elevation={0}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 18,
                color: '#fff',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 2,
                px: 2.5,
                boxShadow: 1,
                '&:hover': {
                  background: 'rgba(255,255,255,0.24)',
                  color: '#fff',
                },
              }}
            >
              Trang chủ
            </Button>
          </Box>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 16, background: '#fff', color: '#11706A', borderRadius: 2, px: 3, boxShadow: 1, '&:hover': { background: '#e0f2f1', color: '#11706A' } }}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#fff',
              borderTopRightRadius: 32,
              borderBottomRightRadius: 32,
              boxShadow: 3,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '72px',
          background: '#fff',
          borderRadius: { xs: 0, md: 4 },
          minHeight: '100vh',
          boxShadow: { md: 2 },
        }}
      >
        <Outlet />
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
};

export default UserLayout; 