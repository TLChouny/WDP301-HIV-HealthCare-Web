// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import ManagerLayout from './layouts/ManagerLayout';
import StaffLayout from './layouts/StaffLayout';

// Public Pages
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import TestResults from './pages/TestResults';
import ARVTreatment from './pages/ARVTreatment';
import Support from './pages/ServicesHome/Support';
import Consultation from './pages/ServicesHome/Consultation';

// Doctor Pages
import Doctors from './pages/Doctor/Doctors';
import HIVSpecialist from './pages/Doctor/HIVSpecialist';
import Nutritionists from './pages/Doctor/Nutritionists';
import Counselors from './pages/Doctor/Counselors';

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

// Manager Pages
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import ManagerDoctorManagement from './pages/Manager/DoctorManagement';
import ManagerAppointmentManagement from './pages/Manager/AppointmentManagement';
import ManagerPatientManagement from './pages/Manager/PatientManagement';
import ManagerClinicManagement from './pages/Manager/ClinicManagement';
import StaffManagement from './pages/Manager/StaffManagement';

// Staff Pages
import StaffDashboard from './pages/Staff/StaffDashboard';
import StaffPatientManagement from './pages/Staff/PatientManagement';
import StaffAppointmentManagement from './pages/Staff/AppointmentManagement';
import StaffMedicalRecordManagement from './pages/Staff/MedicalRecordManagement';
import StaffMedicationManagement from './pages/Staff/MedicationManagement';
import StaffCounseling from './pages/Staff/Counseling';

// User Pages
import {
  Dashboard,
  Profile,
  AppointmentsUser,
  MedicalRecords,
  Notifications,
  HIVHistory,
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
        <Route path="services/support" element={<Support />} />
        <Route path="services/testing" element={<Consultation />} />
        
        {/* Doctor routes */}
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/hiv-specialist" element={<HIVSpecialist />} />
        <Route path="doctors/nutritionists" element={<Nutritionists />} />
        <Route path="doctors/counselors" element={<Counselors />} />
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
        <Route path="doctors" element={<AdminDoctorManagement />} />
        <Route path="medications" element={<MedicationManagement />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>

      {/* Manager routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="doctors" element={<ManagerDoctorManagement />} />
        <Route path="appointments" element={<ManagerAppointmentManagement />} />
        <Route path="patients" element={<ManagerPatientManagement />} />
        <Route path="clinics" element={<ManagerClinicManagement />} />
        <Route path="staff" element={<StaffManagement />} />
      </Route>

      {/* Staff routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="patients" element={<StaffPatientManagement />} />
        <Route path="appointments" element={<StaffAppointmentManagement />} />
        <Route path="medical-records" element={<StaffMedicalRecordManagement />} />
        <Route path="medications" element={<StaffMedicationManagement />} />
        <Route path="counseling" element={<StaffCounseling />} />
      </Route>

      {/* User routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<AppointmentsUser />} />
        <Route path="medical-records" element={<MedicalRecords />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="history" element={<HIVHistory />} />
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
