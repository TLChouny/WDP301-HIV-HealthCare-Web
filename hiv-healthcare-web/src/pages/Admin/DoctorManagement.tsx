import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';

interface Doctor {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  status: 'active' | 'inactive';
}

const initialDoctor: Doctor = {
  id: '',
  fullName: '',
  dateOfBirth: new Date(),
  gender: 'male',
  phoneNumber: '',
  email: '',
  specialization: '',
  licenseNumber: '',
  experience: 0,
  status: 'active',
};

const specializations = [
  'Bác sĩ đa khoa',
  'Bác sĩ chuyên khoa HIV/AIDS',
  'Bác sĩ tâm lý',
  'Bác sĩ dinh dưỡng',
  'Bác sĩ phục hồi chức năng',
];

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(initialDoctor);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsEditMode(true);
    } else {
      setSelectedDoctor(initialDoctor);
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(initialDoctor);
  };

  const handleSaveDoctor = () => {
    if (isEditMode) {
      setDoctors(doctors.map(d => d.id === selectedDoctor.id ? selectedDoctor : d));
    } else {
      const newDoctor = {
        ...selectedDoctor,
        id: Math.random().toString(36).substr(2, 9),
      };
      setDoctors([...doctors, newDoctor]);
    }
    handleCloseDialog();
  };

  const handleDeleteDoctor = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phoneNumber.includes(searchTerm) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Quản lý bác sĩ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#115E59', '&:hover': { bgcolor: '#0F766E' } }}
        >
          Thêm bác sĩ
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm theo tên, số điện thoại, email hoặc chuyên khoa..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Chuyên khoa</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số năm kinh nghiệm</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.fullName}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.phoneNumber}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.experience} năm</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: doctor.status === 'active' ? 'success.main' : 'error.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {doctor.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenDialog(doctor)}
                    sx={{ color: '#115E59' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Chỉnh sửa thông tin bác sĩ' : 'Thêm bác sĩ mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Họ và tên"
                value={selectedDoctor.fullName}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, fullName: e.target.value })}
              />
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày sinh"
                  value={selectedDoctor.dateOfBirth}
                  onChange={(date) => setSelectedDoctor({ ...selectedDoctor, dateOfBirth: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Giới tính"
                value={selectedDoctor.gender}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, gender: e.target.value as 'male' | 'female' | 'other' })}
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={selectedDoctor.phoneNumber}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, phoneNumber: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedDoctor.email}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, email: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Chuyên khoa"
                value={selectedDoctor.specialization}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, specialization: e.target.value })}
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Số chứng chỉ hành nghề"
                value={selectedDoctor.licenseNumber}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, licenseNumber: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                type="number"
                label="Số năm kinh nghiệm"
                value={selectedDoctor.experience}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, experience: parseInt(e.target.value) || 0 })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={selectedDoctor.status}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, status: e.target.value as 'active' | 'inactive' })}
              >
                <MenuItem value="active">Đang làm việc</MenuItem>
                <MenuItem value="inactive">Nghỉ việc</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveDoctor}
            variant="contained"
            sx={{ bgcolor: '#115E59', '&:hover': { bgcolor: '#0F766E' } }}
          >
            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManagement; 