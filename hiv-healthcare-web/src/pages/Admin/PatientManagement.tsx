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
  Grid,
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

interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: string;
  email: string;
  diagnosisDate: Date;
  status: 'active' | 'inactive';
}

const initialPatient: Patient = {
  id: '',
  fullName: '',
  dateOfBirth: new Date(),
  gender: 'male',
  phoneNumber: '',
  address: '',
  email: '',
  diagnosisDate: new Date(),
  status: 'active',
};

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(initialPatient);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setSelectedPatient(patient);
      setIsEditMode(true);
    } else {
      setSelectedPatient(initialPatient);
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(initialPatient);
  };

  const handleSavePatient = () => {
    if (isEditMode) {
      setPatients(patients.map(p => p.id === selectedPatient.id ? selectedPatient : p));
    } else {
      const newPatient = {
        ...selectedPatient,
        id: Math.random().toString(36).substr(2, 9),
      };
      setPatients([...patients, newPatient]);
    }
    handleCloseDialog();
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Quản lý bệnh nhân
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#115E59', '&:hover': { bgcolor: '#0F766E' } }}
        >
          Thêm bệnh nhân
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
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
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ngày chẩn đoán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.dateOfBirth.toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                </TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.diagnosisDate.toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: patient.status === 'active' ? 'success.main' : 'error.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {patient.status === 'active' ? 'Đang điều trị' : 'Ngừng điều trị'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenDialog(patient)}
                    sx={{ color: '#115E59' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeletePatient(patient.id)}
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
          {isEditMode ? 'Chỉnh sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={selectedPatient.fullName}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày sinh"
                  value={selectedPatient.dateOfBirth}
                  onChange={(date) => setSelectedPatient({ ...selectedPatient, dateOfBirth: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Giới tính"
                value={selectedPatient.gender}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, gender: e.target.value as 'male' | 'female' | 'other' })}
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={selectedPatient.phoneNumber}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={selectedPatient.address}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedPatient.email}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày chẩn đoán"
                  value={selectedPatient.diagnosisDate}
                  onChange={(date) => setSelectedPatient({ ...selectedPatient, diagnosisDate: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={selectedPatient.status}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, status: e.target.value as 'active' | 'inactive' })}
              >
                <MenuItem value="active">Đang điều trị</MenuItem>
                <MenuItem value="inactive">Ngừng điều trị</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSavePatient}
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

export default PatientManagement; 