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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useServiceContext } from '../../context/ServiceContext';
import { usePaymentContext } from '../../context/PaymentContext';
import type { Booking } from '../../types/booking';

const UserAppointments: React.FC = () => {
  const navigate = useNavigate();
  const { getByUserId, remove } = useBooking();
  const { user } = useAuth();
  const { services } = useServiceContext();
  const { createPayment } = usePaymentContext();

  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState<Booking | null>(null);

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
    if (user?._id) fetchAppointments();
  }, [getByUserId, user]);

  const handleViewAppointment = (appointment: Booking) => {
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  //,,,,
  const handleCancelAppointment = async (id: string) => {
    try {
      await remove(id);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      setOpenViewDialog(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleOpenPayment = (booking: Booking) => {
    setSelectedPaymentBooking(booking);
    setOpenPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentBooking || !selectedPaymentBooking.serviceId) return;

    try {
      const payment = await createPayment({
        paymentID: `PAY-${Date.now()}`,
        orderCode: Number(selectedPaymentBooking.bookingCode || Date.now()),
        orderName: selectedPaymentBooking.serviceId.serviceName,
        amount: Number(selectedPaymentBooking.serviceId.price),
        description: `Thanh toán cho lịch hẹn #${selectedPaymentBooking.bookingCode}`,
        status: 'pending',
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
        bookingIds: [selectedPaymentBooking._id!],
      });

      if (payment.checkoutUrl) {
        window.open(payment.checkoutUrl, '_blank');
      } else {
        alert('Không thể tạo liên kết thanh toán.');
      }

      setOpenPaymentDialog(false);
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán:', error);
      alert('Tạo thanh toán thất bại.');
    }
  };

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh', py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3b82f6', letterSpacing: 1 }}>
          Lịch hẹn của bạn
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3, background: '#fff' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ngày</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Giờ</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Loại</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Bác sĩ</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Meeting Link</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id} sx={{ '&:hover': { background: '#f1f5f9' } }}>
                <TableCell>{new Date(appointment.bookingDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{appointment.startTime}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={appointment.serviceId?.serviceImage || '/default-service.png'}
                      alt="service"
                      style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <span style={{ fontWeight: 500 }}>{appointment.serviceId?.serviceName || 'Không xác định'}</span>
                  </Box>
                </TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                  <b>{appointment.meetLink || 'Không có'}</b>
                  </Typography>
                </TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontWeight: 600,
                    color: appointment.status === 'pending' ? '#f59e42' : '#22c55e',
                    background: appointment.status === 'pending' ? '#fef3c7' : '#dcfce7',
                    fontSize: 14,
                  }}>
                    {appointment.status === 'pending' ? 'Chờ xác nhận' : 'Đã xác nhận'}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewAppointment(appointment)}
                    sx={{ color: '#3b82f6', borderRadius: 2, mx: 0.5, background: '#e0e7ff', '&:hover': { background: '#c7d2fe' } }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {appointment.status === 'pending' && (
                    <>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancelAppointment(appointment._id!)}
                        sx={{ borderRadius: 2, mx: 0.5, background: '#fee2e2', '&:hover': { background: '#fecaca' } }}
                      >
                        <CancelIcon />
                      </IconButton>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        sx={{
                          ml: 1,
                          borderRadius: 2,
                          fontWeight: 600,
                          background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
                          boxShadow: 2,
                        }}
                        onClick={() => handleOpenPayment(appointment)}
                      >
                        Thanh toán
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 3, background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' } }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 24,
            color: '#3b82f6',
            pb: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <span role="img" aria-label="calendar" style={{ fontSize: 28 }}>📅</span>
          </Box>
          Chi tiết lịch hẹn
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b', textAlign: 'center' }}>
                {selectedAppointment.serviceId?.serviceName || 'Không xác định'}
              </Typography>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Ngày: <b>{new Date(selectedAppointment.bookingDate).toLocaleDateString('vi-VN')}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Giờ: <b>{selectedAppointment.startTime}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Bác sĩ: <b>{selectedAppointment.doctorName}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Meeting Link: <b>{selectedAppointment.meetLink}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Trạng thái: <b style={{ color: selectedAppointment.status === 'pending' ? '#f59e42' : '#22c55e' }}>{selectedAppointment.status}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Ghi chú: <b>{selectedAppointment.notes || 'Không có'}</b>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setOpenViewDialog(false)}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            Đóng
          </Button>
          {selectedAppointment?.status === 'pending' && (
            <Button
              color="error"
              variant="contained"
              sx={{ borderRadius: 2, px: 4, fontWeight: 700, ml: 2 }}
              onClick={() => handleCancelAppointment(selectedAppointment._id!)}
            >
              Hủy lịch
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 2, background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' } }}
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
                  Meeting Link: <b>{selectedPaymentBooking.meetLink || 'Không có'}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Trạng thái: <b style={{ color: '#f59e42' }}>{selectedPaymentBooking.status}</b>
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
            onClick={handleConfirmPayment}
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAppointments;
