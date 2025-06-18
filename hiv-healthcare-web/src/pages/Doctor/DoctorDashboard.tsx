import React from 'react';
import { 
  Users, 
  Calendar, 
  Pill,
  FileText
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl px-4 py-6 text-left">
          <h1 className="text-2xl font-bold text-gray-800">Bác sĩ điều trị</h1>
          <p className="text-gray-600 mt-2">Tổng quan hệ thống</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-4 py-8 flex flex-col items-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-blue-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-blue-800 text-lg">Tổng số bệnh nhân</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">1,234</p>
          </div>
          <div className="bg-green-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-green-800 text-lg">Tổng số lịch hẹn</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">567</p>
          </div>
          <div className="bg-purple-50 p-8 rounded-lg shadow text-left">
            <h3 className="font-medium text-purple-800 text-lg">Tổng số phác đồ</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;