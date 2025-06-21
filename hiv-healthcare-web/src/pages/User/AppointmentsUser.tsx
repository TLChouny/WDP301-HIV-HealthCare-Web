import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../types/booking';
import axios from 'axios';

interface ServiceResponse {
  _id: string;
  serviceName: string;
  serviceDescription: string;
  categoryId: string;
  serviceImage: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const UserAppointments: React.FC = () => {
  const navigate = useNavigate();
  const { getByUserId, create, remove } = useBooking();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [doctors, setDoctors] = useState<string[]>([]);
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    bookingDate: '',
    startTime: '',
    serviceId: undefined,
    doctorName: '',
    notes: '',
    status: 'pending',
    customerName: user?.userName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone_number || '',
    currency: 'VND',
    isAnonymous: false,
    userId: user?._id || null,
  });

  // Lấy danh sách dịch vụ và bác sĩ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://your-api-endpoint/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();

    // Mock danh sách bác sĩ (thay bằng API nếu có)
    setDoctors(['BS. Trần Thị B', 'BS. Lê Văn C', 'BS. Nguyễn Văn D']);
  }, []);

  // Lấy danh sách bookings theo userId
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?._id) {
          const userBookings = await getByUserId(user._id);
          setAppointments(userBookings);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    if (user?._id) {
      fetchAppointments();
    }
  }, [getByUserId, user]);

  const handleNewAppointment = () => {
    setOpenNewDialog(true);
  };

  const handleViewAppointment = (appointment: Booking) => {
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await remove(id);
      setAppointments(appointments.filter((appt) => appt._id !== id));
      setOpenViewDialog(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const createdBooking = await create(newBooking);
      setAppointments([...appointments, createdBooking]);
      setOpenNewDialog(false);
      setNewBooking({
        bookingDate: '',
        startTime: '',
        serviceId: undefined,
        doctorName: '',
        notes: '',
        status: 'pending',
        customerName: user?.userName || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone_number || '',
        currency: 'VND',
        isAnonymous: false,
        userId: user?._id || null,
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'serviceId') {
      const selectedService = services.find((service) => service._id === value);
      setNewBooking({
        ...newBooking,
        serviceId: selectedService
          ? {
              ...selectedService,
              price: selectedService.price.toString(),
            }
          : undefined,
      });
    } else {
      setNewBooking({ ...newBooking, [name]: value });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Lịch hẹn</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewAppointment}
        >
          Đặt lịch mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{new Date(appointment.bookingDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{appointment.startTime}</TableCell>
                <TableCell>{appointment.serviceId?.serviceName || 'Không xác định'}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewAppointment(appointment)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {appointment.status === 'pending' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleCancelAppointment(appointment._id!)}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openNewDialog}
        onClose={() => setOpenNewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Đặt lịch mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                type="date"
                label="Ngày"
                name="bookingDate"
                value={newBooking.bookingDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                type="time"
                label="Giờ"
                name="startTime"
                value={newBooking.startTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Loại lịch hẹn"
                name="serviceId"
                value={newBooking.serviceId?._id || ''}
                onChange={handleInputChange}
              >
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.serviceName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Bác sĩ"
                name="doctorName"
                value={newBooking.doctorName}
                onChange={handleInputChange}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor} value={doctor}>
                    {doctor}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Ghi chú"
                name="notes"
                value={newBooking.notes}
                onChange={handleInputChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateBooking}>
            Đ_lambda
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ngày: {new Date(selectedAppointment.bookingDate).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Giờ: {selectedAppointment.startTime}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Loại: {selectedAppointment.serviceId?.serviceName || 'Không xác định'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Bác sĩ: {selectedAppointment.doctorName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Trạng thái: {selectedAppointment.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ghi chú: {selectedAppointment.notes || 'Không có'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
          {selectedAppointment?.status === 'pending' && (
            <Button
              color="error"
              onClick={() => handleCancelAppointment(selectedAppointment._id!)}
            >
              Hủy lịch
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAppointments;