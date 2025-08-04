import type React from "react";
import { useEffect } from "react";
import { Result } from "../../types/result";

interface GeneralInfoFormProps {
  medicalDate: string;
  setMedicalDate: (date: string) => void;
  medicalType: string;
  setMedicalType: (type: string) => void;
  weight?: number;
  setWeight?: (weight: number) => void;
  height?: number;
  setHeight?: (height: number) => void;
  bmi?: number;
  labResult?: Result | null;
  isArvTest?: boolean;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({
  medicalDate,
  setMedicalDate,
  medicalType,
  setMedicalType,
  weight,
  setWeight,
  height,
  setHeight,
  bmi,
  labResult,
  isArvTest = false,
}) => {
  // Auto-fill từ labResult nếu có
  useEffect(() => {
    if (!labResult) return;

    if (labResult.reExaminationDate && !medicalDate)
      setMedicalDate?.(new Date(labResult.reExaminationDate).toISOString().split("T")[0]);

    if (labResult.weight !== undefined && setWeight && !weight)
      setWeight(labResult.weight);

    if (labResult.height !== undefined && setHeight && !height)
      setHeight(labResult.height);

    // BMI có thể tính tự động nếu có cân nặng và chiều cao
  }, [labResult]);

  // Tính BMI nếu có cân nặng và chiều cao
  const calculatedBMI =
    weight && height && height > 0 ? Number((weight / (height * height)).toFixed(2)) : "";

  // Nếu là isArvTest thì không hiển thị gì
  if (isArvTest) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin chung</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ngày khám */}
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
          />
        </div>

        {/* Loại khám */}
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
          />
        </div>

        {/* Cân nặng */}
        {setWeight && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
        )}

        {/* Chiều cao */}
        {setHeight && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (m)</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
              value={height || ""}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        )}

        {/* BMI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100"
            value={bmi !== undefined ? bmi : calculatedBMI}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoForm;
