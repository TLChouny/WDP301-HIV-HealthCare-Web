import type React from "react"
interface LabTestInfoFormProps {
  sampleType: string;
  setSampleType: (type: string) => void;
  testMethod: string;
  setTestMethod: (method: string) => void;
  resultType: "positive-negative" | "quantitative" | "other" | "";
  setResultType: (type: "positive-negative" | "quantitative" | "other" | "") => void;
  testResult: string;
  setTestResult: (result: string) => void;
  testValue: string;
  setTestValue: (value: string) => void;
  unit: string;
  setUnit: (unit: string) => void;
  referenceRange: string;
  setReferenceRange: (range: string) => void;
  viralLoad: string;
  setViralLoad: (value: string) => void;
  viralLoadReference: string;
  setViralLoadReference: (value: string) => void;
  viralLoadInterpretation: "undetectable" | "low" | "high" | "";
  setViralLoadInterpretation: (value: "undetectable" | "low" | "high" | "") => void;
  cd4Count: string;
  setCd4Count: (value: string) => void;
  cd4Reference: string;
  setCd4Reference: (value: string) => void;
  cd4Interpretation: "normal" | "low" | "very_low" | "";
  setCd4Interpretation: (value: "normal" | "low" | "very_low" | "") => void;
  coInfections: string[];
  setCoInfections: (value: string[]) => void;
  interpretationNote: string;
  setInterpretationNote: (value: string) => void;
  p24Antigen: string;
  setP24Antigen: (value: string) => void;
  hivAntibody: string;
  setHivAntibody: (value: string) => void;
}

const LabTestInfoForm: React.FC<LabTestInfoFormProps> = ({
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
  interpretationNote,
  setInterpretationNote,
  p24Antigen,
  setP24Antigen,
  hivAntibody,
  setHivAntibody,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Xét nghiệm</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ...existing code... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại mẫu xét nghiệm</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={sampleType}
            onChange={(e) => setSampleType(e.target.value)}
            placeholder="Máu, Nước tiểu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp xét nghiệm</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={testMethod}
            onChange={(e) => setTestMethod(e.target.value)}
            placeholder="PCR, ELISA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại kết quả xét nghiệm</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={resultType}
            onChange={(e) => setResultType(e.target.value as "positive-negative" | "quantitative" | "other" | "")}
          >
            <option value="">-- Chọn loại kết quả --</option>
            <option value="positive-negative">Dương tính/Âm tính</option>
            <option value="quantitative">Định lượng</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả xét nghiệm</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={testResult}
            onChange={(e) => setTestResult(e.target.value)}
            placeholder="Dương tính, Âm tính"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị xét nghiệm</label>
          <input
            type="number"
            step="0.1"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="copies/mL, %"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={referenceRange}
            onChange={(e) => setReferenceRange(e.target.value)}
            placeholder="< 40 copies/mL"
          />
        </div>
        {/* Các trường cho tải lượng virus HIV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tải lượng virus HIV (copies/mL)</label>
          <input
            type="number"
            step="1"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={viralLoad}
            onChange={(e) => setViralLoad(e.target.value)}
            placeholder="VD: 1200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu VL</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={viralLoadReference}
            onChange={(e) => setViralLoadReference(e.target.value)}
            placeholder="< 20 copies/mL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diễn giải kết quả VL</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={viralLoadInterpretation}
            onChange={(e) => setViralLoadInterpretation(e.target.value as "undetectable" | "low" | "high" | "")}
          >
            <option value="">-- Chọn diễn giải --</option>
            <option value="undetectable">Không phát hiện</option>
            <option value="low">Thấp</option>
            <option value="high">Cao</option>
          </select>
        </div>
        {/* Các trường cho xét nghiệm CD4 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tế bào CD4 (cells/mm³)</label>
          <input
            type="number"
            step="1"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={cd4Count}
            onChange={(e) => setCd4Count(e.target.value)}
            placeholder="VD: 650"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng tham chiếu CD4</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={cd4Reference}
            onChange={(e) => setCd4Reference(e.target.value)}
            placeholder=">500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diễn giải kết quả CD4</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={cd4Interpretation}
            onChange={(e) => setCd4Interpretation(e.target.value as "normal" | "low" | "very_low" | "")}
          >
            <option value="">-- Chọn diễn giải --</option>
            <option value="normal">Bình thường</option>
            <option value="low">Thấp</option>
            <option value="very_low">Rất thấp</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh nhiễm kèm (nếu có)</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={Array.isArray(coInfections) ? coInfections.join(", ") : ""}
            onChange={(e) => setCoInfections(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
            placeholder="Viêm gan B, Lao, ..."
          />
        </div>
        {/* Trường ghi chú diễn giải */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú diễn giải</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={interpretationNote}
            onChange={(e) => setInterpretationNote(e.target.value)}
            placeholder="Có thể test lại sau 1 tuần"
          />
        </div>
        {/* Trường kháng nguyên P24 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị kháng nguyên P24</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={p24Antigen !== undefined && p24Antigen !== null ? String(p24Antigen) : ""}
            onChange={(e) => setP24Antigen(e.target.value)}
            placeholder="VD: 1.2"
          />
        </div>
        {/* Trường kháng thể HIV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị kháng thể HIV</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={hivAntibody !== undefined && hivAntibody !== null ? String(hivAntibody) : ""}
            onChange={(e) => setHivAntibody(e.target.value)}
            placeholder="VD: 1.1"
          />
        </div>
      </div>
    </div>
  )
}

export default LabTestInfoForm