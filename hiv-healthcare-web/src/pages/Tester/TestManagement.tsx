import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  CalendarClock,
  Search,
  Loader,
  AlertTriangle,
  Stethoscope,
  CreditCard,
  Calendar,
  Clock,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { translateBookingStatus } from "../../utils/status";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarComponent from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Booking } from "../../types/booking";
import { useBooking } from "../../context/BookingContext";
import { useArv } from "../../context/ArvContext";
import { useResult } from "../../context/ResultContext";
import { useAuth } from "../../context/AuthContext";

// Hàm so sánh ngày theo local
const isSameDayLocal = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Hàm parse ngày
const parseBookingDateLocal = (dateStr: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    const [datePart] = dateStr.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
};

// Component hiển thị trạng thái
const StatusButton: React.FC<{
  status: string;
  bookingId?: string;
  onStatusChange: (bookingId: string, newStatus: Booking["status"]) => void;
  isOnlineConsultation?: boolean;
  userRole?: string;
  serviceName?: string;
}> = ({
  status,
  bookingId,
  onStatusChange,
  isOnlineConsultation = false,
  userRole = "user",
  serviceName = "",
}) => {
    if (!bookingId) {
      return (
        <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Lỗi: Không có ID
        </span>
      );
    }

    // Nếu đã có kết quả hoặc trạng thái đặc biệt thì chỉ hiển thị trạng thái hiện tại
    if (
      [
        "re-examination",
        "checked-in",
        "completed",
        "cancelled",
        "confirmed",
        "paid",
      ].includes(status)
    ) {
      const statusStyles: { [key: string]: string } = {
        "checked-in": "bg-green-100 text-green-700 border-green-200",
        cancelled: "bg-red-100 text-red-700 border-red-200",
        completed: "bg-purple-100 text-purple-700 border-purple-200",
        confirmed: "bg-blue-100 text-blue-700 border-blue-200",
        paid: "bg-orange-100 text-orange-700 border-orange-200",
        "re-examination": "bg-purple-100 text-purple-700 border-purple-200",
      };
      const getStatusIcon = (s: string) => {
        switch (s) {
          case "checked-in":
          case "completed":
            return <CheckCircle2 className="w-4 h-4 mr-2" />;
          case "pending":
            return <Clock className="w-4 h-4 mr-2" />;
          case "cancelled":
            return <XCircle className="w-4 h-4 mr-2" />;
          case "confirmed":
            return <CheckCircle2 className="w-4 h-4 mr-2" />;
          case "paid":
            return <CreditCard className="w-4 h-4 mr-2" />;
          case "re-examination":
            return <RefreshCcw className="w-4 h-4 mr-2" />;
          default:
            return null;
        }
      };
      return (
        <span
          className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"
            }`}
        >
          {getStatusIcon(status)}
          {translateBookingStatus(status)}
        </span>
      );
    }

    // Chỉ doctor được phép cập nhật status từ "pending" sang "completed" cho "Tư vấn trực tuyến"
    if (userRole === "doctor" && status === "pending" && isOnlineConsultation) {
      return (
        <div
          onClick={() => onStatusChange(bookingId, "completed")}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-black hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Hoàn thành
        </div>
      );
    }

    if (
      (userRole === "doctor" || status === "checked-out") &&
      status !== "completed"
    ) {
      return (
        <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Điểm danh
        </span>
      );
    }
  };

const TestManagement: React.FC = () => {
  // CD4 specific fields
  const [cd4Count, setCd4Count] = useState("");
  const [cd4Reference, setCd4Reference] = useState("");
  const [cd4Interpretation, setCd4Interpretation] = useState("");

  // ...existing code...
  const [reExaminationDate, setReExaminationDate] = useState("");
  const { getAll, update } = useBooking();
  const { regimens, create: createArv } = useArv();
  const { addResult, results } = useResult();
  const { user, getUserById } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMedicalModal, setOpenMedicalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  // Tự động cập nhật diễn giải CD4 khi nhập số lượng tế bào CD4
  useEffect(() => {
    if (
      selectedBooking &&
      typeof selectedBooking.serviceId === "object" &&
      selectedBooking.serviceId.serviceName === "Xét nghiệm CD4"
    ) {
      const cd4 = cd4Count ? Number.parseFloat(cd4Count) : undefined;
      if (cd4 === undefined || isNaN(cd4)) {
        setCd4Interpretation("");
        setCd4Reference(">500 cells/mm³");
      } else if (cd4 >= 500) {
        setCd4Interpretation("normal");
        setCd4Reference(">500 cells/mm³");
      } else if (cd4 >= 200) {
        setCd4Interpretation("low");
        setCd4Reference("200-499 cells/mm³");
      } else {
        setCd4Interpretation("very_low");
        setCd4Reference("<200 cells/mm³");
      }
    }
  }, [cd4Count, selectedBooking]);

  // State for Result fields
  const [medicalDate, setMedicalDate] = useState("");
  const [medicalType, setMedicalType] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [arvRegimen, setArvRegimen] = useState("");
  const [hivLoad, setHivLoad] = useState("");
  const [medicationTime, setMedicationTime] = useState("");
  const [medicationTimes, setMedicationTimes] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [pulse, setPulse] = useState("");
  const [temperature, setTemperature] = useState("");
  const [sampleType, setSampleType] = useState("");
  const [testMethod, setTestMethod] = useState("");
  const [resultType, setResultType] = useState<
    "positive-negative" | "quantitative" | "other" | ""
  >("");
  const [testResult, setTestResult] = useState<
    "positive" | "negative" | "invalid" | ""
  >("");
  const [testValue, setTestValue] = useState("");
  const [unit, setUnit] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [medicationSlot, setMedicationSlot] = useState("");
  const [regimenCode, setRegimenCode] = useState("");
  // PCR HIV specific fields
  const [viralLoad, setViralLoad] = useState("");
  const [viralLoadReference, setViralLoadReference] = useState("");
  const [viralLoadInterpretation, setViralLoadInterpretation] = useState("");

  // Tự động cập nhật diễn giải VL khi nhập tải lượng virus
  useEffect(() => {
    if (
      selectedBooking &&
      typeof selectedBooking.serviceId === "object" &&
      selectedBooking.serviceId.serviceName === "Xét nghiệm HIV NAT (PCR)"
    ) {
      const vl = viralLoad ? Number.parseFloat(viralLoad) : undefined;
      if (vl === undefined || isNaN(vl)) {
        setViralLoadInterpretation("");
        setViralLoadReference("<20 copies/mL");
      } else if (vl < 20) {
        setViralLoadInterpretation("undetectable");
        setViralLoadReference("<20 copies/mL");
      } else if (vl < 1000) {
        setViralLoadInterpretation("low");
        setViralLoadReference("20-999 copies/mL");
      } else {
        setViralLoadInterpretation("high");
        setViralLoadReference("≥1000 copies/mL");
      }
    }
  }, [viralLoad, selectedBooking]);
  // Thêm trường mô tả kết quả
  const [resultDescription, setResultDescription] = useState("");
  // Thêm trường tên người thực hiện xét nghiệm
  const [testerName, setTesterName] = useState("");
  // Thêm trường tên kết quả
  const [resultName, setResultName] = useState("");
  const [treatmentLine, setTreatmentLine] = useState<
    "First-line" | "Second-line" | "Third-line" | ""
  >("");
  const [recommendedFor, setRecommendedFor] = useState("");
  const [drugs, setDrugs] = useState<string[]>([]);
  const [dosages, setDosages] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);
  const [contraindications, setContraindications] = useState<string[]>([]);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  // HIV Combo (Ag/Ab) specific fields
  const [p24Antigen, setP24Antigen] = useState("");
  const [hivAntibody, setHivAntibody] = useState("");
  const [comboInterpretation, setComboInterpretation] = useState("");
  
  // Tự động cập nhật diễn giải HIV Combo khi nhập p24 Antigen và HIV Antibody
  useEffect(() => {
    if (
      selectedBooking &&
      typeof selectedBooking.serviceId === "object" &&
      selectedBooking.serviceId.serviceName === "Xét nghiệm HIV Combo (Ag/Ab)"
    ) {
      if (p24Antigen !== "" && hivAntibody !== "") {
        const p24Value = Number.parseFloat(p24Antigen);
        const antibodyValue = Number.parseFloat(hivAntibody);
        
        if (isNaN(p24Value) || isNaN(antibodyValue)) {
          setComboInterpretation("");
          return;
        }
        
        const isP24Positive = p24Value > 1;
        const isAntibodyPositive = antibodyValue > 1;
        
        if (!isP24Positive && !isAntibodyPositive) {
          setComboInterpretation("Âm tính (độ tin cậy cao nếu sau 4–6 tuần)");
        } else if (isP24Positive && !isAntibodyPositive) {
          setComboInterpretation("Nghi ngờ nhiễm HIV giai đoạn rất sớm");
        } else if (!isP24Positive && isAntibodyPositive) {
          setComboInterpretation("Nghi ngờ nhiễm HIV (giai đoạn sau cửa sổ)");
        } else if (isP24Positive && isAntibodyPositive) {
          setComboInterpretation("Khả năng cao nhiễm HIV");
        }
      } else {
        setComboInterpretation("");
      }
    }
  }, [p24Antigen, hivAntibody, selectedBooking]);
  const [medicalRecordSent, setMedicalRecordSent] = useState<{
    [bookingId: string]: boolean;
  }>({});
  const [selectedStatusForSubmit, setSelectedStatusForSubmit] = useState<
    "re-examination" | "completed" | null
  >(null);

  // State cho validation errors
  const [validationErrors, setValidationErrors] = useState({
    weight: "",
    height: "",
    bloodPressure: "",
    pulse: "",
    temperature: ""
  });

  const hasResult =
    selectedBooking &&
    results.some((r) => r.bookingId && r.bookingId._id === selectedBooking._id);
  // Chỉ lấy ngày của các booking là xét nghiệm labo (isLabTest = true)
  const bookingDates = useMemo(
    () =>
      bookings
        .filter(
          (b) =>
            typeof b.serviceId === "object" && b.serviceId.isLabTest === true
        )
        .map((b) => parseBookingDateLocal(b.bookingDate)),
    [bookings]
  );

  // ...existing code...

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const weightNum = Number.parseFloat(weight);
      const heightNum = Number.parseFloat(height) / 100;
      if (weightNum > 0 && heightNum > 0) {
        const calculatedBmi = (weightNum / (heightNum * heightNum)).toFixed(2);
        setBmi(calculatedBmi);
      } else {
        setBmi("");
      }
    } else {
      setBmi("");
    }
  }, [weight, height]);

  // Populate ARV fields when a regimen is selected
  useEffect(() => {
    if (arvRegimen) {
      const selectedRegimen = regimens.find((r) => r.arvName === arvRegimen);
      if (selectedRegimen) {
        setRegimenCode(selectedRegimen.regimenCode || "");
        setTreatmentLine(selectedRegimen.treatmentLine || "");
        setRecommendedFor(selectedRegimen.recommendedFor || "");
        setDrugs(selectedRegimen.drugs || []);
        setDosages(selectedRegimen.dosages || []);
        setFrequencies(
          selectedRegimen.frequency ? selectedRegimen.frequency.split(";") : []
        );
        setContraindications(selectedRegimen.contraindications || []);
        setSideEffects(selectedRegimen.sideEffects || []);
      }
    } else {
      setRegimenCode("");
      setTreatmentLine("");
      setRecommendedFor("");
      setDrugs([]);
      setDosages([]);
      setFrequencies([]);
      setContraindications([]);
      setSideEffects([]);
    }
  }, [arvRegimen, regimens]);

  const anonymizeName = useCallback((name: string): string => {
    if (!name) return "Không xác định";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0) + "*".repeat(words[0].length - 1);
    }
    return (
      words[0].charAt(0) +
      "*".repeat(words[0].length - 1) +
      " " +
      words[words.length - 1].charAt(0) +
      "*".repeat(words[words.length - 1].length - 1)
    );
  }, []);

  const getPatientDisplayInfo = useCallback(
    (booking: Booking) => {
      const isAnonymous = booking.isAnonymous;
      if (isAnonymous) {
        return {
          name: anonymizeName(booking.customerName || ""),
          phone: "***-***-****",
          email: "***@***.***",
          doctorName: booking.doctorName || "",
        };
      }
      return {
        name: booking.customerName || "Không xác định",
        phone: booking.customerPhone || "Không có",
        email: booking.customerEmail || "Không có",
        doctorName: booking.doctorName || "Chưa phân công",
      };
    },
    [anonymizeName]
  );

  // Hàm validation cho các trường input
  const validateExamInfo = () => {
    const errors = {
      weight: "",
      height: "",
      bloodPressure: "",
      pulse: "",
      temperature: ""
    };

    // Validate cân nặng
    if (weight && Number(weight) < 0) {
      errors.weight = "Cân nặng không được là số âm";
    } else if (weight && (Number(weight) < 2 || Number(weight) > 300)) {
      errors.weight = "Cân nặng phải từ 2 đến 300 kg";
    }

    // Validate chiều cao  
    if (height && Number(height) < 0) {
      errors.height = "Chiều cao không được là số âm";
    } else if (height && (Number(height) < 30 || Number(height) > 250)) {
      errors.height = "Chiều cao phải từ 30 đến 250 cm";
    }

    // Validate huyết áp
    if (bloodPressure) {
      const bpMatch = bloodPressure.match(/^(\d{2,3})\/(\d{2,3})$/);
      if (!bpMatch) {
        errors.bloodPressure = "Huyết áp phải đúng định dạng: số trên/số dưới (ví dụ: 120/80)";
      } else {
        const systolic = Number(bpMatch[1]);
        const diastolic = Number(bpMatch[2]);
        if (systolic < 0 || diastolic < 0) {
          errors.bloodPressure = "Huyết áp không được là số âm";
        } else if (
          systolic < 60 || systolic > 300 ||
          diastolic < 30 || diastolic > 200
        ) {
          errors.bloodPressure = "Huyết áp không hợp lệ. Số trên: 60-300, số dưới: 30-200";
        }
      }
    }

    // Validate mạch
    if (pulse && Number(pulse) < 0) {
      errors.pulse = "Mạch không được là số âm";
    } else if (pulse && (Number(pulse) < 30 || Number(pulse) > 220)) {
      errors.pulse = "Mạch phải từ 30 đến 220 lần/phút";
    }

    // Validate nhiệt độ (cho cơ thể con người)
    if (temperature && Number(temperature) < 0) {
      errors.temperature = "Nhiệt độ không được là số âm";
    } else if (temperature && (Number(temperature) < 35 || Number(temperature) > 42)) {
      errors.temperature = "Nhiệt độ cơ thể phải từ 35°C đến 42°C";
    }

    setValidationErrors(errors);
    return Object.values(errors).every(error => error === "");
  };

  // Hàm xử lý thay đổi input với validation
  const handleWeightChange = (value: string) => {
    setWeight(value);
    if (value && Number(value) < 0) {
      setValidationErrors(prev => ({ ...prev, weight: "Cân nặng không được là số âm" }));
    } else if (value && (Number(value) < 2 || Number(value) > 300)) {
      setValidationErrors(prev => ({ ...prev, weight: "Cân nặng phải từ 2 đến 300 kg" }));
    } else {
      setValidationErrors(prev => ({ ...prev, weight: "" }));
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (value && Number(value) < 0) {
      setValidationErrors(prev => ({ ...prev, height: "Chiều cao không được là số âm" }));
    } else if (value && (Number(value) < 30 || Number(value) > 250)) {
      setValidationErrors(prev => ({ ...prev, height: "Chiều cao phải từ 30 đến 250 cm" }));
    } else {
      setValidationErrors(prev => ({ ...prev, height: "" }));
    }
  };

  const handleBloodPressureChange = (value: string) => {
    setBloodPressure(value);
    if (value) {
      const bpMatch = value.match(/^(\d{2,3})\/(\d{2,3})$/);
      if (!bpMatch) {
        setValidationErrors(prev => ({ ...prev, bloodPressure: "Huyết áp phải đúng định dạng: số trên/số dưới (ví dụ: 120/80)" }));
      } else {
        const systolic = Number(bpMatch[1]);
        const diastolic = Number(bpMatch[2]);
        if (systolic < 0 || diastolic < 0) {
          setValidationErrors(prev => ({ ...prev, bloodPressure: "Huyết áp không được là số âm" }));
        } else if (
          systolic < 60 || systolic > 300 ||
          diastolic < 30 || diastolic > 200
        ) {
          setValidationErrors(prev => ({ ...prev, bloodPressure: "Huyết áp không hợp lệ. Số trên: 60-300, số dưới: 30-200" }));
        } else {
          setValidationErrors(prev => ({ ...prev, bloodPressure: "" }));
        }
      }
    } else {
      setValidationErrors(prev => ({ ...prev, bloodPressure: "" }));
    }
  };

  const handlePulseChange = (value: string) => {
    setPulse(value);
    if (value && Number(value) < 0) {
      setValidationErrors(prev => ({ ...prev, pulse: "Mạch không được là số âm" }));
    } else if (value && (Number(value) < 30 || Number(value) > 220)) {
      setValidationErrors(prev => ({ ...prev, pulse: "Mạch phải từ 30 đến 220 lần/phút" }));
    } else {
      setValidationErrors(prev => ({ ...prev, pulse: "" }));
    }
  };

  const handleTemperatureChange = (value: string) => {
    setTemperature(value);
    if (value && Number(value) < 0) {
      setValidationErrors(prev => ({ ...prev, temperature: "Nhiệt độ không được là số âm" }));
    } else if (value && (Number(value) < 35 || Number(value) > 42)) {
      setValidationErrors(prev => ({ ...prev, temperature: "Nhiệt độ cơ thể phải từ 35°C đến 42°C" }));
    } else {
      setValidationErrors(prev => ({ ...prev, temperature: "" }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll();
        if (user && user.role === "doctor" && user.userName) {
          const filteredBookings = data.filter(
            (booking: Booking) => booking.doctorName === user.userName
          );
          setBookings(filteredBookings);
        } else {
          setBookings(data);
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu");
        toast.error(err.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll, user]);

  const handleStatusChange = useCallback(
    async (id: string, newStatus: Booking["status"]) => {
      try {
        await update(id, { status: newStatus });
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      } catch (err: any) {
        toast.error(err.message || "Cập nhật thất bại");
      }
    },
    [update]
  );

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchSearch =
          booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          booking.customerPhone?.includes(search) ||
          booking.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
          booking.bookingCode?.toLowerCase().includes(search.toLowerCase());
        const matchDate =
          !selectedDate ||
          isSameDayLocal(
            parseBookingDateLocal(booking.bookingDate),
            selectedDate
          );
        const matchStatus =
          selectedStatus === "all" || booking.status === selectedStatus;
        // Only show bookings with isLabTest = true
        const isLabTest =
          typeof booking.serviceId === "object" &&
          booking.serviceId.isLabTest === true;
        return matchSearch && matchDate && matchStatus && isLabTest;
      }),
    [bookings, search, selectedDate, selectedStatus]
  );

  const sortedBookings = useMemo(
    () =>
      [...filteredBookings].sort(
        (a, b) =>
          new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
      ),
    [filteredBookings]
  );

  const handleCloseMedicalModal = useCallback(() => {
    setOpenMedicalModal(false);
    setDiagnosis("");
    setArvRegimen("");
    setHivLoad("");
    setMedicationTime("");
    setMedicationTimes([]);
    setReExaminationDate("");
    setSelectedStatusForSubmit(null);
    setSymptoms("");
    setWeight("");
    setHeight("");
    setBmi("");
    setBloodPressure("");
    setPulse("");
    setTemperature("");
    setSampleType("");
    setTestMethod("");
    setResultType("");
    setTestResult("");
    setTestValue("");
    setUnit("");
    setReferenceRange("");
    setMedicationSlot("");
    setRegimenCode("");
    setTreatmentLine("");
    setRecommendedFor("");
    setDrugs([]);
    setDosages([]);
    setFrequencies([]);
    setContraindications([]);
    setSideEffects([]);
    setP24Antigen("");
    setHivAntibody("");
    setComboInterpretation("");
    // Reset validation errors
    setValidationErrors({
      weight: "",
      height: "",
      bloodPressure: "",
      pulse: "",
      temperature: ""
    });
  }, []);

  // ...existing code...

  // ...existing code...

  // ...existing code...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản Lý Lịch Xét Nghiệm
            </h1>
          </div>
          <p className="text-gray-600">
            Quản lý và theo dõi lịch xét nghiệm HIV. Thông tin ẩn danh chỉ áp
            dụng cho booking ẩn danh.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters and Bookings List */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã lịch hẹn, tên, SĐT, email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="date"
                    value={
                      selectedDate
                        ? `${selectedDate.getFullYear()}-${String(
                          selectedDate.getMonth() + 1
                        ).padStart(2, "0")}-${String(
                          selectedDate.getDate()
                        ).padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      if (!e.target.value) {
                        setSelectedDate(null);
                        setCalendarDate(null);
                      } else {
                        const [year, month, day] = e.target.value
                          .split("-")
                          .map(Number);
                        const date = new Date(year, month - 1, day);
                        setSelectedDate(date);
                        setCalendarDate(date);
                      }
                    }}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="checked-in">Đã điểm danh</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="paid">Đã thanh toán</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="flex flex-col items-center">
                  <Loader className="h-10 w-10 animate-spin text-teal-600" />
                  <span className="mt-4 text-lg text-gray-600">
                    Đang tải dữ liệu lịch hẹn...
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <p className="text-red-700 font-medium text-lg">
                    Lỗi tải dữ liệu
                  </p>
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-base font-semibold"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {/* Bookings List */}
            {!loading && !error && (
              <div className="space-y-6">
                {sortedBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow border p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {search || selectedDate || selectedStatus !== "all"
                        ? "Không tìm thấy lịch hẹn nào"
                        : "Chưa có lịch hẹn nào được tạo"}
                    </h3>
                    <p className="text-gray-600">
                      {search || selectedDate || selectedStatus !== "all"
                        ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                        : "Tất cả lịch hẹn sẽ hiển thị tại đây."}
                    </p>
                  </div>
                ) : (
                  sortedBookings.map((booking) => {
                    const patientInfo = getPatientDisplayInfo(booking);
                    const serviceName =
                      typeof booking.serviceId === "object"
                        ? booking.serviceId.serviceName
                        : "Không xác định";
                    const serviceDescription =
                      typeof booking.serviceId === "object"
                        ? booking.serviceId.serviceDescription
                        : "Không có mô tả";
                    const servicePrice =
                      typeof booking.serviceId === "object"
                        ? booking.serviceId.price
                        : undefined;

                    return (
                      <div
                        key={booking._id || Math.random()}
                        className="bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300 p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          {/* Booking Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Mã lịch hẹn: {booking.bookingCode || "N/A"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {parseBookingDateLocal(
                                    booking.bookingDate
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  - {booking.startTime || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-600" />
                                <span>
                                  Bệnh nhân: {patientInfo.name}{" "}
                                  {booking.isAnonymous && (
                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                      Ẩn danh
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-teal-600" />
                                <span>SĐT: {patientInfo.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-teal-600" />
                                <span>Email: {patientInfo.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-teal-600" />
                                <span>Bác sĩ: {patientInfo.doctorName}</span>
                              </div>
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Dịch vụ: {serviceName}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {serviceDescription}
                              </p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-sm font-medium text-gray-600">
                                  Giá:
                                </span>
                                <span className="text-lg font-bold text-teal-600">
                                  {servicePrice
                                    ? Number(servicePrice).toLocaleString(
                                      "vi-VN",
                                      {
                                        style: "currency",
                                        currency: "VND",
                                      }
                                    )
                                    : "Miễn phí"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex flex-col items-end gap-4 flex-shrink-0">
                            <StatusButton
                              status={booking.status || "unknown"}
                              bookingId={booking._id}
                              onStatusChange={handleStatusChange}
                              userRole={user?.role}
                              serviceName={serviceName}
                            />
                            {/* Nút Hủy booking */}
                            {(booking.status !== "cancelled" && booking.status !== "completed") && (
                              <button
                                onClick={() => booking._id && handleStatusChange(booking._id, "cancelled")}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                                title="Hủy lịch hẹn"
                              >
                                <XCircle className="w-4 h-4 inline mr-2" />
                                Hủy lịch hẹn
                              </button>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CreditCard className="w-4 h-4 text-teal-600" />
                              <span>
                                Thanh toán: {" "}
                                {booking.status === "cancelled" ? (
                                  <span className="font-semibold text-green-700">
                                    Đã thanh toán
                                  </span>
                                ) : booking.status === "checked-out" ||
                                  booking.status === "re-examination" ||
                                  booking.status === "checked-in" ||
                                  booking.status === "completed" ? (
                                  <span className="font-semibold text-green-700">
                                    Đã thanh toán
                                  </span>
                                ) : (
                                  <span className="font-semibold text-red-700">
                                    Chưa thanh toán
                                  </span>
                                )}
                              </span>
                            </div>
                            {/* Ẩn nút Tạo phiếu xét nghiệm nếu đã gửi xét nghiệm thành công hoặc đã có kết quả */}
                            {!(results.some((r) => r.bookingId && r.bookingId._id === booking._id) || medicalRecordSent[booking._id!]) && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setMedicalDate(
                                    new Date(booking.bookingDate)
                                      .toISOString()
                                      .slice(0, 10)
                                  );
                                  setMedicalType(
                                    booking.serviceId?.serviceName || ""
                                  );
                                  setOpenMedicalModal(true);
                                }}
                                title={
                                  booking.status === "pending"
                                    ? "Không thể tạo phiếu xét nghiệm khi trạng thái là Chờ xác nhận"
                                    : "Tạo phiếu xét nghiệm"
                                }
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md
                                  ${booking.status === "pending"
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                  }`}
                                disabled={booking.status === "pending"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 inline mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Tạo phiếu xét nghiệm
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div className="order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Lịch hẹn theo ngày
              </h3>
              <CalendarComponent
                onChange={(value: any, event: any) => {
                  if (value instanceof Date) {
                    setCalendarDate(value);
                    setSelectedDate(value);
                  } else if (Array.isArray(value)) {
                    const [start] = value;
                    if (start instanceof Date) {
                      setCalendarDate(start);
                      setSelectedDate(start);
                    }
                  } else {
                    setCalendarDate(null);
                    setSelectedDate(null);
                  }
                }}
                value={calendarDate}
                selectRange={false} // Đảm bảo không dùng selectRange
                locale="vi-VN"
                className="react-calendar-custom"
                tileContent={({ date, view }) => {
                  if (
                    view === "month" &&
                    bookingDates.some((d) => isSameDayLocal(d, date))
                  ) {
                    return (
                      <div className="flex justify-center">
                        <span className="block w-2 h-2 bg-teal-600 rounded-full mt-1"></span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal tạo hồ sơ bệnh án */}
      {openMedicalModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Tạo phiếu xét nghiệm
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-6 border border-blue-100">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Bệnh nhân: {selectedBooking.customerName} (Mã booking:{" "}
                {selectedBooking.bookingCode})
              </p>
              <p className="text-sm text-gray-600">
                Ngày khám: {new Date(medicalDate).toLocaleDateString("vi-VN")} |
                Loại khám: {medicalType}
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const bookingId = selectedBooking?._id;
                if (!bookingId) {
                  toast.error("Thiếu thông tin booking!");
                  return;
                }
                if (hasResult) {
                  toast.error(
                    "Booking này đã có phiếu xét nghiệm, không thể gửi thêm!"
                  );
                  return;
                }
                if (medicalRecordSent[bookingId]) {
                  toast.error("Phiếu xét nghiệm đã được gửi!");
                  return;
                }

                // Validate tất cả các trường thông tin khám
                const isValidExamInfo = validateExamInfo();
                if (!isValidExamInfo) {
                  toast.error("Vui lòng kiểm tra lại thông tin khám!");
                  return;
                }

                try {
                  // Chuẩn bị dữ liệu gửi đi
                  const baseResult: any = {
                    resultName: resultName,
                    resultDescription: resultDescription || undefined,
                    testerName: testerName || undefined,
                    bookingId,
                    reExaminationDate: "", // required field
                    symptoms: symptoms || undefined,
                    weight: weight ? Number.parseFloat(weight) : undefined,
                    height: height ? Number.parseFloat(height) : undefined,
                    bmi: bmi ? Number.parseFloat(bmi) : undefined,
                    bloodPressure: bloodPressure || undefined,
                    pulse: pulse ? Number.parseInt(pulse) : undefined,
                    temperature: temperature
                      ? Number.parseFloat(temperature)
                      : undefined,
                    sampleType: sampleType || undefined,
                    testMethod: testMethod || undefined,
                    unit: unit || undefined,
                  };
                  // Nếu là Xét nghiệm HIV nhanh (Rapid Test) thì chỉ gửi testResult
                  if (
                    selectedBooking &&
                    typeof selectedBooking.serviceId === "object" &&
                    selectedBooking.serviceId.serviceName ===
                    "Xét nghiệm HIV nhanh (Rapid Test)"
                  ) {
                    // Chỉ gửi nếu là 1 trong 3 giá trị hợp lệ
                    if (
                      ["positive", "negative", "invalid"].includes(testResult)
                    ) {
                      baseResult.testResult = testResult;
                    }
                  }
                  // Nếu là Xét nghiệm HIV NAT (PCR) thì gửi thêm các trường đặc biệt
                  if (
                    selectedBooking &&
                    typeof selectedBooking.serviceId === "object" &&
                    selectedBooking.serviceId.serviceName ===
                    "Xét nghiệm HIV NAT (PCR)"
                  ) {
                    baseResult.viralLoad = viralLoad
                      ? Number.parseFloat(viralLoad)
                      : undefined;
                    baseResult.viralLoadReference =
                      viralLoadReference || undefined;
                    // Đảm bảo gửi đúng giá trị enum cho diễn giải VL
                    let interpretation = viralLoadInterpretation;
                    if (
                      interpretation !== "undetectable" &&
                      interpretation !== "low" &&
                      interpretation !== "high"
                    ) {
                      // Nếu đang là text tiếng Việt thì chuyển về enum
                      if (interpretation === "Không phát hiện")
                        interpretation = "undetectable";
                      else if (interpretation === "Thấp")
                        interpretation = "low";
                      else if (interpretation === "Cao")
                        interpretation = "high";
                    }
                    baseResult.viralLoadInterpretation =
                      interpretation || undefined;
                  }
                  // Nếu là Xét nghiệm CD4 thì gửi các trường đặc biệt
                  if (
                    selectedBooking &&
                    typeof selectedBooking.serviceId === "object" &&
                    selectedBooking.serviceId.serviceName === "Xét nghiệm CD4"
                  ) {
                    baseResult.cd4Count = cd4Count
                      ? Number.parseFloat(cd4Count)
                      : undefined;
                    baseResult.cd4Reference = cd4Reference || undefined;
                    // Đảm bảo gửi đúng giá trị enum cho diễn giải CD4
                    let cd4Interp = cd4Interpretation;
                    if (
                      cd4Interp !== "normal" &&
                      cd4Interp !== "low" &&
                      cd4Interp !== "very_low"
                    ) {
                      if (cd4Interp === "Bình thường") cd4Interp = "normal";
                      else if (cd4Interp === "Thấp") cd4Interp = "low";
                      else if (cd4Interp === "Rất thấp") cd4Interp = "very_low";
                    }
                    baseResult.cd4Interpretation = cd4Interp || undefined;
                  }
                  // Nếu là Xét nghiệm HIV Combo (Ag/Ab) thì gửi thêm các trường đặc biệt
                  if (
                    selectedBooking &&
                    typeof selectedBooking.serviceId === "object" &&
                    selectedBooking.serviceId.serviceName ===
                    "Xét nghiệm HIV Combo (Ag/Ab)"
                  ) {
                    baseResult.p24Antigen = p24Antigen
                      ? Number.parseFloat(p24Antigen)
                      : undefined;
                    baseResult.hivAntibody = hivAntibody
                      ? Number.parseFloat(hivAntibody)
                      : undefined;
                    
                    // Sử dụng diễn giải đã được tính toán tự động
                    if (comboInterpretation) {
                      baseResult.comboInterpretation = comboInterpretation;
                    }
                  }
                  await addResult(baseResult);
                  setMedicalRecordSent((prev) => ({
                    ...prev,
                    [bookingId]: true,
                  }));
                  
                  // Cập nhật trạng thái booking thành "completed" ngay lập tức
                  if (selectedBooking._id) {
                    await handleStatusChange(selectedBooking._id, "completed");
                  }
                  
                  // Refresh lại danh sách bookings để cập nhật UI
                  try {
                    const updatedData = await getAll();
                    if (user && user.role === "doctor" && user.userName) {
                      const filteredBookings = updatedData.filter(
                        (booking: Booking) => booking.doctorName === user.userName
                      );
                      setBookings(filteredBookings);
                    } else {
                      setBookings(updatedData);
                    }
                  } catch (refreshError) {
                    console.error("Error refreshing bookings:", refreshError);
                  }
                  
                  toast.success("Đã tạo phiếu xét nghiệm và cập nhật trạng thái!");
                  handleCloseMedicalModal();
                } catch (err: any) {
                  console.error("Form submission error:", err);
                  toast.error(err.message || "Lưu phiếu xét nghiệm thất bại!");
                }
              }}
            >
              <div className="space-y-6">
                {/* General Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Thông tin chung
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày khám <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-100"
                        value={medicalDate}
                        onChange={(e) => setMedicalDate(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại khám <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-100"
                        value={medicalType}
                        onChange={(e) => setMedicalType(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên kết quả <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={resultName}
                        onChange={(e) => setResultName(e.target.value)}
                        placeholder="Nhập tên kết quả xét nghiệm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Người thực hiện xét nghiệm
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={testerName}
                        onChange={(e) => setTesterName(e.target.value)}
                        placeholder="Nhập tên người thực hiện xét nghiệm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả kết quả
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={resultDescription}
                        onChange={(e) => setResultDescription(e.target.value)}
                        placeholder="Nhập mô tả thêm cho kết quả xét nghiệm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Triệu chứng
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Nhập triệu chứng (nếu có)"
                      />
                    </div>
                  </div>
                </div>

                {/* Exam Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Thông tin khám
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cân nặng (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.weight 
                            ? "border-red-500 bg-red-50" 
                            : "border-gray-200"
                        }`}
                        value={weight}
                        onChange={(e) => handleWeightChange(e.target.value)}
                        min="0"
                      />
                      {validationErrors.weight && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.weight}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chiều cao (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.height 
                            ? "border-red-500 bg-red-50" 
                            : "border-gray-200"
                        }`}
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        min="0"
                      />
                      {validationErrors.height && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.height}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BMI
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100"
                        value={bmi}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Huyết áp
                      </label>
                      <input
                        type="text"
                        className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.bloodPressure 
                            ? "border-red-500 bg-red-50" 
                            : "border-gray-200"
                        }`}
                        value={bloodPressure}
                        onChange={(e) => handleBloodPressureChange(e.target.value)}
                        placeholder="e.g., 120/80"
                      />
                      {validationErrors.bloodPressure && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.bloodPressure}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mạch (lần/phút)
                      </label>
                      <input
                        type="number"
                        className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.pulse 
                            ? "border-red-500 bg-red-50" 
                            : "border-gray-200"
                        }`}
                        value={pulse}
                        onChange={(e) => handlePulseChange(e.target.value)}
                        min="0"
                      />
                      {validationErrors.pulse && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.pulse}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nhiệt độ (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.temperature 
                            ? "border-red-500 bg-red-50" 
                            : "border-gray-200"
                        }`}
                        value={temperature}
                        onChange={(e) => handleTemperatureChange(e.target.value)}
                        min="0"
                        placeholder="35-42°C"
                      />
                      {validationErrors.temperature && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.temperature}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lab Test Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Xét nghiệm
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại mẫu xét nghiệm
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={sampleType}
                        onChange={(e) => setSampleType(e.target.value)}
                        placeholder="e.g., Máu, Nước tiểu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phương pháp xét nghiệm
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={testMethod}
                        onChange={(e) => setTestMethod(e.target.value)}
                        placeholder="VD: PCR, Test nhanh"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đơn vị
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="e.g., copies/mL, %"
                      />
                    </div> */}

                    {/* Nếu là Combo thì hiển thị thêm các trường đặc biệt */}
                    {selectedBooking &&
                      typeof selectedBooking.serviceId === "object" &&
                      selectedBooking.serviceId.serviceName === "Xét nghiệm HIV Combo (Ag/Ab)" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Giá trị kháng nguyên P24 (p24Antigen)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={p24Antigen}
                              onChange={(e) => setP24Antigen(e.target.value)}
                              min="0"
                              placeholder="Ví dụ: 1.2"
                            />
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                              <p className="text-xs text-blue-700 mb-1">
                                <strong>Ngưỡng:</strong> {'>'}1 = Dương tính, ≤1 = Âm tính
                              </p>
                              <p className="text-xs text-blue-600">
                                Kháng nguyên P24 xuất hiện sớm trong giai đoạn nhiễm HIV cấp tính, 
                                thường phát hiện được từ tuần 2-4 sau khi nhiễm.
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Giá trị kháng thể HIV (hivAntibody)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={hivAntibody}
                              onChange={(e) => setHivAntibody(e.target.value)}
                              min="0"
                              placeholder="Ví dụ: 0.8"
                            />
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                              <p className="text-xs text-green-700 mb-1">
                                <strong>Ngưỡng:</strong> {'>'}1 = Dương tính, ≤1 = Âm tính
                              </p>
                              <p className="text-xs text-green-600">
                                Kháng thể HIV xuất hiện muộn hơn, thường từ tuần 4-6 sau khi nhiễm, 
                                khi hệ miễn dịch đã sản sinh phản ứng.
                              </p>
                            </div>
                          </div>
                          {comboInterpretation && (
                            <div className="col-span-2">
                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">
                                  Diễn giải kết quả:
                                </h4>
                                <p className="text-blue-700 font-medium">
                                  {comboInterpretation}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                    )}

                    {/* Nếu là Xét nghiệm HIV nhanh (Rapid Test) thì hiển thị trường testResult ở phần Xét nghiệm */}
                    {selectedBooking &&
                      typeof selectedBooking.serviceId === "object" &&
                      selectedBooking.serviceId.serviceName ===
                      "Xét nghiệm HIV nhanh (Rapid Test)" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kết quả xét nghiệm{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={testResult}
                            onChange={(e) =>
                              setTestResult(
                                e.target.value as
                                | "positive"
                                | "negative"
                                | "invalid"
                                | ""
                              )
                            }
                            required
                          >
                            <option value="">-- Chọn kết quả --</option>
                            <option value="positive">Dương tính</option>
                            <option value="negative">Âm tính</option>
                            <option value="invalid">Không xác định</option>
                          </select>
                        </div>
                      )}
                    {selectedBooking &&
                      typeof selectedBooking.serviceId === "object" &&
                      selectedBooking.serviceId.serviceName ===
                      "Xét nghiệm HIV NAT (PCR)" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tải lượng virus HIV (copies/mL)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={viralLoad}
                              onChange={(e) => setViralLoad(e.target.value)}
                              min="0"
                              placeholder="e.g., 20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Khoảng tham chiếu VL
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100"
                              value={viralLoadReference}
                              readOnly
                              placeholder="e.g., <20 copies/mL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Diễn giải kết quả VL
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100"
                              value={
                                viralLoadInterpretation === "undetectable"
                                  ? "Không phát hiện"
                                  : viralLoadInterpretation === "low"
                                    ? "Thấp"
                                    : viralLoadInterpretation === "high"
                                      ? "Tải lượng cao"
                                      : ""
                              }
                              readOnly
                              placeholder="Diễn giải tự động"
                            />
                          </div>
                        </>
                      )}
                    {/* Nếu là Xét nghiệm CD4 thì hiển thị các trường đặc biệt */}
                    {selectedBooking &&
                      typeof selectedBooking.serviceId === "object" &&
                      selectedBooking.serviceId.serviceName ===
                      "Xét nghiệm CD4" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Số lượng tế bào CD4 (cells/mm³)
                            </label>
                            <input
                              type="number"
                              step="1"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={cd4Count}
                              onChange={(e) => setCd4Count(e.target.value)}
                              min="0"
                              placeholder="e.g., 600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Khoảng tham chiếu CD4
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100"
                              value={cd4Reference}
                              readOnly
                              placeholder="e.g., >500 cells/mm³"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Diễn giải kết quả CD4
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100"
                              value={
                                cd4Interpretation === "normal"
                                  ? "Hệ miễn dịch bình thường"
                                  : cd4Interpretation === "low"
                                    ? "Hệ miễn dịch yếu"
                                    : cd4Interpretation === "very_low"
                                      ? "Hệ miễn dịch rất yếu"
                                      : ""
                              }
                              readOnly
                              placeholder="Diễn giải tự động"
                            />
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 text-gray-700 font-semibold transition-all"
                  onClick={handleCloseMedicalModal}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl text-white font-semibold transition-all
                    ${selectedBooking &&
                      (medicalRecordSent[selectedBooking._id!] || !!hasResult)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    }`}
                  disabled={
                    selectedBooking
                      ? medicalRecordSent[selectedBooking._id!] || !!hasResult
                      : true
                  }
                >
                  {!!hasResult
                    ? "Đã có kết quả"
                    : selectedBooking && medicalRecordSent[selectedBooking._id!]
                      ? "Đã gửi hồ sơ"
                      : "Lưu hồ sơ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TestManagement;
