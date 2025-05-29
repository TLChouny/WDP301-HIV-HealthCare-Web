import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

// Dữ liệu mẫu cho biểu đồ
const appointmentData = [
  { name: 'T1', value: 65 },
  { name: 'T2', value: 59 },
  { name: 'T3', value: 80 },
  { name: 'T4', value: 81 },
  { name: 'T5', value: 56 },
  { name: 'T6', value: 55 },
];

const patientTypeData = [
  { name: 'Khám mới', value: 400 },
  { name: 'Tái khám', value: 300 },
  { name: 'Khám cấp cứu', value: 200 },
];

const treatmentData = [
  { name: 'T1', arv: 40, test: 24 },
  { name: 'T2', arv: 30, test: 13 },
  { name: 'T3', arv: 20, test: 98 },
  { name: 'T4', arv: 27, test: 39 },
  { name: 'T5', arv: 18, test: 48 },
  { name: 'T6', arv: 23, test: 38 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-2">Tổng số bệnh nhân</p>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-2">Lịch hẹn hôm nay</p>
            <p className="text-3xl font-bold text-blue-600">45</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-2">Bệnh nhân mới</p>
            <p className="text-3xl font-bold text-blue-600">28</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-2">Đang điều trị ARV</p>
            <p className="text-3xl font-bold text-blue-600">856</p>
          </div>
        </div>

        {/* Biểu đồ lịch hẹn và phân loại bệnh nhân */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn theo thời gian</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#115E59" name="Số lượng lịch hẹn" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân loại bệnh nhân</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {patientTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Biểu đồ điều trị ARV và xét nghiệm */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê điều trị ARV và xét nghiệm</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={treatmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="arv"
                  stroke="#115E59"
                  name="Điều trị ARV"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="test"
                  stroke="#8884d8"
                  name="Xét nghiệm"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 