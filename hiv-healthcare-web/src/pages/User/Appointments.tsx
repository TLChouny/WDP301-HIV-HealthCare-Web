import React from 'react';
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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [openNewDialog, setOpenNewDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null);

  // Mock data - replace with actual data from your backend
  const appointments = [
    {
      id: 1,
      date: '20/03/2024',
      time: '09:00',
      type: 'Khám định kỳ',
      doctor: 'BS. Trần Thị B',
      status: 'Đã xác nhận',
      notes: 'Khám định kỳ 3 tháng',
    },
    {
      id: 2,
      date: '25/03/2024',
      time: '14:30',
      type: 'Xét nghiệm',
      doctor: 'BS. Lê Văn C',
      status: 'Chờ xác nhận',
      notes: 'Xét nghiệm máu và CD4',
    },
  ];

  const appointmentTypes = [
    'Khám định kỳ',
    'Xét nghiệm',
    'Tư vấn',
    'Cấp thuốc',
  ];

  const doctors = [
    'BS. Trần Thị B',
    'BS. Lê Văn C',
    'BS. Nguyễn Văn D',
  ];

  const handleNewAppointment = () => {
    setOpenNewDialog(true);
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  const handleCancelAppointment = (id: number) => {
    // Implement cancel logic
    console.log('Cancel appointment:', id);
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
              <TableRow key={appointment.id}>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{appointment.doctor}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewAppointment(appointment)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {appointment.status === 'Chờ xác nhận' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleCancelAppointment(appointment.id)}
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

      {/* New Appointment Dialog */}
      <Dialog
        open={openNewDialog}
        onClose={() => setOpenNewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Đặt lịch mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Giờ"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Loại lịch hẹn"
                defaultValue=""
              >
                {appointmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Bác sĩ"
                defaultValue=""
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor} value={doctor}>
                    {doctor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Ghi chú"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => setOpenNewDialog(false)}>
            Đặt lịch
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Appointment Dialog */}
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
                Ngày: {selectedAppointment.date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Giờ: {selectedAppointment.time}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Loại: {selectedAppointment.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Bác sĩ: {selectedAppointment.doctor}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Trạng thái: {selectedAppointment.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ghi chú: {selectedAppointment.notes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
          {selectedAppointment?.status === 'Chờ xác nhận' && (
            <Button
              color="error"
              onClick={() => {
                handleCancelAppointment(selectedAppointment.id);
                setOpenViewDialog(false);
              }}
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