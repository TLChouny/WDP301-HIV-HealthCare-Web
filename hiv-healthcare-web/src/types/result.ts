// import { Booking } from "./booking";
// import { ARVRegimen } from "./arvRegimen";

// export interface Result {
//   _id: string;
//   resultName: string;
//   resultDescription?: string;

//   // 🩺 Thông tin khám
//   symptoms?: string;
//   weight?: number;
//   height?: number;
//   bmi?: number;
//   bloodPressure?: string;
//   pulse?: number;
//   temperature?: number;

//   // 🧪 Nếu là lab test
//   sampleType?: string;
//   testMethod?: string;
//   resultType?: 'positive-negative' | 'quantitative' | 'other';
//   testResult?: string;
//   testValue?: number;
//   unit?: string;
//   referenceRange?: string;
//   testerName?: string; // tên người thực hiện test

//   // 💊 Nếu là khám ARV
//   reExaminationDate?: Date;
//   medicationTime?: string;
//   medicationSlot?: string;
//   arvregimenId?: ARVRegimen;

//   // 🔗 Liên kết Booking
//   bookingId: Booking;

//   createdAt: Date;
//   updatedAt: Date;
// }


import { Booking } from "./booking";
import { ARVRegimen } from "./arvRegimen";

export interface Result {

  _id: string;
  resultName: string; // Tên kết quả điều trị dùng chung cho cả xét nghiệm và ARV
  resultDescription?: string; // Mô tả kết quả điều trị ARV
  testerName?: string; // Tên người thực hiện test
  notes?: string; // Ghi chú thêm về kết quả điều trị ARV
  createdAt: Date;
  updatedAt: Date;

  // 🔗 Liên kết ARV
  arvregimenId?: ARVRegimen;
  reExaminationDate?: Date;
  medicationTime?: string;
  medicationSlot?: string;

  // 🔗 Liên kết Booking
  bookingId: Booking;

  // 🩺 Thông tin khám xét nghiệm
  symptoms?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  sampleType?: string; // Loại mẫu (máu, nước tiểu, ...)
  testMethod?: string; // Phương pháp xét nghiệm

  // PCR
  viralLoad?: number;
  viralLoadReference?: string;
  viralLoadInterpretation?: "undetectable" | "low" | "high";
  unit: string; // Đơn vị đo (VD: "copies/mL") dùng cho cả PCR và CD4

  // CD4
  cd4Count?: number;
  cd4Reference?: string;
  cd4Interpretation?: "normal" | "low" | "very_low";
  coInfections?: string[];

  // Test nhanh / Ag-Ab
  testResult?: "positive" | "negative" | "invalid";
  interpretationNote?: string;
  p24Antigen?: number; // Giá trị P24 nếu có, có là dương tính, không cái nào là âm tính, chỉ cần có 1 trong 2 trường này là dương tính
  hivAntibody?: number; // Giá trị HIV Antibody nếu có

}
