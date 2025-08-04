import type React from "react"
import { toast } from "react-toastify"
import type { Booking } from "../../types/booking" // Assuming this path is correct
import type { User } from "../../types/user" // Assuming this path is correct
import type { ARVRegimen } from "../../types/arvRegimen" // Assuming this path is correct
import GeneralInfoForm from "./general-info-form"
import ExamInfoForm from "../../components/medical-record/exam-info-form"
import LabTestInfoForm from "./lab-test-info-form"
import ArvTreatmentForm from "./arv-treatment-form"
import StatusSelectionForm from "../../components/medical-record/status-selection-form"
import { Result } from "../../types/result"
import { getResultById, getResultsByBookingId, getResultsByUserId } from "../../api/resultApi"; // đúng path của bạn
import { useEffect, useState } from "react"

interface MedicalRecordModalProps {
    openMedicalModal: boolean
    selectedBooking: Booking
    handleCloseMedicalModal: () => void
    hasResult: boolean
    medicalRecordSent: { [bookingId: string]: boolean }
    setMedicalRecordSent: React.Dispatch<React.SetStateAction<{ [bookingId: string]: boolean }>>
    addResult: (resultData: any) => Promise<void>
    handleStatusChange: (bookingId: string, newStatus: Booking["status"]) => Promise<void>
    createArv: (arvData: any) => Promise<ARVRegimen | null>
    user: User | null
    regimens: ARVRegimen[]
    showArvSection: boolean
    isRegimenModified: () => boolean

    // Medical Record Form States
    medicalDate: string
    setMedicalDate: (date: string) => void
    medicalType: string
    setMedicalType: (type: string) => void
    diagnosis: string
    setDiagnosis: (diagnosis: string) => void
    arvRegimenId: string
    setArvRegimenId: (id: string) => void
    hivLoad: string
    setHivLoad: (load: string) => void
    medicationTime: string
    setMedicationTime: (time: string) => void
    medicationTimes: string[]
    setMedicationTimes: (times: string[]) => void
    reExaminationDate: string
    setReExaminationDate: (date: string) => void
    symptoms: string
    setSymptoms: (symptoms: string) => void
    weight: string
    setWeight: (weight: string) => void
    height: string
    setHeight: (height: string) => void
    bmi: string
    setBmi: (bmi: string) => void
    bloodPressure: string
    setBloodPressure: (bp: string) => void
    pulse: string
    setPulse: (pulse: string) => void
    temperature: string
    setTemperature: (temp: string) => void
    sampleType: string
    setSampleType: (type: string) => void
    testMethod: string
    setTestMethod: (method: string) => void
    resultType: "positive-negative" | "quantitative" | "other" | ""
    setResultType: (type: "positive-negative" | "quantitative" | "other" | "") => void
    testResult: string
    setTestResult: (result: string) => void
    testValue: string
    setTestValue: (value: string) => void
    unit: string
    setUnit: (unit: string) => void
    referenceRange: string
    setReferenceRange: (range: string) => void
    medicationSlot: string
    setMedicationSlot: (slot: string) => void
    selectedStatusForSubmit: "re-examination" | "completed" | null
    setSelectedStatusForSubmit: (status: "re-examination" | "completed" | null) => void
    viralLoad: number
    setViralLoad: (load: number) => void
    viralLoadReference: string
    setViralLoadReference: (reference: string) => void
    viralLoadInterpretation: "undetectable" | "low" | "high"
    setViralLoadInterpretation: (interpretation: "undetectable" | "low" | "high") => void
    cd4Count: number
    setCd4Count: (count: number) => void
    cd4Reference: string
    setCd4Reference: (reference: string) => void
    cd4Interpretation: "normal" | "low" | "very_low"
    setCd4Interpretation: (interpretation: "normal" | "low" | "very_low") => void
    coInfections: string[]
    setCoInfections: (infections: string[]) => void
    p24Antigen: string
    setP24Antigen: (antigen: string) => void
    hivAntibody: string
    setHivAntibody: (antibody: string) => void
    interpretationNote: string
    setInterpretationNote: (note: string) => void

