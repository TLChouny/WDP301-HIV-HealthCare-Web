import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { LocalHospital, Science, Assignment } from '@mui/icons-material';

const HIVHistory: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const testHistory = [
    {
      date: '15/03/2024',
      type: 'Xét nghiệm định kỳ',
      cd4Count: 650,
      viralLoad: 'Undetectable',
      status: 'Tốt',
      doctor: 'BS. Nguyễn Văn A',
      notes: 'Bệnh nhân đáp ứng tốt với điều trị',
    },
    {
      date: '15/12/2023',
      type: 'Xét nghiệm định kỳ',
      cd4Count: 580,
      viralLoad: 'Undetectable',
      status: 'Tốt',
      doctor: 'BS. Nguyễn Văn A',
      notes: 'Tiếp tục duy trì điều trị',
    },
    {
      date: '15/09/2023',
      type: 'Xét nghiệm định kỳ',
      cd4Count: 520,
      viralLoad: 'Undetectable',
      status: 'Tốt',
      doctor: 'BS. Nguyễn Văn A',
      notes: 'Đáp ứng tốt với điều trị',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tốt':
        return 'success';
      case 'Cần theo dõi':
        return 'warning';
      case 'Cần can thiệp':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lịch sử khám HIV
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chỉ số CD4 mới nhất
              </Typography>
              <Typography variant="h4" color="primary">
                {testHistory[0].cd4Count}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                cells/mm³
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tải lượng virus
              </Typography>
              <Typography variant="h4" color="primary">
                {testHistory[0].viralLoad}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                copies/mL
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tình trạng hiện tại
              </Typography>
              <Chip
                label={testHistory[0].status}
                color={getStatusColor(testHistory[0].status) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Timeline View */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tiến trình điều trị
        </Typography>
        <Timeline>
          {testHistory.map((test, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={getStatusColor(test.status) as any}>
                  <Science />
                </TimelineDot>
                {index < testHistory.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1">
                  {test.date} - {test.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CD4: {test.cd4Count} cells/mm³ | Viral Load: {test.viralLoad}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bác sĩ: {test.doctor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ghi chú: {test.notes}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      {/* Detailed Table View */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chi tiết lịch sử xét nghiệm
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Loại xét nghiệm</TableCell>
                <TableCell>CD4</TableCell>
                <TableCell>Tải lượng virus</TableCell>
                <TableCell>Tình trạng</TableCell>
                <TableCell>Bác sĩ</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testHistory.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>{test.type}</TableCell>
                  <TableCell>{test.cd4Count}</TableCell>
                  <TableCell>{test.viralLoad}</TableCell>
                  <TableCell>
                    <Chip
                      label={test.status}
                      color={getStatusColor(test.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{test.doctor}</TableCell>
                  <TableCell>{test.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default HIVHistory; 