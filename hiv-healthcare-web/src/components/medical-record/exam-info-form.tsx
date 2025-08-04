import type React from "react"

interface ExamInfoFormProps {
  bloodPressure: string
  setBloodPressure: (bp: string) => void
  pulse: string
  setPulse: (pulse: string) => void
  temperature: string
  setTemperature: (temp: string) => void
  symptoms: string
  setSymptoms: (s: string) => void
  diagnosis: string
  setDiagnosis: (d: string) => void
}

const ExamInfoForm: React.FC<ExamInfoFormProps> = ({
  bloodPressure,
  setBloodPressure,
  pulse,
  setPulse,
  temperature,
  setTemperature,
  symptoms,
  setSymptoms,
  diagnosis,
  setDiagnosis,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin khám</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Huyết áp</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="120/80"
            value={bloodPressure || ""}
            onChange={(e) => setBloodPressure(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mạch (lần/phút)</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhiệt độ (°C)</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            min="0"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default ExamInfoForm
