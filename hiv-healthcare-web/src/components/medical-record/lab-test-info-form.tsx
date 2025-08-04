import type React from "react"

interface LabTestInfoFormProps {
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
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Xét nghiệm</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}

export default LabTestInfoForm