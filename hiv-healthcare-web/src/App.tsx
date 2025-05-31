// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import DoctorLayout from './layouts/DoctorLayout';
import StaffLayout from './layouts/StaffLayout';

// Public Pages
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import TestResults from './pages/TestResults';
import ARVTreatment from './pages/ARVTreatment';
import Support from './pages/ServicesHome/Support';
import Testing from './pages/ServicesHome/Testing';
import Treatment from './pages/ServicesHome/Treatment';

// Doctor Pages
import Doctors from './pages/Doctor/Doctors';
import HIVSpecialist from './pages/Doctor/HIVSpecialist';
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
import RoleManagement from './pages/Admin/RoleManagement';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorPatientManagement from './pages/Doctor/PatientManagement';
import DoctorAppointmentManagement from './pages/Doctor/AppointmentManagement';
import ARVProtocolManagement from './pages/Doctor/ARVProtocolManagement';
import MedicalRecordManagement from './pages/Doctor/MedicalRecordManagement';
import LabTestManagement from './pages/Doctor/LabTestManagement';

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
import About from './pages/Home/About';

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
        <Route path="about" element={<About />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="test-results" element={<TestResults />} />
        <Route path="arv-treatment" element={<ARVTreatment />} />
        <Route path="services/support" element={<Support />} />
        <Route path="services/testing" element={<Testing />} />
        <Route path="services/treatment" element={<Treatment />} />
        
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
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="doctors" element={<AdminDoctorManagement />} />
        <Route path="medications" element={<MedicationManagement />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="roles" element={<RoleManagement />} />
      </Route>

      {/* Doctor routes */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatientManagement />} />
        <Route path="appointments" element={<DoctorAppointmentManagement />} />
        <Route path="arv-protocols" element={<ARVProtocolManagement />} />
        <Route path="medical-records" element={<MedicalRecordManagement />} />
        <Route path="lab-tests" element={<LabTestManagement />} />
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
