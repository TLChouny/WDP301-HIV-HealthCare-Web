import type React from "react"
import { useResult } from "../../context/ResultContext"
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

    const { updateResult } = useResult();
    if (!openMedicalModal || !selectedBooking) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const bookingId = selectedBooking?._id
        if (!bookingId) {
            toast.error("Thiếu thông tin booking!")
            return
        }
        
        // Kiểm tra trạng thái gửi chỉ khi không phải là xét nghiệm
        if (!isLabTest && !selectedStatusForSubmit) {
            toast.error("Vui lòng chọn trạng thái gửi!")
            return
        }
        
        // Đảm bảo có diagnosis (resultName) - trường bắt buộc
        if (!diagnosis) {
            if (isArvTest) {
                // Nếu là ARV test, tự động đặt tên
                setDiagnosis("Kết quả xét nghiệm ARV")
            } else {
                toast.error("Vui lòng nhập chẩn đoán!")
                return
            }
        }

        // Prevent multiple submissions
        if (isSubmitting) {
            return
        }
        
        setIsSubmitting(true)
        
        // Chuẩn bị dữ liệu kết quả
        const resultData = {
            resultName: diagnosis || (isArvTest ? "Kết quả xét nghiệm ARV" : "Kết quả khám"),
            resultDescription: showArvSection ? hivLoad || undefined : undefined,
            bookingId,
            arvregimenId: "default", // Giá trị mặc định, sẽ được cập nhật nếu có phác đồ ARV
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
            p24Antigen: p24Antigen ? Number(p24Antigen.replace(",", ".")) : undefined,
            hivAntibody: hivAntibody ? Number(hivAntibody.replace(",", ".")) : undefined,
            interpretationNote: interpretationNote || undefined,
            notes: isLabTest ? notes : undefined,
            consultationNote: isLabTest ? consultationNote : undefined,
        }

        let arvregimenId = "default" // Fallback value
        if (showArvSection && !isLabTest) {
            // Chỉ tạo phác đồ ARV khi không phải là xét nghiệm (isLabTest = false)
            // if (!arvRegimenId && !arvName) {
            //     toast.error("Vui lòng chọn hoặc nhập phác đồ ARV!")
            //     return
            // }
            // if (!medicationSlot) {
            //     toast.error("Vui lòng chọn khe thời gian uống thuốc!")
            //     return
            // }
            // if (medicationTimes.length !== slotToTimeCount[medicationSlot]?.length || medicationTimes.some((t) => !t)) {
            //     toast.error("Vui lòng nhập đầy đủ thời gian uống thuốc cho các khe đã chọn!")
            //     return
            // }
            // if (!reExaminationDate) {
            //     toast.error("Vui lòng nhập ngày tái khám!")
            //     return
            // }
            // if (!drugs.length || drugs.some((d) => !d)) {
            //     toast.error("Vui lòng nhập đầy đủ thông tin thuốc!")
            //     return
            // }
            // if (dosages.length !== drugs.length || dosages.some((d) => !d)) {
            //     toast.error("Vui lòng nhập đầy đủ liều dùng!")
            //     return
            // }
            // if (frequencies.length !== drugs.length || frequencies.some((f) => !f)) {
            //     toast.error("Vui lòng nhập đầy đủ tần suất!")
            //     return
            // }

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
            // Nếu là xét nghiệm và đã có kết quả, chỉ update field notes
            if (isLabTest && labResult?._id) {
                // Chỉ cập nhật field notes (ghi chú mới)
                const updateData = {
                    notes: notes || undefined,
                };

                // Sử dụng as any để tránh các vấn đề về kiểu dữ liệu
                await updateResult(labResult._id, updateData as any);
                toast.success("Đã cập nhật ghi chú xét nghiệm!");
            } else {
                // Tạo kết quả mới cho trường hợp không phải lab test hoặc chưa có kết quả
                await addResult({
                    resultName: diagnosis || (isArvTest ? "Kết quả xét nghiệm ARV" : "Kết quả khám"),
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
                    p24Antigen: p24Antigen ? Number(p24Antigen.replace(",", ".")) : undefined,
                    hivAntibody: hivAntibody ? Number(hivAntibody.replace(",", ".")) : undefined,
                    interpretationNote: interpretationNote || notes || undefined,
                    notes: isLabTest ? notes : undefined,
                    consultationNote: isLabTest ? consultationNote : undefined,
                });

                setMedicalRecordSent((prev) => ({
                    ...prev,
                    [bookingId]: true,
                }));
                
                // Chỉ cập nhật trạng thái booking nếu không phải là lab test
                if (!isLabTest) {
                    await handleStatusChange(bookingId, selectedStatusForSubmit!);
                }
                toast.success("Đã tạo hồ sơ bệnh án!");
            }
            
            handleCloseMedicalModal();
        } catch (err: any) {
            console.error("Form submission error:", err);
            toast.error(err.message || "Lưu hồ sơ thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    }

    const isLabTest = typeof selectedBooking?.serviceId === "object" && selectedBooking.serviceId?.isLabTest
    const isArvTest = typeof selectedBooking?.serviceId === "object" && selectedBooking.serviceId?.isArvTest


    const [userResults, setUserResults] = useState<Result[]>([]);
    const [labResult, setLabResult] = useState<Result | null>(null)
    const [notes, setNotes] = useState("")
    const [consultationNote, setConsultationNote] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedHistoryResult, setSelectedHistoryResult] = useState<Result | null>(null)
    
    console.log("Debug flags:", { isLabTest, isArvTest, hasLabResult: !!labResult });

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
                console.log("Fetched result by booking ID:", res)
                const result = Array.isArray(res) ? res[0] || null : res
                console.log("Single result object:", result)
                console.log("TesterName field:", result?.testerName)
                console.log("All result fields:", Object.keys(result || {}))
                setLabResult(result)
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
            console.log("Loading lab result data:", labResult)
            console.log("TesterName from labResult:", labResult.testerName)
            
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
            // Use interpretationNote instead of notes which is missing in the response
            setNotes(labResult.interpretationNote || "");
            setConsultationNote(labResult.interpretationNote || "");
            console.log("Loaded notes from database:", labResult.interpretationNote);
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
                        {userResults.length > 0 && (
                            <div className="p-4 border rounded-md bg-gray-50 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Tất cả kết quả xét nghiệm / điều trị trước đó
                                </h3>
                                <ul className="space-y-3 max-h-[300px] overflow-auto">
                                    {userResults.map((result, idx) => (
                                        <li 
                                            key={result._id} 
                                            className="p-3 border rounded shadow-sm bg-white hover:bg-blue-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedHistoryResult(result)}
                                        >
                                            <p><strong>#{idx + 1}:</strong> {result.resultName}</p>
                                            {result.resultDescription && <p><strong>Mô tả:</strong> {result.resultDescription}</p>}
                                            {result.reExaminationDate && (
                                                <p><strong>Ngày tái khám:</strong> {new Date(result.reExaminationDate).toLocaleDateString("vi-VN")}</p>
                                            )}
                                            <p className="text-xs text-gray-500 italic">Booking: {result.bookingId?.serviceId?.serviceName}</p>
                                            <p className="text-xs text-blue-600 mt-1">Nhấn để xem chi tiết</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {selectedHistoryResult && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
                                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Chi tiết kết quả</h3>
                                    
                                    <div className="space-y-4 text-sm">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">Thông tin chung</h4>
                                                <p><strong>Tên:</strong> {selectedHistoryResult.resultName}</p>
                                                <p><strong>Mô tả:</strong> {selectedHistoryResult.resultDescription || "Không có"}</p>
                                                {selectedHistoryResult.testerName && <p><strong>Người xét nghiệm:</strong> {selectedHistoryResult.testerName}</p>}
                                                <p><strong>Ngày tạo:</strong> {new Date(selectedHistoryResult.createdAt).toLocaleString("vi-VN")}</p>
                                                <p><strong>Cập nhật:</strong> {new Date(selectedHistoryResult.updatedAt).toLocaleString("vi-VN")}</p>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">Booking và dịch vụ</h4>
                                                <p><strong>Mã booking:</strong> {typeof selectedHistoryResult.bookingId === "object" ? selectedHistoryResult.bookingId?.bookingCode : "N/A"}</p>
                                                <p><strong>Dịch vụ:</strong> {typeof selectedHistoryResult.bookingId === "object" && typeof selectedHistoryResult.bookingId?.serviceId === "object" 
                                                    ? selectedHistoryResult.bookingId?.serviceId?.serviceName 
                                                    : "N/A"}</p>
                                                {selectedHistoryResult.reExaminationDate && (
                                                    <p><strong>Ngày tái khám:</strong> {new Date(selectedHistoryResult.reExaminationDate).toLocaleDateString("vi-VN")}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Thông tin chỉ số sức khỏe */}
                                        {(selectedHistoryResult.weight || selectedHistoryResult.height || selectedHistoryResult.bmi || 
                                          selectedHistoryResult.bloodPressure || selectedHistoryResult.pulse || selectedHistoryResult.temperature) && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-700 mb-2">Chỉ số sức khỏe</h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {selectedHistoryResult.weight && <p><strong>Cân nặng:</strong> {selectedHistoryResult.weight} kg</p>}
                                                    {selectedHistoryResult.height && <p><strong>Chiều cao:</strong> {selectedHistoryResult.height} m</p>}
                                                    {selectedHistoryResult.bmi && <p><strong>BMI:</strong> {selectedHistoryResult.bmi}</p>}
                                                    {selectedHistoryResult.bloodPressure && <p><strong>Huyết áp:</strong> {selectedHistoryResult.bloodPressure}</p>}
                                                    {selectedHistoryResult.pulse && <p><strong>Mạch:</strong> {selectedHistoryResult.pulse} bpm</p>}
                                                    {selectedHistoryResult.temperature && <p><strong>Nhiệt độ:</strong> {selectedHistoryResult.temperature}°C</p>}
                                                </div>
                                                {selectedHistoryResult.symptoms && (
                                                    <p className="mt-2"><strong>Triệu chứng:</strong> {selectedHistoryResult.symptoms}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Thông tin xét nghiệm */}
                                        {(selectedHistoryResult.sampleType || selectedHistoryResult.testMethod || selectedHistoryResult.testResult) && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-700 mb-2">Thông tin xét nghiệm</h4>
                                                {selectedHistoryResult.sampleType && <p><strong>Loại mẫu:</strong> {selectedHistoryResult.sampleType}</p>}
                                                {selectedHistoryResult.testMethod && <p><strong>Phương pháp:</strong> {selectedHistoryResult.testMethod}</p>}
                                                {selectedHistoryResult.testResult && <p><strong>Kết quả:</strong> {selectedHistoryResult.testResult}</p>}
                                                {selectedHistoryResult.unit && <p><strong>Đơn vị:</strong> {selectedHistoryResult.unit}</p>}
                                            </div>
                                        )}
                                        
                                        {/* Xét nghiệm HIV */}
                                        {(selectedHistoryResult.viralLoad !== undefined || selectedHistoryResult.cd4Count !== undefined || 
                                          (selectedHistoryResult.coInfections && selectedHistoryResult.coInfections.length > 0) || 
                                          selectedHistoryResult.p24Antigen || selectedHistoryResult.hivAntibody) && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-700 mb-2">Xét nghiệm HIV</h4>
                                                {selectedHistoryResult.viralLoad !== undefined && (
                                                    <div>
                                                        <p><strong>Tải lượng virus:</strong> {selectedHistoryResult.viralLoad} {selectedHistoryResult.unit || "copies/mL"}</p>
                                                        {selectedHistoryResult.viralLoadReference && <p><strong>Tham chiếu VL:</strong> {selectedHistoryResult.viralLoadReference}</p>}
                                                        {selectedHistoryResult.viralLoadInterpretation && (
                                                            <p><strong>Diễn giải:</strong> {
                                                                selectedHistoryResult.viralLoadInterpretation === "undetectable" ? "Không phát hiện" :
                                                                selectedHistoryResult.viralLoadInterpretation === "low" ? "Thấp" : "Cao"
                                                            }</p>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {selectedHistoryResult.cd4Count !== undefined && (
                                                    <div className="mt-2">
                                                        <p><strong>CD4:</strong> {selectedHistoryResult.cd4Count} cells/mm³</p>
                                                        {selectedHistoryResult.cd4Reference && <p><strong>Tham chiếu CD4:</strong> {selectedHistoryResult.cd4Reference}</p>}
                                                        {selectedHistoryResult.cd4Interpretation && (
                                                            <p><strong>Diễn giải:</strong> {
                                                                selectedHistoryResult.cd4Interpretation === "normal" ? "Bình thường" :
                                                                selectedHistoryResult.cd4Interpretation === "low" ? "Thấp" : "Rất thấp"
                                                            }</p>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {selectedHistoryResult.p24Antigen !== undefined && <p><strong>P24 Antigen:</strong> {selectedHistoryResult.p24Antigen}</p>}
                                                {selectedHistoryResult.hivAntibody !== undefined && <p><strong>HIV Antibody:</strong> {selectedHistoryResult.hivAntibody}</p>}
                                                
                                                {selectedHistoryResult.coInfections && selectedHistoryResult.coInfections.length > 0 && (
                                                    <p><strong>Nhiễm kèm:</strong> {selectedHistoryResult.coInfections.join(", ")}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Thông tin phác đồ ARV */}
                                        {(typeof selectedHistoryResult.arvregimenId === "object" && selectedHistoryResult.arvregimenId) && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-700 mb-2">Phác đồ ARV</h4>
                                                <p><strong>Tên phác đồ:</strong> {selectedHistoryResult.arvregimenId.arvName}</p>
                                                {selectedHistoryResult.arvregimenId.regimenCode && <p><strong>Mã phác đồ:</strong> {selectedHistoryResult.arvregimenId.regimenCode}</p>}
                                                {selectedHistoryResult.arvregimenId.treatmentLine && <p><strong>Đường điều trị:</strong> {selectedHistoryResult.arvregimenId.treatmentLine}</p>}
                                                {selectedHistoryResult.medicationTime && <p><strong>Thời gian uống thuốc:</strong> {selectedHistoryResult.medicationTime}</p>}
                                                {selectedHistoryResult.medicationSlot && <p><strong>Khe thời gian:</strong> {selectedHistoryResult.medicationSlot}</p>}
                                                
                                                {selectedHistoryResult.arvregimenId.drugs && selectedHistoryResult.arvregimenId.drugs.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="font-medium">Thuốc:</p>
                                                        <ul className="list-disc pl-5">
                                                            {selectedHistoryResult.arvregimenId.drugs.map((drug, idx) => (
                                                                <li key={idx}>{drug}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                
                                                {selectedHistoryResult.arvregimenId.sideEffects && selectedHistoryResult.arvregimenId.sideEffects.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="font-medium">Tác dụng phụ:</p>
                                                        <ul className="list-disc pl-5">
                                                            {selectedHistoryResult.arvregimenId.sideEffects.map((effect, idx) => (
                                                                <li key={idx}>{effect}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Ghi chú */}
                                        {(selectedHistoryResult.notes || selectedHistoryResult.interpretationNote) && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-700 mb-2">Ghi chú</h4>
                                                {selectedHistoryResult.notes && <p><strong>Ghi chú:</strong> {selectedHistoryResult.notes}</p>}
                                                {selectedHistoryResult.interpretationNote && <p><strong>Diễn giải:</strong> {selectedHistoryResult.interpretationNote}</p>}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                            onClick={() => setSelectedHistoryResult(null)}
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {isLabTest && labResult && (
                            <div className="p-4 border rounded-lg bg-gray-50 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Kết quả xét nghiệm</h3>
                                <p><strong>Tên kết quả:</strong> {labResult.resultName}</p>
                                <p><strong>Mô tả:</strong> {labResult.resultDescription}</p>
                                
                                {labResult?.notes && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p><strong>Ghi chú diễn giải:</strong> {labResult.notes}</p>
                                    </div>
                                )}
                                { labResult?.testerName && (
                                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p><strong>Người thực hiện:</strong> {labResult.testerName}</p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú mới</label>
                                    <textarea
                                        className="w-full border rounded-xl p-2 text-sm"
                                        rows={3}
                                        placeholder="Nhập ghi chú của bác sĩ..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                            </div>
                        )}
                        
                        {!isArvTest && (
                            <>
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
                                    isArvTest={isArvTest}
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
                                    viralLoad={typeof viralLoad === "number" ? String(viralLoad) : viralLoad}
                                    setViralLoad={(v) => setViralLoad(v === "" ? 0 : Number(v))}
                                    viralLoadReference={viralLoadReference}
                                    setViralLoadReference={setViralLoadReference}
                                    viralLoadInterpretation={viralLoadInterpretation}
                                    setViralLoadInterpretation={(v) => setViralLoadInterpretation(v === "" ? "undetectable" : v as "undetectable" | "low" | "high")}
                                    cd4Count={typeof cd4Count === "number" ? String(cd4Count) : cd4Count}
                                    setCd4Count={(v) => setCd4Count(v === "" ? 0 : Number(v))}
                                    cd4Reference={cd4Reference}
                                    setCd4Reference={setCd4Reference}
                                    cd4Interpretation={cd4Interpretation}
                                    setCd4Interpretation={(v) => setCd4Interpretation(v === "" ? "normal" : v as "normal" | "low" | "very_low")}
                                    coInfections={coInfections}
                                    setCoInfections={setCoInfections}
                                    interpretationNote={interpretationNote}
                                    setInterpretationNote={setInterpretationNote}
                                    p24Antigen={p24Antigen}
                                    setP24Antigen={setP24Antigen}
                                    hivAntibody={hivAntibody}
                                    setHivAntibody={setHivAntibody}
                                />
                            </>
                        )}
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
                        {!isLabTest && (
                            <StatusSelectionForm
                                selectedStatusForSubmit={selectedStatusForSubmit}
                                setSelectedStatusForSubmit={setSelectedStatusForSubmit}
                                selectedBooking={selectedBooking}
                            />
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 text-gray-700 font-semibold transition-all"
                            onClick={handleCloseMedicalModal}
                            disabled={isSubmitting}
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-3 rounded-xl text-white font-semibold transition-all ${
                                isSubmitting 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu hồ sơ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MedicalRecordModal
