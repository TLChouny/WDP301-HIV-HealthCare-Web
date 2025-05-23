// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import TestResults from './pages/TestResults';
import ARVTreatment from './pages/ARVTreatment';
import Layout from './layouts/Layout';
import './index.css'
import Register from './components/Home/Register';
import Login from './components/Home/Login';
import ForgotPassword from './components/Home/ForgotPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
// Fallback nếu component không load
const FallbackComponent: React.FC = () => (
  <div className="text-center text-red-500">Component không tìm thấy. Vui lòng kiểm tra đường dẫn hoặc cài đặt.</div>
);

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/test-results" element={<TestResults />} />
        <Route path="/arv-treatment" element={<ARVTreatment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<FallbackComponent />} />
      </Routes>
    </Layout>
  );
};

export default App;
