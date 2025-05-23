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
  Chip,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  appointmentDate: Date;
  appointmentTime: string;
  type: 'regular' | 'urgent' | 'follow-up';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
}

const initialAppointment: Appointment = {
  id: '',
  patientName: '',
  patientId: '',
  doctorName: '',
  appointmentDate: new Date(),
  appointmentTime: '',
  type: 'regular',
  status: 'scheduled',
  notes: '',
};

const appointmentTypes = [
  { value: 'regular', label: 'Khám thường' },
  { value: 'urgent', label: 'Khám cấp cứu' },
  { value: 'follow-up', label: 'Tái khám' },
];

const appointmentStatuses = [
  { value: 'scheduled', label: 'Đã lên lịch', color: 'info' },
  { value: 'completed', label: 'Đã hoàn thành', color: 'success' },
  { value: 'cancelled', label: 'Đã hủy', color: 'error' },
  { value: 'no-show', label: 'Không đến', color: 'warning' },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(initialAppointment);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsEditMode(true);
    } else {
      setSelectedAppointment(initialAppointment);
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(initialAppointment);
  };

  const handleSaveAppointment = () => {
    if (isEditMode) {
      setAppointments(appointments.map(a => a.id === selectedAppointment.id ? selectedAppointment : a));
    } else {
      const newAppointment = {
        ...selectedAppointment,
        id: Math.random().toString(36).substr(2, 9),
      };
      setAppointments([...appointments, newAppointment]);
    }
    handleCloseDialog();
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = appointmentStatuses.find(s => s.value === status);
    return statusObj?.color || 'default';
  };

  const getStatusText = (status: string) => {
    const statusObj = appointmentStatuses.find(s => s.value === status);
    return statusObj?.label || status;
  };

  const getTypeText = (type: string) => {
    const typeObj = appointmentTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Quản lý lịch hẹn
        </Typography>
        <Button
          variant="contained"
          startIcon={<CalendarIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#115E59', '&:hover': { bgcolor: '#0F766E' } }}
        >
          Tạo lịch hẹn mới
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo tên bệnh nhân, mã bệnh nhân hoặc tên bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bệnh nhân</TableCell>
              <TableCell>Mã BN</TableCell>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Giờ hẹn</TableCell>
              <TableCell>Loại khám</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.patientId}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>
                  {appointment.appointmentDate.toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>{appointment.appointmentTime}</TableCell>
                <TableCell>{getTypeText(appointment.type)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(appointment.status)}
                    color={getStatusColor(appointment.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{appointment.notes}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenDialog(appointment)}
                    sx={{ color: '#115E59' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteAppointment(appointment.id)}
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
          {isEditMode ? 'Chỉnh sửa lịch hẹn' : 'Tạo lịch hẹn mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Tên bệnh nhân"
                value={selectedAppointment.patientName}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, patientName: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Mã bệnh nhân"
                value={selectedAppointment.patientId}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, patientId: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Bác sĩ"
                value={selectedAppointment.doctorName}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, doctorName: e.target.value })}
              />
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày hẹn"
                  value={selectedAppointment.appointmentDate}
                  onChange={(date) => setSelectedAppointment({ ...selectedAppointment, appointmentDate: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Giờ hẹn"
                value={selectedAppointment.appointmentTime}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, appointmentTime: e.target.value })}
              >
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Loại khám"
                value={selectedAppointment.type}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, type: e.target.value as 'regular' | 'urgent' | 'follow-up' })}
              >
                {appointmentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={selectedAppointment.status}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' | 'no-show' })}
              >
                {appointmentStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú"
                value={selectedAppointment.notes}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, notes: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveAppointment}
            variant="contained"
            sx={{ bgcolor: '#115E59', '&:hover': { bgcolor: '#0F766E' } }}
          >
            {isEditMode ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentManagement; 