    // ARV Editable Fields
    arvName: string
    setArvName: (name: string) => void
    regimenCode: string
    setRegimenCode: (code: string) => void
    treatmentLine: string
    setTreatmentLine: (line: string) => void
    recommendedFor: string
    setRecommendedFor: (forWho: string) => void
    arvDescription: string
    setArvDescription: (desc: string) => void
    drugs: string[]
    setDrugs: (drugs: string[]) => void
    dosages: string[]
    setDosages: (dosages: string[]) => void
    frequencies: string[]
    setFrequencies: (frequencies: string[]) => void
    contraindications: string[]
    setContraindications: (contra: string[]) => void
    sideEffects: string[]
    setSideEffects: (effects: string[]) => void
    originalRegimen: any | null
    setOriginalRegimen: (regimen: any | null) => void
    arvError: string | null
    setArvError: (error: string | null) => void
    slotToTimeCount: { [key: string]: string[] }
    addDrugRow: () => void
    removeDrugRow: (index: number) => void
    addContraindication: () => void
    removeContraindication: (index: number) => void
    addSideEffect: () => void
    removeSideEffect: (index: number) => void
    mapFrequencyToNumeric: (freq: string) => string
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
    openMedicalModal,
    selectedBooking,
    handleCloseMedicalModal,
    hasResult,
    medicalRecordSent,
    setMedicalRecordSent,
    addResult,
    handleStatusChange,
    createArv,
    user,
    regimens,
    showArvSection,
    isRegimenModified,
    // Medical Record Form States
    medicalDate,
    setMedicalDate,
    medicalType,
    setMedicalType,
    diagnosis,
    setDiagnosis,
    arvRegimenId,
    setArvRegimenId,
    hivLoad,
    setHivLoad,
    medicationTime,
    setMedicationTime,
    medicationTimes,
    setMedicationTimes,
    reExaminationDate,
    setReExaminationDate,
    symptoms,
    setSymptoms,
    weight,
    setWeight,
    height,
    setHeight,
    bmi,
    setBmi,
    bloodPressure,
    setBloodPressure,
    pulse,
    setPulse,
    temperature,
    setTemperature,
    sampleType,
    setSampleType,
    testMethod,
    setTestMethod,
    resultType,
    setResultType,
    testResult,
    setTestResult,
    testValue,
    setTestValue,
    unit,
    setUnit,
    referenceRange,
    setReferenceRange,
    medicationSlot,
    setMedicationSlot,
    selectedStatusForSubmit,
    setSelectedStatusForSubmit,
    viralLoad,
    setViralLoad,
    viralLoadReference,
    setViralLoadReference,
    viralLoadInterpretation,
    setViralLoadInterpretation,
    cd4Count,
    setCd4Count,
    cd4Reference,
    setCd4Reference,
    cd4Interpretation,
    setCd4Interpretation,
    coInfections,
    setCoInfections,
    p24Antigen,
    setP24Antigen,
    hivAntibody,
    setHivAntibody,
    interpretationNote,
    setInterpretationNote,
    // ARV Editable Fields
    arvName,
    setArvName,
    regimenCode,
    setRegimenCode,
    treatmentLine,
    setTreatmentLine,
    recommendedFor,
    setRecommendedFor,
    arvDescription,
    setArvDescription,
    drugs,
    setDrugs,
    dosages,
    setDosages,
    frequencies,
    setFrequencies,
    contraindications,
    setContraindications,
    sideEffects,
    setSideEffects,
    originalRegimen,
    setOriginalRegimen,
    arvError,
    setArvError,
    slotToTimeCount,
    addDrugRow,
    removeDrugRow,
    addContraindication,
    removeContraindication,
    addSideEffect,
    removeSideEffect,
    mapFrequencyToNumeric,
}) => {
    if (!openMedicalModal || !selectedBooking) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const bookingId = selectedBooking?._id
        if (!bookingId) {
            toast.error("Thiếu thông tin booking!")
            return
        }
        if (hasResult) {
            toast.error("Booking này đã có kết quả, không thể gửi thêm!")
            return
        }
        if (medicalRecordSent[bookingId]) {
            toast.error("Hồ sơ bệnh án đã được gửi!")
            return
        }
        if (!selectedStatusForSubmit) {
            toast.error("Vui lòng chọn trạng thái gửi!")
            return
        }
        if (!diagnosis) {
            toast.error("Vui lòng nhập chẩn đoán!")
            return
        }

        let arvregimenId = "default" // Fallback value
        if (showArvSection) {
            if (!arvRegimenId && !arvName) {
                toast.error("Vui lòng chọn hoặc nhập phác đồ ARV!")
                return
            }
            if (!medicationSlot) {
                toast.error("Vui lòng chọn khe thời gian uống thuốc!")
                return
            }
            if (medicationTimes.length !== slotToTimeCount[medicationSlot]?.length || medicationTimes.some((t) => !t)) {
                toast.error("Vui lòng nhập đầy đủ thời gian uống thuốc cho các khe đã chọn!")
                return
            }
            if (!reExaminationDate) {
                toast.error("Vui lòng nhập ngày tái khám!")
                return
            }
            if (!drugs.length || drugs.some((d) => !d)) {
                toast.error("Vui lòng nhập đầy đủ thông tin thuốc!")
                return
            }
            if (dosages.length !== drugs.length || dosages.some((d) => !d)) {
                toast.error("Vui lòng nhập đầy đủ liều dùng!")
                return
            }
            if (frequencies.length !== drugs.length || frequencies.some((f) => !f)) {
                toast.error("Vui lòng nhập đầy đủ tần suất!")
                return
            }

            if (isRegimenModified()) {
                try {
                    const newRegimen = await createArv({
                        arvName: arvName || `Custom Regimen ${new Date().toISOString()}`,
                        regimenCode: regimenCode || undefined,
                        treatmentLine:
                            treatmentLine === "First-line" || treatmentLine === "Second-line" || treatmentLine === "Third-line"
                                ? treatmentLine
                                : undefined,
                        recommendedFor: recommendedFor || undefined,
                        arvDescription: arvDescription || undefined,
                        drugs,
                        dosages,
                        frequency: frequencies.map(mapFrequencyToNumeric).join(";"),
                        contraindications: contraindications.filter((c) => c) || undefined,
                        sideEffects: sideEffects.filter((s) => s) || undefined,
                        userId: user ?? undefined,
                    })
                    arvregimenId = newRegimen && newRegimen._id ? newRegimen._id : "default"
                } catch (err: any) {
                    toast.error(err.message || "Không thể tạo phác đồ ARV tùy chỉnh!")
                    return
                }
            } else {
                arvregimenId = arvRegimenId
            }
        }
        try {
            await addResult({
                resultName: diagnosis,
                resultDescription: showArvSection ? hivLoad || undefined : undefined,
                bookingId,
                arvregimenId,
                reExaminationDate: showArvSection ? reExaminationDate : "",
                medicationTime: showArvSection ? medicationTimes.join(";") : undefined,
                medicationSlot: showArvSection ? medicationSlot || undefined : undefined,
                symptoms: symptoms || undefined,
                weight: weight ? Number.parseFloat(weight) : undefined,
                height: height ? Number.parseFloat(height) : undefined,
                bmi: bmi ? Number.parseFloat(bmi) : undefined,
                bloodPressure: bloodPressure || undefined,
                pulse: pulse ? Number.parseInt(pulse) : undefined,
                temperature: temperature ? Number.parseFloat(temperature) : undefined,
                sampleType: sampleType || undefined,
                testMethod: testMethod || undefined,
                unit: unit || undefined,
                testResult: resultType === "positive-negative" ? testResult : undefined,
                testValue: resultType === "quantitative" ? testValue : undefined,
                viralLoad: typeof viralLoad === "number" ? viralLoad : 
                viralLoad !== "" && !isNaN(Number(viralLoad)) ? Number(viralLoad) : undefined,
                viralLoadReference: viralLoadReference || undefined,
                viralLoadInterpretation: viralLoadInterpretation || undefined,
                cd4Count: typeof cd4Count === "number" ? cd4Count : 
                cd4Count !== "" && !isNaN(Number(cd4Count)) ? Number(cd4Count) : undefined,
                cd4Reference: cd4Reference || undefined,
                cd4Interpretation: cd4Interpretation || undefined,
                coInfections: coInfections.filter((c) => c) || undefined,
                p24Antigen: p24Antigen || undefined,
                hivAntibody: hivAntibody || undefined,
                interpretationNote: interpretationNote || undefined,
                note: isLabTest ? consultationNote : undefined, // 🟢 thêm dòng này
            })
            setMedicalRecordSent((prev) => ({
                ...prev,
                [bookingId]: true,
            }))
            await handleStatusChange(bookingId, selectedStatusForSubmit!)
            toast.success("Đã tạo hồ sơ bệnh án!")
            handleCloseMedicalModal()
        } catch (err: any) {
            console.error("Form submission error:", err)
            toast.error(err.message || "Lưu hồ sơ thất bại!")
        }
    }

    const isLabTest = typeof selectedBooking?.serviceId === "object" && selectedBooking.serviceId?.isLabTest
    const isArvTest = typeof selectedBooking?.serviceId === "object" && selectedBooking.serviceId?.isArvTest


    const [userResults, setUserResults] = useState<Result[]>([]);
    const [labResult, setLabResult] = useState<Result | null>(null)
    const [consultationNote, setConsultationNote] = useState("")

    useEffect(() => {
        const fetchUserResults = async () => {
            if (!openMedicalModal || !selectedBooking?.userId) return;

            const userId =
                typeof selectedBooking.userId === "string"
                    ? selectedBooking.userId
                    : selectedBooking.userId?._id;

            if (!userId) return;

            try {
                const data = await getResultsByUserId(userId);
                setUserResults(data || []);
            } catch (error) {
                console.error("Lỗi getResultsByUserId:", error);
            }
        };

        fetchUserResults();
    }, [openMedicalModal, selectedBooking?.userId]);

    useEffect(() => {
        const fetchResultByBookingId = async () => {
            if (!isLabTest || !selectedBooking?._id) return
            try {
                const res = await getResultsByBookingId(selectedBooking?._id)
                setLabResult(Array.isArray(res) ? res[0] || null : res)
            } catch (err) {
                console.error("Lỗi lấy result theo bookingId:", err)
            }
        }

        fetchResultByBookingId()
    }, [selectedBooking?._id, isLabTest])

    const toStringOrEmpty = (value: number | string | undefined | null): string =>
  value !== undefined && value !== null ? value.toString() : "";

 useEffect(() => {
  if (labResult) {
    setWeight(toStringOrEmpty(labResult.weight));
    setHeight(toStringOrEmpty(labResult.height));
    setPulse(labResult.pulse?.toString() || "");
    setTemperature(labResult.temperature?.toString() || "");
    setBloodPressure(labResult.bloodPressure?.toString() || "");
    setSymptoms(labResult.symptoms?.toString() || "");
    setDiagnosis(labResult.resultName?.toString() || "");
    setSampleType(labResult.sampleType?.toString() || "");
    setTestMethod(labResult.testMethod?.toString() || "");
    setUnit(labResult.unit?.toString() || "");
    setResultType(
      labResult.testResult === "positive" || labResult.testResult === "negative"
        ? "positive-negative"
        : labResult.testResult === "invalid"
        ? "quantitative"
        : "other"
    );
    setTestResult(labResult.testResult?.toString() || "");
    setBmi(labResult.bmi?.toString() || "");
    setConsultationNote(labResult.interpretationNote || "");
    setMedicationSlot(labResult.medicationSlot || "");
    setMedicationTimes(labResult.medicationTime ? labResult.medicationTime.split(";") : []);
    
    if (typeof setViralLoad === "function") {
      setViralLoad(typeof labResult.viralLoad === "number" ? labResult.viralLoad : 0);
    } else {
      console.error("setViralLoad is not a function");
    }
    
    setViralLoadReference(labResult.viralLoadReference || "");
    setViralLoadInterpretation(labResult.viralLoadInterpretation || "undetectable");
    
    if (typeof setCd4Count === "function") {
      setCd4Count(typeof labResult.cd4Count === "number" ? labResult.cd4Count : 0);
    } else {
      console.error("setCd4Count is not a function");
    }
    
    setCd4Reference(labResult.cd4Reference || "");
    setCd4Interpretation(labResult.cd4Interpretation || "normal");
    setCoInfections(labResult.coInfections || []);
    setP24Antigen(toStringOrEmpty(labResult.p24Antigen));
    setHivAntibody(toStringOrEmpty(labResult.hivAntibody));
    setInterpretationNote(labResult.interpretationNote || "");
  }
}, [labResult]);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Tạo hồ sơ bệnh án</h2>
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-6 border border-blue-100">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                        Bệnh nhân: {selectedBooking.customerName} (Mã booking: {selectedBooking.bookingCode})
                    </p>
                    <p className="text-sm text-gray-600">
                        Ngày khám: {new Date(medicalDate).toLocaleDateString("vi-VN")} | Loại khám: {medicalType}
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {isLabTest && labResult && (
                            <div className="p-4 border rounded-lg bg-gray-50 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Kết quả xét nghiệm</h3>
                                <p><strong>Tên kết quả:</strong> {labResult.resultName}</p>
                                <p><strong>Mô tả:</strong> {labResult.resultDescription}</p>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú gửi tư vấn</label>
                                    <textarea
                                        className="w-full border rounded-xl p-2 text-sm"
                                        rows={3}
                                        placeholder="Nhập ghi chú cho bác sĩ tư vấn..."
                                        value={consultationNote}
                                        onChange={(e) => setConsultationNote(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <GeneralInfoForm
                            medicalDate={medicalDate}
                            setMedicalDate={setMedicalDate}
                            medicalType={medicalType}
                            setMedicalType={setMedicalType}
                            weight={weight ? Number(weight) : undefined}
                            setWeight={(w) => setWeight(String(w))}
                            height={height ? Number(height) : undefined}
                            setHeight={(h) => setHeight(String(h))}
                            bmi={bmi ? Number(bmi) : undefined}
                            labResult={labResult}
                        />
                        <ExamInfoForm
                            bloodPressure={bloodPressure}
                            setBloodPressure={setBloodPressure}
                            pulse={pulse}
                            setPulse={setPulse}
                            temperature={temperature}
                            setTemperature={setTemperature}
                            symptoms={symptoms}
                            setSymptoms={setSymptoms}
                            diagnosis={diagnosis}
                            setDiagnosis={setDiagnosis}
                        />
                        <LabTestInfoForm
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
                        />
                        {isArvTest && showArvSection && (
                            <ArvTreatmentForm
                                arvRegimenId={arvRegimenId}
                                setArvRegimenId={setArvRegimenId}
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
                                medicationSlot={medicationSlot}
                                setMedicationSlot={setMedicationSlot}
                                medicationTimes={medicationTimes}
                                setMedicationTimes={setMedicationTimes}
                                reExaminationDate={reExaminationDate}
                                setReExaminationDate={setReExaminationDate}
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
                                hivLoad={hivLoad}
                                setHivLoad={setHivLoad}
                                regimens={regimens}
                                hasResult={hasResult}
                                arvError={arvError}
                                slotToTimeCount={slotToTimeCount}
                                addDrugRow={addDrugRow}
                                removeDrugRow={removeDrugRow}
                                addContraindication={addContraindication}
                                removeContraindication={removeContraindication}
                                addSideEffect={addSideEffect}
                                removeSideEffect={removeSideEffect}
                            />
                        )}
                        <StatusSelectionForm
                            selectedStatusForSubmit={selectedStatusForSubmit}
                            setSelectedStatusForSubmit={setSelectedStatusForSubmit}
                            selectedBooking={selectedBooking}
                        />
                    </div>
                    {userResults.length > 0 && (
                        <div className="mt-6 p-4 border rounded-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Tất cả kết quả xét nghiệm / điều trị trước đó
                            </h3>
                            <ul className="space-y-3 max-h-[300px] overflow-auto">
                                {userResults.map((result, idx) => (
                                    <li key={result._id} className="p-3 border rounded shadow-sm bg-white">
                                        <p><strong>#{idx + 1}:</strong> {result.resultName}</p>
                                        {result.resultDescription && <p><strong>Mô tả:</strong> {result.resultDescription}</p>}
                                        {result.reExaminationDate && (
                                            <p><strong>Ngày tái khám:</strong> {new Date(result.reExaminationDate).toLocaleDateString("vi-VN")}</p>
                                        )}
                                        <p className="text-xs text-gray-500 italic">Booking: {result.bookingId?.serviceId?.serviceName}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

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
                ${selectedBooking && (medicalRecordSent[selectedBooking._id!] || !!hasResult)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                                }`}
                            disabled={selectedBooking ? medicalRecordSent[selectedBooking._id!] || !!hasResult : true}
                        >
                            {!!hasResult
                                ? "Đã có kết quả, không thể gửi"
                                : selectedBooking && medicalRecordSent[selectedBooking._id!]
                                    ? "Đã gửi hồ sơ"
                                    : "Lưu hồ sơ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MedicalRecordModal
