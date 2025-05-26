import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-records-tabpanel-${index}`}
      aria-labelledby={`medical-records-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserMedicalRecords: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  // Mock data - replace with actual data from your backend
  const medicalRecords = [
    {
      id: 1,
      date: '15/03/2024',
      type: 'Khám định kỳ',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'Tình trạng ổn định',
      prescription: 'Tiếp tục uống thuốc ARV',
    },
    {
      id: 2,
      date: '01/03/2024',
      type: 'Xét nghiệm',
      doctor: 'BS. Lê Văn C',
      diagnosis: 'Kết quả xét nghiệm bình thường',
      prescription: 'Không cần điều chỉnh thuốc',
    },
  ];

  const testResults = [
    {
      id: 1,
      date: '15/03/2024',
      type: 'Xét nghiệm máu',
      doctor: 'BS. Trần Thị B',
      result: 'Bình thường',
      file: 'xet-nghiem-mau-15-03-2024.pdf',
    },
    {
      id: 2,
      date: '01/03/2024',
      type: 'Xét nghiệm CD4',
      doctor: 'BS. Lê Văn C',
      result: 'CD4: 500 tế bào/mm3',
      file: 'xet-nghiem-cd4-01-03-2024.pdf',
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleDownload = (file: string) => {
    // Implement download logic
    console.log('Download file:', file);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hồ sơ bệnh án
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Lịch sử khám" />
          <Tab label="Kết quả xét nghiệm" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewRecord(record)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Loại xét nghiệm</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Kết quả</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>{result.type}</TableCell>
                    <TableCell>{result.doctor}</TableCell>
                    <TableCell>{result.result}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewRecord(result)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(result.file)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Record Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedRecord?.type === 'Xét nghiệm máu' || selectedRecord?.type === 'Xét nghiệm CD4'
            ? 'Chi tiết kết quả xét nghiệm'
            : 'Chi tiết lịch sử khám'}
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ngày: {selectedRecord.date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Loại: {selectedRecord.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Bác sĩ: {selectedRecord.doctor}
              </Typography>
              {selectedRecord.diagnosis && (
                <Typography variant="subtitle1" gutterBottom>
                  Chẩn đoán: {selectedRecord.diagnosis}
                </Typography>
              )}
              {selectedRecord.prescription && (
                <Typography variant="subtitle1" gutterBottom>
                  Đơn thuốc: {selectedRecord.prescription}
                </Typography>
              )}
              {selectedRecord.result && (
                <Typography variant="subtitle1" gutterBottom>
                  Kết quả: {selectedRecord.result}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
          {selectedRecord?.file && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(selectedRecord.file)}
            >
              Tải xuống
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserMedicalRecords; 