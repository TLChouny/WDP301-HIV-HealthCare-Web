import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Science as ScienceIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedUserIcon,
  Speed as SpeedIcon,
  FilterList as FilterListIcon,
  LocalHospital as HospitalIcon,
  PriceCheck as PriceCheckIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const StyledGrid = styled(Box)(({ theme }) => ({
  // Add any custom styles here
}));

const Testing: React.FC = () => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    type: 'all',
    price: 'all',
    duration: 'all',
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [testRef, testInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [packageRef, packageInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const individualTests = [
    {
      id: 1,
      title: 'Xét nghiệm HIV nhanh',
      description: 'Kết quả trong vòng 15-20 phút',
      price: '150.000đ',
      duration: '15-20 phút',
      type: 'quick',
    },
    {
      id: 2,
      title: 'Xét nghiệm HIV Elisa',
      description: 'Xét nghiệm chính xác cao, phát hiện kháng thể HIV',
      price: '250.000đ',
      duration: '1-2 ngày',
      type: 'standard',
    },
    {
      id: 3,
      title: 'Xét nghiệm HIV Western Blot',
      description: 'Xét nghiệm xác nhận kết quả dương tính',
      price: '500.000đ',
      duration: '2-3 ngày',
      type: 'confirm',
    },
  ];

  const testPackages = [
    {
      id: 1,
      title: 'Gói xét nghiệm cơ bản',
      description: 'Bao gồm xét nghiệm HIV nhanh và tư vấn',
      price: '300.000đ',
      duration: '30 phút',
      tests: ['Xét nghiệm HIV nhanh', 'Tư vấn trước và sau xét nghiệm'],
      type: 'basic',
    },
    {
      id: 2,
      title: 'Gói xét nghiệm toàn diện',
      description: 'Bao gồm các xét nghiệm HIV và các bệnh lây truyền qua đường tình dục',
      price: '1.500.000đ',
      duration: '1-2 ngày',
      tests: [
        'Xét nghiệm HIV Elisa',
        'Xét nghiệm các bệnh lây truyền qua đường tình dục',
        'Tư vấn chuyên sâu',
      ],
      type: 'comprehensive',
    },
    {
      id: 3,
      title: 'Gói xét nghiệm định kỳ',
      description: 'Theo dõi sức khỏe định kỳ cho người nhiễm HIV',
      price: '2.000.000đ',
      duration: '2-3 ngày',
      tests: [
        'Xét nghiệm HIV Western Blot',
        'Xét nghiệm tải lượng virus',
        'Xét nghiệm tế bào CD4',
        'Tư vấn điều trị',
      ],
      type: 'monitoring',
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredTests = [...individualTests, ...testPackages].filter(test => {
    if (filters.type !== 'all' && test.type !== filters.type) return false;
    if (filters.price !== 'all') {
      const price = parseInt(test.price.replace(/[^\d]/g, ''));
      if (filters.price === 'low' && price > 300000) return false;
      if (filters.price === 'medium' && (price <= 300000 || price > 1000000)) return false;
      if (filters.price === 'high' && price <= 1000000) return false;
    }
    if (filters.duration !== 'all') {
      if (filters.duration === 'quick' && !test.duration.includes('phút')) return false;
      if (filters.duration === 'standard' && !test.duration.includes('ngày')) return false;
    }
    return true;
  });

  const stats = [
    { number: 99, suffix: '%', label: 'Độ chính xác' },
    { number: 15, suffix: ' phút', label: 'Kết quả nhanh nhất' },
    { number: 1000, suffix: '+', label: 'Khách hàng hài lòng' },
    { number: 24, suffix: '/7', label: 'Hỗ trợ tư vấn' },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box>
      {/* Hero Section with Parallax Effect */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/testing-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <MotionTypography
            variant="h2"
            gutterBottom
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Xét nghiệm HIV
          </MotionTypography>
          <MotionTypography
            variant="h5"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Dịch vụ xét nghiệm HIV chuyên nghiệp, bảo mật và không phân biệt đối xử
          </MotionTypography>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                mr: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
              startIcon={<CalendarIcon />}
            >
              Đặt lịch xét nghiệm
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Tìm hiểu thêm
            </Button>
          </MotionBox>
        </Container>
      </MotionBox>

      {/* Stats Section */}
      <Box
        ref={statsRef}
        sx={{
          py: 6,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ textAlign: 'center' }}
              >
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  <CountUp
                    end={stat.number}
                    suffix={stat.suffix}
                    duration={2.5}
                    enableScrollSpy
                  />
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </MotionBox>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Filter Section with Animation */}
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 2,
              background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              <FilterListIcon /> Bộ lọc xét nghiệm
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Loại xét nghiệm</InputLabel>
                <Select
                  value={filters.type}
                  label="Loại xét nghiệm"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="quick">Xét nghiệm nhanh</MenuItem>
                  <MenuItem value="standard">Xét nghiệm tiêu chuẩn</MenuItem>
                  <MenuItem value="confirm">Xét nghiệm xác nhận</MenuItem>
                  <MenuItem value="basic">Gói cơ bản</MenuItem>
                  <MenuItem value="comprehensive">Gói toàn diện</MenuItem>
                  <MenuItem value="monitoring">Gói định kỳ</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Khoảng giá</InputLabel>
                <Select
                  value={filters.price}
                  label="Khoảng giá"
                  onChange={(e) => handleFilterChange('price', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="low">Dưới 300.000đ</MenuItem>
                  <MenuItem value="medium">300.000đ - 1.000.000đ</MenuItem>
                  <MenuItem value="high">Trên 1.000.000đ</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Thời gian</InputLabel>
                <Select
                  value={filters.duration}
                  label="Thời gian"
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="quick">Kết quả nhanh (dưới 1 giờ)</MenuItem>
                  <MenuItem value="standard">Kết quả tiêu chuẩn (1-3 ngày)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </MotionBox>

        {/* Individual Tests Section with Carousel */}
        <Box ref={testRef} sx={{ mb: 8 }}>
          <MotionTypography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ mb: 4, fontWeight: 600 }}
            initial={{ opacity: 0, y: 20 }}
            animate={testInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Xét nghiệm đơn lẻ
          </MotionTypography>
          <Slider {...sliderSettings}>
            {individualTests.map((test) => (
              <Box key={test.id} sx={{ px: 1 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={testInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {test.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                      sx={{ minHeight: '3em' }}
                    >
                      {test.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        icon={<PriceCheckIcon />}
                        label={test.price}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={test.duration}
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Stack>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                      }}
                    >
                      Đặt lịch
                    </Button>
                  </CardContent>
                </MotionCard>
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Test Packages Section */}
        <Box ref={packageRef} sx={{ mb: 8 }}>
          <MotionTypography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ mb: 4, fontWeight: 600 }}
            initial={{ opacity: 0, y: 20 }}
            animate={packageInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Gói xét nghiệm
          </MotionTypography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {testPackages.map((pkg, index) => (
              <MotionCard
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={packageInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'primary.main' }}
                  >
                    {pkg.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{ minHeight: '3em' }}
                  >
                    {pkg.description}
                  </Typography>
                  <List dense>
                    {pkg.tests.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={test} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<PriceCheckIcon />}
                      label={pkg.price}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={pkg.duration}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    Đặt lịch
                  </Button>
                </CardContent>
              </MotionCard>
            ))}
          </Box>
        </Box>

        {/* Contact Section with Gradient Background */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ mb: 4, fontWeight: 600 }}
          >
            Liên hệ đặt lịch
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
                sx={{
                  mr: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Hotline: 1900 1234
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Email: testing@hivcare.com
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Testing; 