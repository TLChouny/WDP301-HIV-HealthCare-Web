import type React from "react"
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Chip,
  Avatar,
  Container,
  Fade,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import {
  Search,
  CheckCircle,
  Cancel,
  Person,
  School,
  Work,
  ExpandMore,
  PersonAdd, // Replaced UserCheck with PersonAdd
} from "@mui/icons-material"
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import { useAuth } from "../../context/AuthContext"
import type { User } from "../../types/user"
import { approveCertification, rejectCertification, approveExperience, rejectExperience } from "../../api/authApi"

const DoctorManagement: React.FC = () => {
  const { getAllUsers } = useAuth()
  const [doctors, setDoctors] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const users = await getAllUsers()
      const doctorUsers = users.filter((u) => u.role === "doctor")
      setDoctors(doctorUsers)
    } catch (err) {
      console.error("❌ Lỗi fetch doctors:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleVerifyCertification = async (doctorId: string, certId: string, status: "approved" | "rejected") => {
    try {
      if (status === "approved") {
        await approveCertification(doctorId, certId)
      } else {
        await rejectCertification(doctorId, certId)
      }
      await fetchDoctors()
    } catch (err) {
      console.error("❌ Lỗi verify certification:", err)
    }
  }

  const handleVerifyExperience = async (doctorId: string, expId: string, status: "approved" | "rejected") => {
    try {
      if (status === "approved") {
        await approveExperience(doctorId, expId)
      } else {
        await rejectExperience(doctorId, expId)
      }
      await fetchDoctors()
    } catch (err) {
      console.error("❌ Lỗi verify experience:", err)
    }
  }

  const filteredDoctors = doctors.filter((d) => d.userName.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatDate = (dateString: string | undefined) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "Chưa xác định"
  }

  const getStatusChip = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <Chip
            label="Đã duyệt"
            size="small"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontWeight: 600,
              border: "none",
            }}
          />
        )
      case "rejected":
        return (
          <Chip
            label="Từ chối"
            size="small"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              fontWeight: 600,
              border: "none",
            }}
          />
        )
      default:
        return (
          <Chip
            label="Chờ duyệt"
            size="small"
            sx={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
              fontWeight: 600,
              border: "none",
            }}
          />
        )
    }
  }

  const getPendingCount = (items?: Array<{ status?: string }>) => {
    return items?.filter((item) => !item.status || item.status === "pending").length || 0
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(60deg, #dbeafe 0%, #ffffff 50%, #f0fdfa 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              border: "4px solid #0d9488",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              mx: "auto",
              mb: 2,
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Typography sx={{ fontSize: "1.125rem", color: "#67707cff" }}>Đang tải dữ liệu...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(72deg, #dbeafe 0%, #ffffff 50%, #f0fdfa 100%)",
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                background: "linear-gradient(60deg, #0d9488 0%, #2563eb 100%)",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "16px"
              }}
            >
              <PersonAdd sx={{ color: "white", fontSize: 24 }} /> {/* Replaced UserCheck with PersonAdd */}
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1f2937",
                padding: "2px",
              }}
            >
              Quản lý bác sĩ
            </Typography>
          </Box>
          <Typography sx={{ color: "#6b7280",
             marginLeft: "16px"
           }}>
            Quản lý và xác minh thông tin chứng chỉ, kinh nghiệm của các bác sĩ
          </Typography>
        </Box>

        {/* Search */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm bác sĩ theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#0d9488" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "1.1rem",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#0d9488",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0d9488",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Content */}
        {filteredDoctors.length === 0 ? (
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#f3f4f6",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Person sx={{ fontSize: 32, color: "#9ca3af" }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: "#1f2937" }}>
                Không tìm thấy bác sĩ nào
              </Typography>
              <Typography sx={{ color: "#6b7280" }}>
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Chưa có bác sĩ nào trong hệ thống"}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {filteredDoctors.map((doctor, index) => {
              const pendingCerts = getPendingCount(doctor.certifications)
              const pendingExps = getPendingCount(doctor.experiences)
              const totalPending = pendingCerts + pendingExps

              return (
                <Fade in timeout={300 + index * 100} key={doctor._id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid #e5e7eb",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    {/* Doctor Header */}
                    <Box
                      sx={{
                        background: "linear-gradient(108deg, teal 100%, blue 100%)",
                        px: 4,
                        py: 3,
                        height: 120
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {doctor.avatar ? (
                            <Avatar
                              src={doctor.avatar}
                              alt={doctor.userName}
                              sx={{ width: 60, height: 60, borderRadius: 2, justifyContent: "center", alignItems: "center" }}
                            />
                          ) : (
                            <MedicalServicesIcon sx={{ color: "white", fontSize: 30 }} />
                          )
                          }
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: "white",
                              mb: 0.5,
                            }}
                          >
                            {doctor.userName}
                          </Typography>
                          <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>{doctor.userDescription}</Typography>
                          {totalPending > 0 && (
                            <Chip
                              label={`${totalPending} cần duyệt`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(251, 191, 36, 0.9)",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                      {/* Certifications Accordion */}
                      <Accordion
                        elevation={0}
                        sx={{
                          "&:before": { display: "none" },
                          "&.Mui-expanded": {
                            margin: 0,
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{
                            minHeight: 64,
                            px: 4,
                            py: 2,
                            borderBottom: "1px solid #f3f4f6",
                            "&.Mui-expanded": {
                              minHeight: 64,
                            },
                            "& .MuiAccordionSummary-content": {
                              margin: "12px 0",
                              "&.Mui-expanded": {
                                margin: "12px 0",
                              },
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#fef3c7",
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                              }}
                            >
                              <School sx={{ color: "#f59e0b", fontSize: 20 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                Chứng chỉ
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                {doctor.certifications?.length || 0} chứng chỉ
                              </Typography>
                            </Box>
                            {pendingCerts > 0 && (
                              <Chip
                                label={`${pendingCerts} chờ duyệt`}
                                size="small"
                                sx={{
                                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          {doctor.certifications && doctor.certifications.length > 0 ? (
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Tiêu đề</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Ngày cấp</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Tổ chức</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Thao tác</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {doctor.certifications.map((cert) => (
                                    <TableRow
                                      key={cert._id}
                                      sx={{
                                        "&:hover": { bgcolor: "#f9fafb" },
                                        transition: "background-color 0.2s ease",
                                      }}
                                    >
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {cert.title || "Không có tiêu đề"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                          {formatDate(cert.issueDate)}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                          {cert.issuer || "Chưa có tổ chức"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>{getStatusChip(cert.status)}</TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        {(cert.status === "pending" || !cert.status) && (
                                          <Box sx={{ display: "flex", gap: 1 }}>
                                            <Tooltip title="Duyệt chứng chỉ">
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleVerifyCertification(doctor._id, cert._id!, "approved")
                                                }
                                                sx={{
                                                  bgcolor: "rgba(16, 185, 129, 0.1)",
                                                  color: "#10b981",
                                                  "&:hover": {
                                                    bgcolor: "rgba(16, 185, 129, 0.2)",
                                                    transform: "scale(1.1)",
                                                  },
                                                  transition: "all 0.2s ease",
                                                }}
                                              >
                                                <CheckCircle fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Từ chối chứng chỉ">
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleVerifyCertification(doctor._id, cert._id!, "rejected")
                                                }
                                                sx={{
                                                  bgcolor: "rgba(239, 68, 68, 0.1)",
                                                  color: "#ef4444",
                                                  "&:hover": {
                                                    bgcolor: "rgba(239, 68, 68, 0.2)",
                                                    transform: "scale(1.1)",
                                                  },
                                                  transition: "all 0.2s ease",
                                                }}
                                              >
                                                <Cancel fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{ textAlign: "center", py: 6, px: 4 }}>
                              <School sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
                              <Typography sx={{ color: "#6b7280" }}>Chưa có chứng chỉ nào</Typography>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      {/* Experiences Accordion */}
                      <Accordion
                        elevation={0}
                        sx={{
                          "&:before": { display: "none" },
                          "&.Mui-expanded": {
                            margin: 0,
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{
                            minHeight: 64,
                            px: 4,
                            py: 2,
                            "&.Mui-expanded": {
                              minHeight: 64,
                            },
                            "& .MuiAccordionSummary-content": {
                              margin: "12px 0",
                              "&.Mui-expanded": {
                                margin: "12px 0",
                              },
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#dbeafe",
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                              }}
                            >
                              <Work sx={{ color: "#2563eb", fontSize: 20 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                Kinh nghiệm
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                {doctor.experiences?.length || 0} kinh nghiệm
                              </Typography>
                            </Box>
                            {pendingExps > 0 && (
                              <Chip
                                label={`${pendingExps} chờ duyệt`}
                                size="small"
                                sx={{
                                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          {doctor.experiences && doctor.experiences.length > 0 ? (
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Bệnh viện</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Vị trí</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Thời gian</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Thao tác</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {doctor.experiences.map((exp) => (
                                    <TableRow
                                      key={exp._id}
                                      sx={{
                                        "&:hover": { bgcolor: "#f9fafb" },
                                        transition: "background-color 0.2s ease",
                                      }}
                                    >
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {exp.hospital || "Chưa có thông tin"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                          {exp.position || "Chưa có thông tin"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                          {formatDate(exp.startDate)} -{" "}
                                          {exp.endDate ? formatDate(exp.endDate) : "Hiện tại"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>{getStatusChip(exp.status)}</TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        {(!exp.status || exp.status === "pending") && (
                                          <Box sx={{ display: "flex", gap: 1 }}>
                                            <Tooltip title="Duyệt kinh nghiệm">
                                              <IconButton
                                                size="small"
                                                onClick={() => handleVerifyExperience(doctor._id, exp._id!, "approved")}
                                                sx={{
                                                  bgcolor: "rgba(16, 185, 129, 0.1)",
                                                  color: "#10b981",
                                                  "&:hover": {
                                                    bgcolor: "rgba(16, 185, 129, 0.2)",
                                                    transform: "scale(1.1)",
                                                  },
                                                  transition: "all 0.2s ease",
                                                }}
                                              >
                                                <CheckCircle fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Từ chối kinh nghiệm">
                                              <IconButton
                                                size="small"
                                                onClick={() => handleVerifyExperience(doctor._id, exp._id!, "rejected")}
                                                sx={{
                                                  bgcolor: "rgba(239, 68, 68, 0.1)",
                                                  color: "#ef4444",
                                                  "&:hover": {
                                                    bgcolor: "rgba(239, 68, 68, 0.2)",
                                                    transform: "scale(1.1)",
                                                  },
                                                  transition: "all 0.2s ease",
                                                }}
                                              >
                                                <Cancel fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{ textAlign: "center", py: 6, px: 4 }}>
                              <Work sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
                              <Typography sx={{ color: "#6b7280" }}>Chưa có kinh nghiệm nào</Typography>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Fade>
              )
            })}
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export default DoctorManagement