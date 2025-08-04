import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Calendar, Loader, AlertTriangle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import type { Booking } from "../../types/booking" // Assuming this path is correct
import { useBooking } from "../../context/BookingContext" // Assuming this path is correct
import { useArv } from "../../context/ArvContext" // Assuming this path is correct
import { useResult } from "../../context/ResultContext" // Assuming this path is correct
import { useAuth } from "../../context/AuthContext" // Assuming this path is correct

// Import new components
import BookingFilters from "../../components/booking/booking-filters"
import BookingList from "../../components/booking/booking-list"
import BookingCalendar from "../../components/booking/booking-calendar"
import MedicalRecordModal from "../../components/medical-record/medical-record-modal"

// Import utility functions
import { isSameDayLocal, parseBookingDateLocal } from "../../utils/date"
import { mapFrequencyToNumeric } from "../../utils/arv"

const AppointmentManagement: React.FC = () => {
  const { getAll, update } = useBooking()
  const { regimens, create: createArv } = useArv()
  const { addResult, results } = useResult()
  const { user, getUserById } = useAuth()

  // State for filters and search
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date())

  // State for bookings data
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for medical record modal
  const [openMedicalModal, setOpenMedicalModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [medicalRecordSent, setMedicalRecordSent] = useState<{
    [bookingId: string]: boolean
  }>({})

  // State for Medical Record fields (moved from original component)
  const [medicalDate, setMedicalDate] = useState("")
  const [medicalType, setMedicalType] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [arvRegimenId, setArvRegimenId] = useState("")
  const [hivLoad, setHivLoad] = useState("")
  const [medicationTime, setMedicationTime] = useState("")
  const [medicationTimes, setMedicationTimes] = useState<string[]>([])
  const [reExaminationDate, setReExaminationDate] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [bmi, setBmi] = useState("")
  const [bloodPressure, setBloodPressure] = useState("")
  const [pulse, setPulse] = useState("")
  const [temperature, setTemperature] = useState("")
  const [sampleType, setSampleType] = useState("")
  const [testMethod, setTestMethod] = useState("")
  const [resultType, setResultType] = useState<"positive-negative" | "quantitative" | "other" | "">("")
  const [testResult, setTestResult] = useState("")
  const [testValue, setTestValue] = useState("")
  const [unit, setUnit] = useState("")
  const [referenceRange, setReferenceRange] = useState("")
  const [medicationSlot, setMedicationSlot] = useState("")
  const [selectedStatusForSubmit, setSelectedStatusForSubmit] = useState<"re-examination" | "completed" | null>(null)
  const [viralLoad, setViralLoad] = useState<number | null>(null)
  const [cd4Count, setCd4Count] = useState<number | null>(null)
  const [cd4Reference, setCd4Reference] = useState("")
  const [cd4Interpretation, setCd4Interpretation] = useState<"normal" | "low" | "very_low">("normal")
  const [coInfections, setCoInfections] = useState<string[]>([])
  const [viralLoadReference, setViralLoadReference] = useState("")
  const [viralLoadInterpretation, setViralLoadInterpretation] = useState<"undetectable" | "low" | "high">("undetectable")
  const [p24Antigen, setP24Antigen] = useState("")
  const [hivAntibody, setHivAntibody] = useState("")
  const [interpretationNote, setInterpretationNote] = useState("")


  // State for editable ARV fields
  const [arvName, setArvName] = useState("")
  const [regimenCode, setRegimenCode] = useState("")
  const [treatmentLine, setTreatmentLine] = useState("")
  const [recommendedFor, setRecommendedFor] = useState("")
  const [arvDescription, setArvDescription] = useState("")
  const [drugs, setDrugs] = useState<string[]>([])
  const [dosages, setDosages] = useState<string[]>([])
  const [frequencies, setFrequencies] = useState<string[]>([])
  const [contraindications, setContraindications] = useState<string[]>([])
  const [sideEffects, setSideEffects] = useState<string[]>([])
  const [originalRegimen, setOriginalRegimen] = useState<any | null>(null)
  const [arvError, setArvError] = useState<string | null>(null)

  const hasResult = selectedBooking && results.some((r) => r.bookingId && r.bookingId._id === selectedBooking._id)

  const bookingDates = useMemo(
    () =>
      bookings
        .filter((b) => typeof b.serviceId === "object" && b.serviceId?.isArvTest === true || b.serviceId?.isLabTest === true)
        .map((b) => parseBookingDateLocal(b.bookingDate)),
    [bookings],
  )

  // Map medication slots to time input labels
  const slotToTimeCount: { [key: string]: string[] } = {
    Sáng: ["Sáng"],
    Trưa: ["Trưa"],
    Tối: ["Tối"],
    "Sáng và Trưa": ["Sáng", "Trưa"],
    "Trưa và Tối": ["Trưa", "Tối"],
    "Sáng và Tối": ["Sáng", "Tối"],
    "Sáng, Trưa và Tối": ["Sáng", "Trưa", "Tối"],
  }

  // Update medicationTimes when medicationSlot changes
  useEffect(() => {
    const timeSlots = slotToTimeCount[medicationSlot] || []
    setMedicationTimes((prev) => {
      const newTimes = timeSlots.map((_, i) => prev[i] || "")
      return newTimes
    })
  }, [medicationSlot])

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const weightNum = Number.parseFloat(weight)
      const heightNum = Number.parseFloat(height) / 100
      if (weightNum > 0 && heightNum > 0) {
        const calculatedBmi = (weightNum / (heightNum * heightNum)).toFixed(2)
        setBmi(calculatedBmi)
      } else {
        setBmi("")
      }
    } else {
      setBmi("")
    }
  }, [weight, height])

  // Update ARV fields when regimen is selected
  useEffect(() => {
    if (arvRegimenId) {
      const regimen = regimens.find((r) => r._id === arvRegimenId)
      if (regimen) {
        setArvName(regimen.arvName || "")
        setRegimenCode(regimen.regimenCode || "")
        setTreatmentLine(regimen.treatmentLine || "")
        setRecommendedFor(regimen.recommendedFor || "")
        setArvDescription(regimen.arvDescription || "")
        setDrugs(regimen.drugs || [])
        setDosages(regimen.dosages || [])
        setFrequencies((regimen.frequency || "").split(";"))
        setContraindications(regimen.contraindications || [])
        setSideEffects(regimen.sideEffects || [])
        setOriginalRegimen(regimen)
      }
    } else {
      // Reset fields when no regimen is selected
      setArvName("")
      setRegimenCode("")
      setTreatmentLine("")
      setRecommendedFor("")
      setArvDescription("")
      setDrugs([])
      setDosages([])
      setFrequencies([])
      setContraindications([])
      setSideEffects([])
      setOriginalRegimen(null)
    }
  }, [arvRegimenId, regimens])

  const anonymizeName = useCallback((name: string): string => {
    if (!name) return "Không xác định"
    const words = name.trim().split(" ")
    if (words.length === 1) {
      return words[0].charAt(0) + "*".repeat(words[0].length - 1)
    }
    return (
      words[0].charAt(0) +
      "*".repeat(words[0].length - 1) +
      " " +
      words[words.length - 1].charAt(0) +
      "*".repeat(words[words.length - 1].length - 1)
    )
  }, [])

  const getPatientDisplayInfo = useCallback(
    (booking: Booking) => {
      const isAnonymous = booking.isAnonymous
      if (isAnonymous) {
        return {
          name: anonymizeName(booking.customerName || ""),
          phone: "***-***-****",
          email: "***@***.***",
          doctorName: booking.doctorName || "",
        }
      }
      return {
        name: booking.customerName || "Không xác định",
        phone: booking.customerPhone || "Không có",
        email: booking.customerEmail || "Không có",
        doctorName: booking.doctorName || "Chưa phân công",
      }
    },
    [anonymizeName],
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAll()
        if (user && user.role === "doctor" && user.userName) {
          const filteredBookings = data.filter((booking: Booking) => booking.doctorName === user.userName)
          setBookings(filteredBookings)
        } else {
          setBookings(data)
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu")
        toast.error(err.message || "Không thể tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [getAll, user])

  const handleStatusChange = useCallback(
    async (id: string, newStatus: Booking["status"]) => {
      try {
        await update(id, { status: newStatus })
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)))
      } catch (err: any) {
        toast.error(err.message || "Cập nhật thất bại")
      }
    },
    [update],
  )

  // Callback để refresh danh sách booking sau khi cập nhật
  const handleBookingUpdate = useCallback(async () => {
    try {
      const data = await getAll()
      if (user && user.role === "doctor" && user.userName) {
        const filteredBookings = data.filter((booking: Booking) => booking.doctorName === user.userName)
        setBookings(filteredBookings)
      } else {
        setBookings(data)
      }
    } catch (err: any) {
      console.error("Error refreshing bookings:", err)
    }
  }, [getAll, user])

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchSearch =
          booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          booking.customerPhone?.includes(search) ||
          booking.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
          booking.bookingCode?.toLowerCase().includes(search.toLowerCase())
        const matchDate = !selectedDate || isSameDayLocal(parseBookingDateLocal(booking.bookingDate), selectedDate)
        const matchStatus = selectedStatus === "all" || booking.status === selectedStatus
        const serviceObj = typeof booking.serviceId === "object" ? booking.serviceId : null
        // Chỉ lấy các booking có dịch vụ isArvTest: true
        return matchSearch && matchDate && matchStatus && serviceObj && (serviceObj.isArvTest === true || serviceObj.isLabTest === true)
      }),
    [bookings, search, selectedDate, selectedStatus],
  )

  const sortedBookings = useMemo(
    () => [...filteredBookings].sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()),
    [filteredBookings],
  )

  const handleCloseMedicalModal = useCallback(() => {
    setOpenMedicalModal(false)
    setDiagnosis("")
    setArvRegimenId("")
    setHivLoad("")
    setMedicationTime("")
    setMedicationTimes([])
    setReExaminationDate("")
    setSelectedStatusForSubmit(null)
    setSymptoms("")
    setWeight("")
    setHeight("")
    setBmi("")
    setBloodPressure("")
    setPulse("")
    setTemperature("")
    setSampleType("")
    setTestMethod("")
    setResultType("")
    setTestResult("")
    setTestValue("")
    setUnit("")
    setReferenceRange("")
    setMedicationSlot("")
    setArvName("")
    setRegimenCode("")
    setTreatmentLine("")
    setRecommendedFor("")
    setArvDescription("")
    setDrugs([])
    setDosages([])
    setFrequencies([])
    setContraindications([])
    setSideEffects([])
    setOriginalRegimen(null)
  }, [])

  // Determine if ARV section should be shown
  const showArvSection = useMemo(() => {
    if (!selectedBooking || !selectedBooking.serviceId || typeof selectedBooking.serviceId !== "object") {
      return false
    }
    return selectedBooking.serviceId.isArvTest || selectedBooking.serviceId.isLabTest
  }, [selectedBooking])

  // Handle adding a new drug row
  const addDrugRow = useCallback(() => {
    setDrugs((prev) => [...prev, ""])
    setDosages((prev) => [...prev, ""])
    setFrequencies((prev) => [...prev, ""])
  }, [])

  // Handle removing a drug row
  const removeDrugRow = useCallback((index: number) => {
    setDrugs((prev) => prev.filter((_, i) => i !== index))
    setDosages((prev) => prev.filter((_, i) => i !== index))
    setFrequencies((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Handle adding a contraindication
  const addContraindication = useCallback(() => {
    setContraindications((prev) => [...prev, ""])
  }, [])

  // Handle removing a contraindication
  const removeContraindication = useCallback((index: number) => {
    setContraindications((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Handle adding a side effect
  const addSideEffect = useCallback(() => {
    setSideEffects((prev) => [...prev, ""])
  }, [])

  // Handle removing a side effect
  const removeSideEffect = useCallback((index: number) => {
    setSideEffects((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Check if regimen has been modified
  const isRegimenModified = useCallback(() => {
    if (!originalRegimen) return true
    return (
      arvName !== originalRegimen.arvName ||
      regimenCode !== (originalRegimen.regimenCode || "") ||
      treatmentLine !== (originalRegimen.treatmentLine || "") ||
      recommendedFor !== (originalRegimen.recommendedFor || "") ||
      arvDescription !== (originalRegimen.arvDescription || "") ||
      JSON.stringify(drugs) !== JSON.stringify(originalRegimen.drugs || []) ||
      JSON.stringify(dosages) !== JSON.stringify(originalRegimen.dosages || []) ||
      JSON.stringify(frequencies) !== JSON.stringify((originalRegimen.frequency || "").split(";")) ||
      JSON.stringify(contraindications) !== JSON.stringify(originalRegimen.contraindications || []) ||
      JSON.stringify(sideEffects) !== JSON.stringify(originalRegimen.sideEffects || [])
    )
  }, [
    arvName,
    regimenCode,
    treatmentLine,
    recommendedFor,
    arvDescription,
    drugs,
    dosages,
    frequencies,
    contraindications,
    sideEffects,
    originalRegimen,
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Lịch Hẹn</h1>
          </div>
          <p className="text-gray-600">
            Quản lý và theo dõi lịch hẹn khám HIV. Thông tin ẩn danh chỉ áp dụng cho booking ẩn danh.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters and Bookings List */}
          <div className="flex-1 order-2 lg:order-1">
            <BookingFilters
              search={search}
              setSearch={setSearch}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              setCalendarDate={setCalendarDate}
            />

            {loading && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="flex flex-col items-center">
                  <Loader className="h-10 w-10 animate-spin text-teal-600" />
                  <span className="mt-4 text-lg text-gray-600">Đang tải dữ liệu lịch hẹn...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-white rounded-2xl shadow border p-12 text-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <p className="text-red-700 font-medium text-lg">Lỗi tải dữ liệu</p>
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

            {!loading && !error && (
              <BookingList
                sortedBookings={sortedBookings}
                search={search}
                selectedDate={selectedDate}
                selectedStatus={selectedStatus}
                getPatientDisplayInfo={getPatientDisplayInfo}
                setSelectedBooking={setSelectedBooking}
                setMedicalDate={setMedicalDate}
                setMedicalType={setMedicalType}
                setOpenMedicalModal={setOpenMedicalModal}
                medicalRecordSent={medicalRecordSent}
                hasResult={!!hasResult} 
                loading={false} 
                error={null}
                onBookingUpdate={handleBookingUpdate}
              />
            )}
          </div>

          {/* Right: Calendar */}
          <div className="order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center lg:justify-end">
            <BookingCalendar
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
              setSelectedDate={setSelectedDate}
              bookingDates={bookingDates}
            />
          </div>
        </div>
      </div>

      {/* Medical Record Modal */}
      {openMedicalModal && selectedBooking && (
    <MedicalRecordModal
  openMedicalModal={openMedicalModal}
  selectedBooking={selectedBooking}
  handleCloseMedicalModal={handleCloseMedicalModal}
  hasResult={!!hasResult}
  medicalRecordSent={medicalRecordSent}
  setMedicalRecordSent={setMedicalRecordSent}
  addResult={async (resultData) => { await addResult(resultData) }}
  handleStatusChange={handleStatusChange}
  createArv={createArv}
  user={user}
  regimens={regimens}
  showArvSection={!!showArvSection}
  isRegimenModified={isRegimenModified}

  // Medical Record Form States
  medicalDate={medicalDate}
  setMedicalDate={setMedicalDate}
  medicalType={medicalType}
  setMedicalType={setMedicalType}
  diagnosis={diagnosis}
  setDiagnosis={setDiagnosis}
  arvRegimenId={arvRegimenId}
  setArvRegimenId={setArvRegimenId}
  hivLoad={hivLoad}
  setHivLoad={setHivLoad}
  medicationTime={medicationTime}
  setMedicationTime={setMedicationTime}
  medicationTimes={medicationTimes}
  setMedicationTimes={setMedicationTimes}
  reExaminationDate={reExaminationDate}
  setReExaminationDate={setReExaminationDate}
  symptoms={symptoms}
  setSymptoms={setSymptoms}
  weight={weight}
  setWeight={setWeight}
  height={height}
  setHeight={setHeight}
  bmi={bmi}
  setBmi={setBmi}
  bloodPressure={bloodPressure}
  setBloodPressure={setBloodPressure}
  pulse={pulse}
  setPulse={setPulse}
  temperature={temperature}
  setTemperature={setTemperature}
  sampleType={sampleType}
  setSampleType={setSampleType}
  testMethod={testMethod}
  setTestMethod={setTestMethod}
  resultType={resultType}
  setResultType={setResultType}
  testResult={testResult}
  setTestResult={setTestResult}
  testValue={testValue}
  setTestValue={setTestValue}
  unit={unit}
  setUnit={setUnit}
  referenceRange={referenceRange}
  setReferenceRange={setReferenceRange}
  medicationSlot={medicationSlot}
  setMedicationSlot={setMedicationSlot}
  selectedStatusForSubmit={selectedStatusForSubmit}
  setSelectedStatusForSubmit={setSelectedStatusForSubmit}

  viralLoad={viralLoad ?? 0}
  setViralLoad={setViralLoad}
  viralLoadReference={viralLoadReference}
  setViralLoadReference={setViralLoadReference}
  viralLoadInterpretation={viralLoadInterpretation}
  setViralLoadInterpretation={setViralLoadInterpretation}
  cd4Count={cd4Count ?? 0}
  setCd4Count={setCd4Count}
  cd4Reference={cd4Reference}
  setCd4Reference={setCd4Reference}
  cd4Interpretation={cd4Interpretation}
  setCd4Interpretation={setCd4Interpretation}
  p24Antigen={p24Antigen}
  setP24Antigen={setP24Antigen}
  hivAntibody={hivAntibody}
  setHivAntibody={setHivAntibody}
  interpretationNote={interpretationNote}
  setInterpretationNote={setInterpretationNote}
  coInfections={coInfections}
  setCoInfections={setCoInfections}

  // ARV Editable Fields
  arvName={arvName}
  setArvName={setArvName}
  regimenCode={regimenCode}
  setRegimenCode={setRegimenCode}
  treatmentLine={treatmentLine}
  setTreatmentLine={setTreatmentLine}
  recommendedFor={recommendedFor}
  setRecommendedFor={setRecommendedFor}
  arvDescription={arvDescription}
  setArvDescription={setArvDescription}
  drugs={drugs}
  setDrugs={setDrugs}
  dosages={dosages}
  setDosages={setDosages}
  frequencies={frequencies}
  setFrequencies={setFrequencies}
  contraindications={contraindications}
  setContraindications={setContraindications}
  sideEffects={sideEffects}
  setSideEffects={setSideEffects}
  originalRegimen={originalRegimen}
  setOriginalRegimen={setOriginalRegimen}
  arvError={arvError}
  setArvError={setArvError}
  slotToTimeCount={slotToTimeCount}
  addDrugRow={addDrugRow}
  removeDrugRow={removeDrugRow}
  addContraindication={addContraindication}
  removeContraindication={removeContraindication}
  addSideEffect={addSideEffect}
  removeSideEffect={removeSideEffect}
  mapFrequencyToNumeric={mapFrequencyToNumeric}
/>

      )}
      <ToastContainer />
    </div>
  )
}

export default AppointmentManagement
