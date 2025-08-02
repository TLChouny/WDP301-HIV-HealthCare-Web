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
        className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold ${
          statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"
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

  // Ngăn doctor thay đổi trạng thái từ "pending" sang "checked-in" cho các dịch vụ khác
  // if (userRole === "doctor" && status === "pending" && !isOnlineConsultation) {
  //   return (
  //     <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-500 border border-gray-200 cursor-not-allowed">
  //       <Clock className="w-4 h-4 mr-2" />
  //       {translateBookingStatus(status)}
  //     </span>
  //   );
  // }

  // Cho phép chuyển từ "pending" hoặc "checked-out" sang "checked-in" cho các vai trò khác hoặc trạng thái mặc định
  if (
    (userRole === "doctor" || status === "checked-out") &&
    status !== "completed"
  ) {
    return (
      <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Điểm danh
      </div>
    );
  }
};

const TestManagement: React.FC = () => {
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
  const [testResult, setTestResult] = useState("");
  const [testValue, setTestValue] = useState("");
  const [unit, setUnit] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [medicationSlot, setMedicationSlot] = useState("");
  const [regimenCode, setRegimenCode] = useState("");
  const [treatmentLine, setTreatmentLine] = useState<
    "First-line" | "Second-line" | "Third-line" | ""
  >("");
  const [recommendedFor, setRecommendedFor] = useState("");
  const [drugs, setDrugs] = useState<string[]>([]);
  const [dosages, setDosages] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);
  const [contraindications, setContraindications] = useState<string[]>([]);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [medicalRecordSent, setMedicalRecordSent] = useState<{
    [bookingId: string]: boolean;
  }>({});
  const [selectedStatusForSubmit, setSelectedStatusForSubmit] = useState<
    "re-examination" | "completed" | null
  >(null);

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

  // Map medication slots to time input labels
  const slotToTimeCount: { [key: string]: string[] } = {
    Sáng: ["Sáng"],
    Trưa: ["Trưa"],
    Tối: ["Tối"],
    "Sáng và Trưa": ["Sáng", "Trưa"],
    "Trưa và Tối": ["Trưa", "Tối"],
    "Sáng và Tối": ["Sáng", "Tối"],
    "Sáng, Trưa và Tối": ["Sáng", "Trưa", "Tối"],
  };

  // Update medicationTimes when medicationSlot changes
  useEffect(() => {
    const timeSlots = slotToTimeCount[medicationSlot] || [];
    setMedicationTimes((prev) => {
      const newTimes = timeSlots.map((_, i) => prev[i] || "");
      return newTimes;
    });
  }, [medicationSlot]);

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
        const isLabTest = typeof booking.serviceId === "object" && booking.serviceId.isLabTest === true;
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
  }, []);

  // Map frequency display text to numeric values for storage
  const mapFrequencyToNumeric = useCallback((freq: string): string => {
    switch (freq) {
      case "Một lần/ngày":
        return "1";
      case "Hai lần/ngày":
        return "2";
      case "Ba lần/ngày":
        return "3";
      case "Khác":
        return "0";
      default:
        return freq || "0";
    }
  }, []);

  // Tự định nghĩa kiểu Value nếu chưa có
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const handleCalendarChange = useCallback(
    (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
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
    },
    []
  );

  // Determine if ARV section should be shown
  const showArvSection = useMemo(() => {
    if (
      !selectedBooking ||
      !selectedBooking.serviceId ||
      typeof selectedBooking.serviceId !== "object"
    ) {
      return false;
    }
    return (
      selectedBooking.serviceId.isArvTest &&
      !selectedBooking.serviceId.isLabTest
    );
  }, [selectedBooking]);

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
              Quản Lý Lịch Hẹn
            </h1>
          </div>
          <p className="text-gray-600">
            Quản lý và theo dõi lịch hẹn khám HIV. Thông tin ẩn danh chỉ áp dụng
            cho booking ẩn danh.
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
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CreditCard className="w-4 h-4 text-teal-600" />
                              <span>
                                Thanh toán:{" "}
                                {booking.status === "checked-out" ||
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
                                ${
                                  booking.status === "pending"
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                }`}
                              disabled={
                                booking.status === "pending"
                              }
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
                onChange={handleCalendarChange}
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
      {openMedicalModal &&
        selectedBooking && (
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
                  Ngày khám: {new Date(medicalDate).toLocaleDateString("vi-VN")}{" "}
                  | Loại khám: {medicalType}
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
                    toast.error("Booking này đã có phiếu xét nghiệm, không thể gửi thêm!");
                    return;
                  }
                  if (medicalRecordSent[bookingId]) {
                    toast.error("Phiếu xét nghiệm đã được gửi!");
                    return;
                  }
                  if (!selectedStatusForSubmit) {
                    toast.error("Vui lòng chọn trạng thái gửi phiếu xét nghiệm!");
                    return;
                  }
                  if (!diagnosis) {
                    toast.error("Vui lòng nhập kết luận xét nghiệm!");
                    return;
                  }
                  try {
                    await addResult({
                      resultName: diagnosis,
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
                      resultType: resultType || undefined,
                      testResult: testResult || undefined,
                      testValue: testValue
                        ? Number.parseFloat(testValue)
                        : undefined,
                      unit: unit || undefined,
                      referenceRange: referenceRange || undefined,
                    });
                    setMedicalRecordSent((prev) => ({
                      ...prev,
                      [bookingId]: true,
                    }));
                    await handleStatusChange(
                      bookingId,
                      selectedStatusForSubmit!
                    );
                    toast.success("Đã tạo phiếu xét nghiệm!");
                    handleCloseMedicalModal();
                  } catch (err: any) {
                    console.error("Form submission error:", err);
                    toast.error(err.message || "Lưu phiếu xét nghiệm thất bại!");
                  }
                }}
                    // ...existing code...
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
                          Chẩn đoán <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          required
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
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chiều cao (cm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          min="0"
                        />
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
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(e.target.value)}
                          placeholder="e.g., 120/80 mmHg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mạch (lần/phút)
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={pulse}
                          onChange={(e) => setPulse(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nhiệt độ (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={temperature}
                          onChange={(e) => setTemperature(e.target.value)}
                          min="0"
                        />
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
                          placeholder="e.g., PCR, ELISA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại kết quả xét nghiệm
                        </label>
                        <select
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={resultType}
                          onChange={(e) =>
                            setResultType(
                              e.target.value as
                                | "positive-negative"
                                | "quantitative"
                                | "other"
                                | ""
                            )
                          }
                        >
                          <option value="">-- Chọn loại kết quả --</option>
                          <option value="positive-negative">
                            Dương tính/Âm tính
                          </option>
                          <option value="quantitative">Định lượng</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kết quả xét nghiệm
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={testResult}
                          onChange={(e) => setTestResult(e.target.value)}
                          placeholder="e.g., Dương tính, Âm tính"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá trị xét nghiệm
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={testValue}
                          onChange={(e) => setTestValue(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div>
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
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Khoảng tham chiếu
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={referenceRange}
                          onChange={(e) => setReferenceRange(e.target.value)}
                          placeholder="e.g., < 40 copies/mL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ARV Treatment - Conditionally Rendered */}
                  {/* ...không hiển thị phần ARV... */}

                  {/* Status Selection */}
                  <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col items-center">
                    <div className="mb-4 text-lg text-gray-800 font-semibold">
                      Chọn trạng thái gửi hồ sơ{" "}
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                      {/* Ẩn nút Tái Khám nếu booking là xét nghiệm labo */}
                      {!(
                        selectedBooking &&
                        typeof selectedBooking.serviceId === "object" &&
                        selectedBooking.serviceId.isLabTest
                      ) && (
                        <button
                          type="button"
                          className={`flex-1 px-5 py-3 border-2 rounded-xl shadow-md flex items-center justify-center gap-2 text-base font-semibold transition-all duration-150
                          ${
                            selectedStatusForSubmit === "re-examination"
                              ? "border-purple-600 bg-purple-500 text-white ring-2 ring-purple-400"
                              : "border-purple-400 bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                          onClick={() =>
                            setSelectedStatusForSubmit("re-examination")
                          }
                        >
                          <CalendarClock className="w-6 h-6" />
                          Tái khám
                        </button>
                      )}
                      <button
                        type="button"
                        className={`flex-1 px-5 py-3 border-2 rounded-xl shadow-md flex items-center justify-center gap-2 text-base font-semibold transition-all duration-150
                        ${
                          selectedStatusForSubmit === "completed"
                            ? "border-green-600 bg-green-500 text-white ring-2 ring-green-400"
                            : "border-green-400 bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        onClick={() => setSelectedStatusForSubmit("completed")}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        Hoàn tất
                      </button>
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
                    ${
                      selectedBooking &&
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
                      ? "Đã có kết quả, không thể gửi"
                      : selectedBooking &&
                        medicalRecordSent[selectedBooking._id!]
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
