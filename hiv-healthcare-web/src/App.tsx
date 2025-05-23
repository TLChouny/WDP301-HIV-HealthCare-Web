// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';

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
        {/* Add more admin routes here */}
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
