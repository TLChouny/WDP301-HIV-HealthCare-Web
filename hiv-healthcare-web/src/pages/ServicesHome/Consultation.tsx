import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

const Consultation: React.FC = () => {
  const services = [
    {
      title: 'Tư vấn trước xét nghiệm',
      description: 'Cung cấp thông tin và giải đáp thắc mắc về HIV/AIDS, giúp bạn hiểu rõ về quy trình xét nghiệm và ý nghĩa của kết quả.',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Xét nghiệm HIV',
      description: 'Sử dụng các phương pháp xét nghiệm hiện đại, chính xác và bảo mật. Kết quả được trả trong thời gian ngắn nhất.',
      icon: <ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Tư vấn sau xét nghiệm',
      description: 'Hỗ trợ tâm lý và tư vấn về các bước tiếp theo dựa trên kết quả xét nghiệm của bạn.',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
  ];

  const benefits = [
    'Bảo mật thông tin tuyệt đối',
    'Không phân biệt đối xử',
    'Tư vấn viên chuyên nghiệp',
    'Kết quả nhanh chóng',
    'Chi phí hợp lý',
    'Hỗ trợ tâm lý toàn diện',
  ];

  const process = [
    {
      step: 1,
      title: 'Đăng ký tư vấn',
      description: 'Liên hệ với chúng tôi qua hotline hoặc đăng ký trực tuyến',
    },
    {
      step: 2,
      title: 'Tư vấn trước xét nghiệm',
      description: 'Gặp gỡ tư vấn viên để được giải đáp thắc mắc',
    },
    {
      step: 3,
      title: 'Thực hiện xét nghiệm',
      description: 'Quy trình xét nghiệm nhanh chóng, an toàn',
    },
    {
      step: 4,
      title: 'Nhận kết quả và tư vấn',
      description: 'Nhận kết quả và được tư vấn về các bước tiếp theo',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Tư vấn và Xét nghiệm HIV
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          Dịch vụ tư vấn và xét nghiệm HIV chuyên nghiệp, bảo mật và không phân biệt đối xử
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mr: 2 }}
        >
          Đặt lịch tư vấn
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
        >
          Tìm hiểu thêm
        </Button>
      </Box>

      {/* Services Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Dịch vụ của chúng tôi
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {services.map((service, index) => (
            <Card key={index} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {service.icon}
                <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                  {service.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Benefits Section */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Lợi ích khi sử dụng dịch vụ
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {benefits.map((benefit, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">{benefit}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Process Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Quy trình tư vấn và xét nghiệm
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {process.map((step, index) => (
            <Card key={index} sx={{ height: '100%' }}>
              <CardContent>
                <Typography
                  variant="h1"
                  color="primary"
                  sx={{ fontSize: '3rem', textAlign: 'center', mb: 2 }}
                >
                  {step.step}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Contact Section */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Liên hệ với chúng tôi
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Thời gian làm việc"
                  secondary="Thứ 2 - Thứ 7: 8:00 - 20:00"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Địa chỉ"
                  secondary="123 Đường ABC, Quận XYZ, TP.HCM"
                />
              </ListItem>
            </List>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              Hotline: 1900 1234
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
            >
              Email: support@hivcare.com
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Consultation; 