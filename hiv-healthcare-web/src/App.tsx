import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../src/context/AuthContext";
import { toast } from "react-toastify";
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import DoctorLayout from './layouts/DoctorLayout';
import StaffLayout from './layouts/StaffLayout';
import { ToastContainer } from 'react-toastify';

// Public Pages
import Home from './pages/Home/Home';
import ServiceByCategoryId from './pages/ServicesHome/ServiceByCategoryId';
import ServiceDetail from './pages/ServicesHome/ServiceDetail';
import About from './pages/Home/About';
import Blog from './pages/Home/Blog';
import Contact from './pages/Home/Contact';
import Appointment from './pages/Appointment/Appointment';

// Auth Pages
import Register from './components/Home/Register';
import Login from './components/Home/Login';
import ForgotPassword from './components/Home/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import PatientManagement from './pages/Admin/PatientManagement';
import AdminDoctorManagement from './pages/Admin/DoctorManagement';
import MedicationManagement from './pages/Admin/MedicationManagement';
import AppointmentManagement from './pages/Admin/AppointmentManagement';
import Statistics from './pages/Admin/Statistics';
import RoleManagement from './pages/Admin/RoleManagement';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorPatientManagement from './pages/Doctor/PatientManagement';
import DoctorAppointmentManagement from './pages/Doctor/AppointmentManagement';
import ARVProtocolManagement from './pages/Doctor/ARVProtocolManagement';
import MedicalRecordManagement from './pages/Doctor/MedicalRecordManagement';
import LabTestManagement from './pages/Doctor/LabTestManagement';
import Doctors from './pages/Doctor/Doctors';
import HIVSpecialist from './pages/Doctor/HIVSpecialist';
import Counselors from './pages/Doctor/Counselors';

// Staff Pages
import StaffDashboard from './pages/Staff/StaffDashboard';
import StaffPatientAndRecordManagement from './pages/Staff/PatientAndRecordManagement';
import StaffAppointmentManagement from './pages/Staff/AppointmentManagement';
import StaffServiceManagement from './pages/Staff/ServiceManagement';
import StaffCounseling from './pages/Staff/Counseling';
import StaffSettings from './pages/Staff/StaffSettings';


// User Pages
import {
  Dashboard,
  Profile,
  AppointmentsUser,
  MedicalRecords,
  Notifications,
  HIVHistory,
} from './pages/User';

import { AuthProvider } from "../src/context/AuthContext";
import { jwtDecode } from 'jwt-decode';
import { CategoryProvider } from './context/CategoryContext';
import { ServiceProvider } from './context/ServiceContext';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';

// Fallback component
const FallbackComponent: React.FC = () => (
  <div className="text-center text-red-500">Component không tìm thấy. Vui lòng kiểm tra đường dẫn hoặc cài đặt.</div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ allowedRole: 'user' | 'admin' | 'doctor' | 'staff' | 'manager' }> = ({ allowedRole }) => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  if (loading) {
    return <div>Đang kiểm tra xác thực...</div>;
  }

  const token = localStorage.getItem("token");
  let isTokenExpired = false;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        isTokenExpired = true;
      }
    } catch (error) {
      isTokenExpired = true;
    }
  }

  if (!isAuthenticated || isTokenExpired) {
    if (isTokenExpired) {
      logout();
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!", toastConfig);
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục!", toastConfig);
    }
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== allowedRole) {
    toast.error(`Bạn không có quyền truy cập trang này!`, toastConfig);
    const redirectPath =
      user?.role === 'admin' ? '/admin/dashboard' :
      user?.role === 'doctor' ? '/doctor/dashboard' :
      user?.role === 'staff' ? '/staff/dashboard' :
      '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ServiceProvider>
          <BookingProvider>
            <NotificationProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="contact" element={<Contact />} />
                <Route path="services/category/:id" element={<ServiceByCategoryId />} />
                <Route path="services/detail/:id" element={<ServiceDetail />} />
                <Route path="appointment" element={<Appointment />} />

                {/* Doctor routes */}
                <Route path="doctors" element={<Doctors />} />
                <Route path="doctors/hiv-specialist" element={<HIVSpecialist />} />
                <Route path="doctors/counselors" element={<Counselors />} />
              </Route>

              {/* Auth routes */}
              <Route path="/auth" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="patients" element={<PatientManagement />} />
                  <Route path="doctors" element={<AdminDoctorManagement />} />
                  <Route path="medications" element={<MedicationManagement />} />
                  <Route path="appointments" element={<AppointmentManagement />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="roles" element={<RoleManagement />} />
                </Route>
              </Route>

              {/* Doctor routes */}
              <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor" />}>
                <Route element={<DoctorLayout />}>
                  <Route index element={<DoctorDashboard />} />
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="patients" element={<DoctorPatientManagement />} />
                  <Route path="appointments" element={<DoctorAppointmentManagement />} />
                  <Route path="arv-protocols" element={<ARVProtocolManagement />} />
                  <Route path="medical-records" element={<MedicalRecordManagement />} />
                  <Route path="lab-tests" element={<LabTestManagement />} />
                </Route>
              </Route>

              {/* Staff routes */}
              <Route path="/staff" element={<ProtectedRoute allowedRole="staff" />}>
                <Route element={<StaffLayout />}>
                  <Route index element={<StaffDashboard />} />
                  <Route path="dashboard" element={<StaffDashboard />} />
                  <Route path="patients" element={<StaffPatientAndRecordManagement />} />
                  <Route path="appointments" element={<StaffAppointmentManagement />} />
                  <Route path="medications" element={<StaffServiceManagement />} />
                  <Route path="counseling" element={<StaffCounseling />} />
                  <Route path="settings" element={<StaffSettings />} />
                </Route>
              </Route>

              {/* User routes */}
              <Route path="/user" element={<ProtectedRoute allowedRole="user" />}>
                <Route element={<UserLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="appointments" element={<AppointmentsUser />} />
                  <Route path="medical-records" element={<MedicalRecords />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="history" element={<HIVHistory />} />
                </Route>
              </Route>

              {/* Redirects */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />
              <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

              {/* 404 route */}
              <Route path="*" element={<FallbackComponent />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={2000} />
            </NotificationProvider>
          </BookingProvider>
        </ServiceProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};

export default App;