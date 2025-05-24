import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
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

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ color: '#115E59', fontWeight: 'bold' }}>
          Báo cáo & Thống kê
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Thời gian</InputLabel>
          <Select
            value={timeRange}
            label="Thời gian"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="week">Tuần này</MenuItem>
            <MenuItem value="month">Tháng này</MenuItem>
            <MenuItem value="quarter">Quý này</MenuItem>
            <MenuItem value="year">Năm nay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Thống kê tổng quan */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }}
        gap={3}
        mb={3}
      >
        <Box>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số bệnh nhân
              </Typography>
              <Typography variant="h4" sx={{ color: '#115E59', fontWeight: 'bold' }}>1,234</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Lịch hẹn hôm nay
              </Typography>
              <Typography variant="h4" sx={{ color: '#115E59', fontWeight: 'bold' }}>45</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Bệnh nhân mới
              </Typography>
              <Typography variant="h4" sx={{ color: '#115E59', fontWeight: 'bold' }}>28</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đang điều trị ARV
              </Typography>
              <Typography variant="h4" sx={{ color: '#115E59', fontWeight: 'bold' }}>856</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Biểu đồ lịch hẹn theo thời gian và phân loại bệnh nhân */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr' }}
        gap={3}
        mb={3}
      >
        <Box>
          <Paper sx={{ p: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#115E59', fontWeight: 'bold' }}>
              Lịch hẹn theo thời gian
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#115E59" name="Số lượng lịch hẹn" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#115E59', fontWeight: 'bold' }}>
              Phân loại bệnh nhân
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
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
          </Paper>
        </Box>
      </Box>

      {/* Biểu đồ điều trị ARV và xét nghiệm */}
      <Box>
        <Paper sx={{ p: 2, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#115E59', fontWeight: 'bold' }}>
            Thống kê điều trị ARV và xét nghiệm
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
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
        </Paper>
      </Box>
    </Box>
  );
};

export default Statistics; 