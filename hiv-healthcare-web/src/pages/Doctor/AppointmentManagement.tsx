// cspell:ignore arvregimen

import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react';
import { getBookingStatusColor, translateBookingStatus } from '../../utils/status';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Booking } from '../../types/booking';
import { useBooking } from '../../context/BookingContext';
import { useArv } from '../../context/ArvContext';
import { useResult } from '../../context/ResultContext';
import { useAuth } from '../../context/AuthContext';
import { ARVRegimen } from '../../types/arvRegimen';

function isSameDayLocal(date1: string | Date, date2: string | Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const AppointmentManagement: React.FC = () => {
  const [reExaminationDate, setReExaminationDate] = useState('');
  const { getAll, update } = useBooking();
  const { regimens, create: createArv } = useArv();
  const { addResult, results } = useResult();
  const { getUserById } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMedicalModal, setOpenMedicalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // State for Result fields
  const [medicalDate, setMedicalDate] = useState('');
  const [medicalType, setMedicalType] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [arvRegimen, setArvRegimen] = useState('');
  const [hivLoad, setHivLoad] = useState('');
  const [medicationTime, setMedicationTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [temperature, setTemperature] = useState('');
  const [sampleType, setSampleType] = useState('');
  const [testMethod, setTestMethod] = useState('');
  const [resultType, setResultType] = useState<'positive-negative' | 'quantitative' | 'other' | ''>('');
  const [testResult, setTestResult] = useState('');
  const [testValue, setTestValue] = useState('');
  const [unit, setUnit] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [medicationSlot, setMedicationSlot] = useState('');
  // State for ARVRegimen fields
  const [regimenCode, setRegimenCode] = useState('');
  const [treatmentLine, setTreatmentLine] = useState<'First-line' | 'Second-line' | 'Third-line' | ''>('');
  const [recommendedFor, setRecommendedFor] = useState('');
  const [drugs, setDrugs] = useState<string[]>([]);
  const [dosages, setDosages] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);
  const [contraindications, setContraindications] = useState<string[]>([]);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [medicalRecordSent, setMedicalRecordSent] = useState<{ [bookingId: string]: boolean }>({});
  const [selectedStatusForSubmit, setSelectedStatusForSubmit] = useState<'re-examination' | 'completed' | null>(null);
  const hasResult = selectedBooking && results.some(r => r.bookingId && r.bookingId._id === selectedBooking._id);

  const bookingDates = bookings.map(b => new Date(b.bookingDate));

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height) / 100; // Convert cm to meters
      if (weightNum > 0 && heightNum > 0) {
        const calculatedBmi = (weightNum / (heightNum * heightNum)).toFixed(2);
        setBmi(calculatedBmi);
      } else {
        setBmi('');
      }
    } else {
      setBmi('');
    }
  }, [weight, height]);

  // Populate ARV fields when a regimen is selected
  useEffect(() => {
    if (arvRegimen) {
      const selectedRegimen = regimens.find(r => r.arvName === arvRegimen);
      if (selectedRegimen) {
        setRegimenCode(selectedRegimen.regimenCode || '');
        setTreatmentLine(selectedRegimen.treatmentLine || '');
        setRecommendedFor(selectedRegimen.recommendedFor || '');
        setDrugs(selectedRegimen.drugs || []);
        setDosages(selectedRegimen.dosages || []);
        setFrequencies(selectedRegimen.frequency ? selectedRegimen.frequency.split(';') : []);
        setContraindications(selectedRegimen.contraindications || []);
        setSideEffects(selectedRegimen.sideEffects || []);
      }
    } else {
      setRegimenCode('');
      setTreatmentLine('');
      setRecommendedFor('');
      setDrugs([]);
      setDosages([]);
      setFrequencies([]);
      setContraindications([]);
      setSideEffects([]);
    }
  }, [arvRegimen, regimens]);

  const anonymizeName = (name: string): string => {
    if (!name) return 'Không xác định';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return (
      words[0].charAt(0) + '*'.repeat(words[0].length - 1) + ' ' +
      words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1)
    );
  };

  const getPatientDisplayInfo = (booking: Booking) => {
    if (booking.isAnonymous) {
      return {
        name: anonymizeName(booking.customerName || ''),
        phone: '***-***-****',
        email: '***@***.***',
      };
    } else {
      return {
        name: booking.customerName || 'Không xác định',
        phone: booking.customerPhone || 'Không có',
        email: booking.customerEmail || 'Không có',
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAll();
        console.log('Bookings fetched:', data); // Debug: Log bookings
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu');
        toast.error(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    try {
      await update(id, { status: newStatus });
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: newStatus } : b)));
      toast.success('Cập nhật thành công!');
    } catch (err: any) {
      toast.error(err.message || 'Cập nhật thất bại');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchSearch =
      booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerPhone?.includes(search) ||
      booking.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      booking.bookingCode?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !selectedDate || isSameDayLocal(booking.bookingDate, selectedDate);
    const matchStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchSearch && matchDate && matchStatus;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) =>
    new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
  );

  const handleCloseMedicalModal = () => {
    setOpenMedicalModal(false);
    setDiagnosis('');
    setArvRegimen('');
    setHivLoad('');
    setMedicationTime('');
    setReExaminationDate('');
    setSelectedStatusForSubmit(null);
    setSymptoms('');
    setWeight('');
    setHeight('');
    setBmi('');
    setBloodPressure('');
    setPulse('');
    setTemperature('');
    setSampleType('');
    setTestMethod('');
    setResultType('');
    setTestResult('');
    setTestValue('');
    setUnit('');
    setReferenceRange('');
    setMedicationSlot('');
    setRegimenCode('');
    setTreatmentLine('');
    setRecommendedFor('');
    setDrugs([]);
    setDosages([]);
    setFrequencies([]);
    setContraindications([]);
    setSideEffects([]);
  };

  // Handle array inputs (comma-separated strings)
  const handleArrayInput = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setter(array);
  };

  // Map frequency display text to numeric values for storage
  const mapFrequencyToNumeric = (freq: string): string => {
    switch (freq) {
      case 'Một lần/ngày': return '1';
      case 'Hai lần/ngày': return '2';
      case 'Ba lần/ngày': return '3';
      case 'Khác': return '0';
      default: return freq || '0';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && <div className="text-center">Đang tải...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="w-full flex flex-row gap-8 justify-end">
        {/* LEFT - LIST */}
        <div className="flex-1 order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
            <p className="text-sm text-gray-600 mt-2">Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Mã & Thông tin</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Thời gian</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Loại khám</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-500">Trạng thái</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Meeting</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBookings.map(booking => {
                    const info = getPatientDisplayInfo(booking);
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-blue-600">{booking.bookingCode || 'N/A'}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            <div className="flex items-center gap-1"><User className="w-3 h-3" />{info.name}</div>
                            <div className="flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{info.phone}</div>
                            <div className="flex items-center gap-1 mt-1"><Mail className="w-3 h-3" />{info.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</div>
                          <div className="text-gray-500 text-xs">{booking.startTime} - {booking.endTime}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-blue-700">{booking.serviceId?.serviceName || 'Không xác định'}</div>
                          <div className="text-xs text-gray-500">{booking.serviceId?.serviceDescription || 'Không có mô tả'}</div>
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          <span
                            className={`bg-clip-text text-transparent bg-gradient-to-r ${getBookingStatusColor(booking.status)}`}
                          >
                            {translateBookingStatus(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.meetLink ? (
                            <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tham gia</a>
                          ) : (
                            <span className="text-gray-400">Chưa có link</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                console.log('Selected booking:', booking); // Debug: Log booking
                                setSelectedBooking(booking);
                                setMedicalDate(new Date(booking.bookingDate).toISOString().slice(0, 10));
                                setMedicalType(booking.serviceId?.serviceName || '');
                                setOpenMedicalModal(true);
                              }}
                              title={booking.status === 'pending' ? 'Không thể tạo hồ sơ khi trạng thái là Chờ xác nhận' : 'Tạo hồ sơ bệnh án'}
                              className={`text-blue-500 hover:text-blue-700 ${booking.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={booking.status === 'pending'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT - CALENDAR */}
        <div className="w-full md:w-72 order-1 md:order-2 md:self-start md:ml-auto">
          <div className="bg-white rounded-lg shadow p-4">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setCalendarDate(value);
                  setSelectedDate(value);
                } else {
                  setCalendarDate(null);
                  setSelectedDate(null);
                }
              }}
              value={calendarDate}
              className="[&_.react-calendar__tile]:py-2 [&_.react-calendar__tile]:text-[14px] [&_.react-calendar__month-view__weekdays]:text-[12px] text-sm"
              tileContent={({ date, view }) => {
                if (view === 'month' && bookingDates.some(d => isSameDayLocal(d, date))) {
                  return (
                    <div className="flex justify-center">
                      <span className="block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    </div>
                  );
                }
                return null;
              }}
              locale="vi-VN"
            />
          </div>
        </div>
      </div>

      {/* Modal tạo hồ sơ bệnh án */}
      {openMedicalModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Tạo hồ sơ bệnh án</h2>
            <div className="mb-4">
              <p><span className="font-semibold">Tên bệnh nhân:</span> {selectedBooking.customerName}</p>
              <p><span className="font-semibold">Mã booking:</span> {selectedBooking.bookingCode}</p>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const bookingId = selectedBooking?._id;
                if (!bookingId) {
                  toast.error('Thiếu thông tin booking!');
                  return;
                }
                if (hasResult) {
                  toast.error('Booking này đã có kết quả, không thể gửi thêm!');
                  return;
                }
                if (medicalRecordSent[bookingId]) {
                  toast.error('Hồ sơ bệnh án đã được gửi!');
                  return;
                }
                if (!selectedStatusForSubmit) {
                  toast.error('Vui lòng chọn trạng thái gửi!');
                  return;
                }
                if (!diagnosis) {
                  toast.error('Vui lòng nhập chẩn đoán!');
                  return;
                }
                if (!arvRegimen) {
                  toast.error('Vui lòng chọn phác đồ ARV!');
                  return;
                }
                if (!medicationTime) {
                  toast.error('Vui lòng nhập thời gian uống thuốc!');
                  return;
                }
                if (!reExaminationDate) {
                  toast.error('Vui lòng nhập ngày tái khám!');
                  return;
                }
                try {
                  const selectedRegimen = regimens.find(r => r.arvName === arvRegimen);
                  if (!selectedRegimen) {
                    toast.error('Phác đồ ARV không hợp lệ!');
                    return;
                  }
                  // Debug: Log userId and user data
                  console.log('Booking userId:', selectedBooking.userId);
                  let userName = 'Unknown';
                  if (selectedBooking.userId) {
                    try {
                      const user = await getUserById(selectedBooking.userId._id);
                      console.log('User fetched:', user); // Debug: Log user data
                      userName = user?.userName || 'Unknown';
                    } catch (err: any) {
                      console.error('Failed to fetch user:', err);
                      toast.warn('Không thể lấy thông tin người dùng, sử dụng tên mặc định.');
                    }
                  } else {
                    console.warn('No userId in booking');
                    toast.warn('Booking không có userId, sử dụng tên mặc định.');
                  }
                  // Check if frequency or dosages are customized
                  const isCustomFrequency = frequencies.length > 0 && frequencies.join(';') !== selectedRegimen.frequency;
                  const isCustomDosages = dosages.length > 0 && JSON.stringify(dosages) !== JSON.stringify(selectedRegimen.dosages);
                  const isCustomContraindications = contraindications.length > 0 && JSON.stringify(contraindications) !== JSON.stringify(selectedRegimen.contraindications);
                  const isCustomSideEffects = sideEffects.length > 0 && JSON.stringify(sideEffects) !== JSON.stringify(selectedRegimen.sideEffects);
                  let arvregimenId: string = selectedRegimen._id!; // Type assertion to ensure _id is string
                  if (isCustomFrequency || isCustomDosages || isCustomContraindications || isCustomSideEffects) {
                    const newRegimen = await createArv({
                      arvName: `${selectedRegimen.arvName} (${userName})`,
                      arvDescription: selectedRegimen.arvDescription,
                      regimenCode: selectedRegimen.regimenCode,
                      treatmentLine: selectedRegimen.treatmentLine,
                      recommendedFor: selectedRegimen.recommendedFor,
                      drugs: selectedRegimen.drugs,
                      dosages: isCustomDosages ? dosages : selectedRegimen.dosages,
                      frequency: isCustomFrequency ? frequencies.map(mapFrequencyToNumeric).join(';') : selectedRegimen.frequency,
                      contraindications: isCustomContraindications ? contraindications : selectedRegimen.contraindications,
                      sideEffects: isCustomSideEffects ? sideEffects : selectedRegimen.sideEffects,
                      userId: selectedBooking.userId || undefined, // Include userId if available
                    });
                    console.log('New regimen created:', newRegimen); // Debug: Log new regimen
                    if (!newRegimen) {
                      toast.error('Không thể tạo phác đồ ARV mới!');
                      return;
                    }
                    arvregimenId = newRegimen._id ?? "";
                  }
                  await addResult({
                    resultName: diagnosis,
                    resultDescription: hivLoad || undefined,
                    bookingId,
                    arvregimenId,
                    reExaminationDate,
                    medicationTime,
                    medicationSlot: medicationSlot || undefined,
                    symptoms: symptoms || undefined,
                    weight: weight ? parseFloat(weight) : undefined,
                    height: height ? parseFloat(height) : undefined,
                    bmi: bmi ? parseFloat(bmi) : undefined,
                    bloodPressure: bloodPressure || undefined,
                    pulse: pulse ? parseInt(pulse) : undefined,
                    temperature: temperature ? parseFloat(temperature) : undefined,
                    sampleType: sampleType || undefined,
                    testMethod: testMethod || undefined,
                    resultType: resultType || undefined,
                    testResult: testResult || undefined,
                    testValue: testValue ? parseFloat(testValue) : undefined,
                    unit: unit || undefined,
                    referenceRange: referenceRange || undefined,
                  });
                  setMedicalRecordSent(prev => ({ ...prev, [bookingId]: true }));
                  await handleStatusChange(bookingId, selectedStatusForSubmit);
                  toast.success('Đã tạo hồ sơ bệnh án!');
                  handleCloseMedicalModal();
                } catch (err: any) {
                  console.error('Form submission error:', err); // Debug: Log error
                  toast.error(err.message || 'Lưu hồ sơ thất bại!');
                }
              }}
            >
              <div className="space-y-6">
                {/* General Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin chung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ngày khám <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medicalDate}
                        onChange={e => setMedicalDate(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Loại khám <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medicalType}
                        onChange={e => setMedicalType(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Chẩn đoán <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Triệu chứng</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Exam Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin khám</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cân nặng (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Chiều cao (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">BMI</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                        value={bmi}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Huyết áp</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={bloodPressure}
                        onChange={e => setBloodPressure(e.target.value)}
                        placeholder="e.g., 120/80 mmHg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mạch (lần/phút)</label>
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={pulse}
                        onChange={e => setPulse(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nhiệt độ (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={temperature}
                        onChange={e => setTemperature(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Lab Test Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Xét nghiệm</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Loại mẫu xét nghiệm</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={sampleType}
                        onChange={e => setSampleType(e.target.value)}
                        placeholder="e.g., Máu, Nước tiểu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phương pháp xét nghiệm</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={testMethod}
                        onChange={e => setTestMethod(e.target.value)}
                        placeholder="e.g., PCR, ELISA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Loại kết quả xét nghiệm</label>
                      <select
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={resultType}
                        onChange={e => setResultType(e.target.value as 'positive-negative' | 'quantitative' | 'other' | '')}
                      >
                        <option value="">-- Chọn loại kết quả --</option>
                        <option value="positive-negative">Dương tính/Âm tính</option>
                        <option value="quantitative">Định lượng</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Kết quả xét nghiệm</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={testResult}
                        onChange={e => setTestResult(e.target.value)}
                        placeholder="e.g., Dương tính, Âm tính"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Giá trị xét nghiệm</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={testValue}
                        onChange={e => setTestValue(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Đơn vị</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                        placeholder="e.g., copies/mL, %"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Khoảng tham chiếu</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={referenceRange}
                        onChange={e => setReferenceRange(e.target.value)}
                        placeholder="e.g., < 40 copies/mL"
                      />
                    </div>
                  </div>
                </div>

                {/* ARV Treatment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Điều trị ARV</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phác đồ ARV <span className="text-red-500">*</span></label>
                      <select
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={arvRegimen}
                        onChange={e => setArvRegimen(e.target.value)}
                        required
                      >
                        <option value="">-- Chọn phác đồ ARV --</option>
                        {regimens.map(regimen => (
                          <option key={regimen._id} value={regimen.arvName}>
                            {regimen.arvName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mã phác đồ</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                        value={regimenCode}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tuyến điều trị</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                        value={treatmentLine}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Đối tượng khuyến cáo</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                        value={recommendedFor}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Thời gian uống thuốc <span className="text-red-500">*</span></label>
                      <input
                        type="time"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medicationTime}
                        onChange={e => setMedicationTime(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Khe thời gian uống thuốc</label>
                      <select
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medicationSlot}
                        onChange={e => setMedicationSlot(e.target.value)}
                      >
                        <option value="">-- Chọn khe thời gian --</option>
                        <option value="Sáng">Sáng</option>
                        <option value="Tối">Tối</option>
                        <option value="Sáng và Tối">Sáng và Tối</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Ngày tái khám <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={reExaminationDate}
                        onChange={e => setReExaminationDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Thông tin thuốc (có thể chỉnh sửa)</label>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border mb-2">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1">Thuốc</th>
                            <th className="border px-2 py-1">Liều</th>
                            <th className="border px-2 py-1">Tần suất</th>
                            <th className="border px-2 py-1">CCI</th>
                            <th className="border px-2 py-1">TDP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {drugs.map((drug, i) => (
                            <tr key={i}>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  className="w-full border rounded px-2 py-1 bg-gray-100"
                                  value={drug}
                                  readOnly
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={dosages[i] || ''}
                                  onChange={e => {
                                    const updated = [...dosages];
                                    updated[i] = e.target.value;
                                    setDosages(updated);
                                  }}
                                  placeholder="e.g., 300mg"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <select
                                  className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={frequencies[i] || ''}
                                  onChange={e => {
                                    const updated = [...frequencies];
                                    updated[i] = e.target.value;
                                    setFrequencies(updated);
                                  }}
                                >
                                  <option value="">-- Chọn tần suất --</option>
                                  <option value="Một lần/ngày">Một lần/ngày</option>
                                  <option value="Hai lần/ngày">Hai lần/ngày</option>
                                  <option value="Ba lần/ngày">Ba lần/ngày</option>
                                  <option value="Khác">Khác</option>
                                </select>
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={contraindications[i] || ''}
                                  onChange={e => {
                                    const updated = [...contraindications];
                                    updated[i] = e.target.value;
                                    setContraindications(updated);
                                  }}
                                  placeholder="e.g., Dị ứng thuốc"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={sideEffects[i] || ''}
                                  onChange={e => {
                                    const updated = [...sideEffects];
                                    updated[i] = e.target.value;
                                    setSideEffects(updated);
                                  }}
                                  placeholder="e.g., Buồn nôn"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tải lượng HIV</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={hivLoad}
                      onChange={e => setHivLoad(e.target.value)}
                      placeholder="e.g., < 40 copies/mL"
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="mb-2 text-sm text-gray-600 font-medium">Chọn trạng thái gửi hồ sơ <span className="text-red-500">*</span></div>
                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      className={`px-5 py-3 border-2 rounded-lg shadow flex items-center gap-2 text-base font-semibold transition-all duration-150
                        ${selectedStatusForSubmit === 're-examination'
                          ? 'border-purple-600 bg-purple-500 text-white ring-2 ring-purple-400'
                          : 'border-purple-400 bg-purple-100 text-purple-700 hover:bg-purple-200'}
                      `}
                      onClick={() => setSelectedStatusForSubmit('re-examination')}
                    >
                      <CalendarClock className="w-6 h-6" />
                      Tái khám
                    </button>
                    <button
                      type="button"
                      className={`px-5 py-3 border-2 rounded-lg shadow flex items-center gap-2 text-base font-semibold transition-all duration-150
                        ${selectedStatusForSubmit === 'completed'
                          ? 'border-green-600 bg-green-500 text-white ring-2 ring-green-400'
                          : 'border-green-400 bg-green-100 text-green-700 hover:bg-green-200'}
                      `}
                      onClick={() => setSelectedStatusForSubmit('completed')}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      Hoàn tất
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
                  onClick={handleCloseMedicalModal}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${selectedBooking && (medicalRecordSent[selectedBooking._id!] || !!hasResult) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={selectedBooking ? (medicalRecordSent[selectedBooking._id!] || !!hasResult) : true}
                >
                  {!!hasResult
                    ? 'Đã có kết quả, không thể gửi'
                    : selectedBooking && medicalRecordSent[selectedBooking._id!] ? 'Đã gửi hồ sơ' : 'Lưu hồ sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;