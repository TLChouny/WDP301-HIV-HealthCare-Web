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
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [doctors, setDoctors] = useState<string[]>([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState<Booking | null>(null);

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

  const handleOpenPayment = (booking: Booking) => {
    setSelectedPaymentBooking(booking);
    setOpenPaymentDialog(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Lịch hẹn</Typography>
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
                  {appointment.status === 'pending' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ ml: 1 }}
                      onClick={() => handleOpenPayment(appointment)}
                    >
                      Thanh toán
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 2, background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, color: '#3b82f6', pb: 0 }}>
          Thanh toán dịch vụ
        </DialogTitle>
        <DialogContent>
          {selectedPaymentBooking && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1
              }}>
                <img
                  src={selectedPaymentBooking.serviceId?.serviceImage || '/default-service.png'}
                  alt="service"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b', textAlign: 'center' }}>
                {selectedPaymentBooking.serviceId?.serviceName || 'Không xác định'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', fontSize: 18 }}>
                Giá:&nbsp;
                <span style={{ color: '#ef4444', fontWeight: 700 }}>
                  {selectedPaymentBooking.serviceId?.price
                    ? Number(selectedPaymentBooking.serviceId.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                    : 'Không xác định'}
                </span>
              </Typography>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Ngày: <b>{new Date(selectedPaymentBooking.bookingDate).toLocaleDateString('vi-VN')}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Giờ: <b>{selectedPaymentBooking.startTime}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Bác sĩ: <b>{selectedPaymentBooking.doctorName}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Trạng thái: <b style={{ color: '#f59e42' }}>{selectedPaymentBooking.status}</b>
                </Typography>
              </Box>
              <Box sx={{ mt: 2, width: '100%', background: '#fff', borderRadius: 2, p: 2, boxShadow: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#3b82f6', fontWeight: 600, mb: 1 }}>
                  Hướng dẫn thanh toán
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  Vui lòng chuyển khoản đến số tài khoản <b>0123456789</b> tại ngân hàng <b>ABC Bank</b> với nội dung: <br />
                  <b>"Thanh toan {selectedPaymentBooking.serviceId?.serviceName || ''} - {selectedPaymentBooking.bookingCode || ''}"</b>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setOpenPaymentDialog(false)}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            Đóng
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 4, fontWeight: 700, boxShadow: 2, ml: 2, background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)' }}
            onClick={() => {/* Xử lý thanh toán thực tế ở đây nếu muốn */}}
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAppointments;