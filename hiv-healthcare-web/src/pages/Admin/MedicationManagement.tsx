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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface Medication {
  id: string;
  name: string;
  type: 'medicine' | 'supply';
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  price: number;
  manufacturer: string;
  expiryDate: string;
  status: 'available' | 'low' | 'out';
}

const initialMedication: Medication = {
  id: '',
  name: '',
  type: 'medicine',
  category: '',
  unit: '',
  quantity: 0,
  minQuantity: 10,
  price: 0,
  manufacturer: '',
  expiryDate: '',
  status: 'available',
};

const categories = [
  'Thuốc ARV',
  'Thuốc kháng sinh',
  'Thuốc giảm đau',
  'Thuốc kháng virus',
  'Vật tư y tế',
  'Dụng cụ y tế',
  'Vật tư tiêu hao',
];

const units = [
  'Viên',
  'Hộp',
  'Lọ',
  'Túi',
  'Cái',
  'Bộ',
  'Gói',
];

const MedicationManagement: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication>(initialMedication);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenDialog = (medication?: Medication) => {
    if (medication) {
      setSelectedMedication(medication);
      setIsEditMode(true);
    } else {
      setSelectedMedication(initialMedication);
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMedication(initialMedication);
  };

  const handleSaveMedication = () => {
    if (isEditMode) {
      setMedications(medications.map(m => m.id === selectedMedication.id ? selectedMedication : m));
    } else {
      const newMedication = {
        ...selectedMedication,
        id: Math.random().toString(36).substr(2, 9),
      };
      setMedications([...medications, newMedication]);
    }
    handleCloseDialog();
  };

  const handleDeleteMedication = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc/vật tư này?')) {
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'low':
        return 'warning';
      case 'out':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Còn hàng';
      case 'low':
        return 'Sắp hết';
      case 'out':
        return 'Hết hàng';
      default:
        return status;
    }
  };

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Quản lý thuốc và vật tư
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#115E59', '&:hover': { bgcolor: '#0F766E' } }}
        >
          Thêm mới
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm theo tên, danh mục hoặc nhà sản xuất..."
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
              <TableCell>Tên thuốc/vật tư</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Hạn sử dụng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>{medication.name}</TableCell>
                <TableCell>
                  {medication.type === 'medicine' ? 'Thuốc' : 'Vật tư'}
                </TableCell>
                <TableCell>{medication.category}</TableCell>
                <TableCell>{medication.quantity}</TableCell>
                <TableCell>{medication.unit}</TableCell>
                <TableCell>{medication.price.toLocaleString('vi-VN')} VNĐ</TableCell>
                <TableCell>{medication.expiryDate}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(medication.status)}
                    color={getStatusColor(medication.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenDialog(medication)}
                    sx={{ color: '#115E59' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteMedication(medication.id)}
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
          {isEditMode ? 'Chỉnh sửa thông tin thuốc/vật tư' : 'Thêm thuốc/vật tư mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Tên thuốc/vật tư"
                value={selectedMedication.name}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, name: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Loại"
                value={selectedMedication.type}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, type: e.target.value as 'medicine' | 'supply' })}
              >
                <MenuItem value="medicine">Thuốc</MenuItem>
                <MenuItem value="supply">Vật tư</MenuItem>
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Danh mục"
                value={selectedMedication.category}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Đơn vị"
                value={selectedMedication.unit}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, unit: e.target.value })}
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                type="number"
                label="Số lượng"
                value={selectedMedication.quantity}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, quantity: parseInt(e.target.value) || 0 })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                type="number"
                label="Số lượng tối thiểu"
                value={selectedMedication.minQuantity}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, minQuantity: parseInt(e.target.value) || 0 })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                type="number"
                label="Giá"
                value={selectedMedication.price}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, price: parseInt(e.target.value) || 0 })}
                InputProps={{ 
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Nhà sản xuất"
                value={selectedMedication.manufacturer}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, manufacturer: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                type="date"
                label="Hạn sử dụng"
                value={selectedMedication.expiryDate}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={selectedMedication.status}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, status: e.target.value as 'available' | 'low' | 'out' })}
              >
                <MenuItem value="available">Còn hàng</MenuItem>
                <MenuItem value="low">Sắp hết</MenuItem>
                <MenuItem value="out">Hết hàng</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveMedication}
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

export default MedicationManagement; 