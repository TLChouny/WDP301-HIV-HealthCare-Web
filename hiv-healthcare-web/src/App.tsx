// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Public Pages
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import TestResults from './pages/TestResults';
import ARVTreatment from './pages/ARVTreatment';

// Auth Pages
import Register from './components/Home/Register';
import Login from './components/Home/Login';
import ForgotPassword from './components/Home/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import PatientManagement from './pages/Admin/PatientManagement';
import DoctorManagement from './pages/Admin/DoctorManagement';
import MedicationManagement from './pages/Admin/MedicationManagement';
import AppointmentManagement from './pages/Admin/AppointmentManagement';
import Statistics from './pages/Admin/Statistics';

// User Pages
import {
  UserDashboard,
  UserProfile,
  UserAppointments,
  UserMedicalRecords,
  UserNotifications,
} from './pages/User';

// Fallback component
const FallbackComponent: React.FC = () => (
  <div className="text-center text-red-500">Component không tìm thấy. Vui lòng kiểm tra đường dẫn hoặc cài đặt.</div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="test-results" element={<TestResults />} />
        <Route path="arv-treatment" element={<ARVTreatment />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="medications" element={<MedicationManagement />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>

      {/* User routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="appointments" element={<UserAppointments />} />
        <Route path="medical-records" element={<UserMedicalRecords />} />
        <Route path="notifications" element={<UserNotifications />} />
      </Route>

      {/* Redirects */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
      
      {/* 404 route */}
      <Route path="*" element={<FallbackComponent />} />
    </Routes>
  );
};

export default App;
