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

// 🧬 Interface mô tả kết quả xét nghiệm hoặc điều trị ARV
export interface Result {
  _id: string;

  // 📝 Thông tin chung
  resultName: string; // Tên kết quả (VD: "Xét nghiệm PCR lần 1", "Đánh giá ARV tháng 1")
  resultDescription?: string; // Mô tả thêm về kết quả, thường dùng với phác đồ ARV
  testerName?: string; // Tên người thực hiện xét nghiệm (không liên kết User, là chuỗi tự do)
  notes?: string; // Ghi chú thêm của bác sĩ hoặc kỹ thuật viên

  // 📅 Thông tin thời gian tạo/cập nhật
  createdAt: Date;
  updatedAt: Date;

  // 💊 Thông tin điều trị ARV (nếu có)
  arvregimenId?: ARVRegimen; // Liên kết tới phác đồ điều trị ARV
  reExaminationDate?: Date; // Ngày tái khám dự kiến
  medicationTime?: string; // Giờ uống thuốc dạng chuỗi, ví dụ "08:00; 20:00"
  medicationSlot?: string; // Buổi uống thuốc, ví dụ "Sáng và Tối"
  serviceId?: import("./service").Service; // Thông tin dịch vụ xét nghiệm

  // 🔗 Booking liên kết
  bookingId: Booking;

  // 🩺 Thông tin khám ban đầu hoặc khi lấy mẫu xét nghiệm
  symptoms?: string; // Triệu chứng ghi nhận (VD: ho, sốt, mệt)
  weight?: number; // Cân nặng (kg)
  height?: number; // Chiều cao (m)
  bmi?: number; // BMI tính toán từ chiều cao và cân nặng
  bloodPressure?: string; // Huyết áp (VD: "120/80")
  pulse?: number; // Mạch đập (lần/phút)
  temperature?: number; // Nhiệt độ cơ thể (°C)
  sampleType?: string; // Loại mẫu (VD: Máu, Nước tiểu, Dịch hầu họng)
  testMethod?: string; // Phương pháp test (VD: PCR, Test nhanh, ELISA)

  // 🔬 Xét nghiệm PCR HIV
  viralLoad?: number; // Tải lượng virus (copies/mL)
  viralLoadReference?: string; // Khoảng tham chiếu VL (VD: "<20 copies/mL")
  viralLoadInterpretation?: "undetectable" | "low" | "high"; // Diễn giải kết quả VL
  unit?: string; // Đơn vị đo dùng cho VL hoặc CD4 (VD: "copies/mL", "cells/mm³")

  // 📉 Xét nghiệm CD4
  cd4Count?: number; // Số lượng tế bào CD4
  cd4Reference?: string; // Khoảng tham chiếu CD4 (VD: ">500")
  cd4Interpretation?: "normal" | "low" | "very_low"; // Diễn giải kết quả CD4
  coInfections?: string[]; // Danh sách các bệnh nhiễm kèm (VD: Lao, Viêm gan B,...)

  // ✅ Xét nghiệm nhanh HIV / Ag-Ab
  testResult?: "positive" | "negative" | "invalid"; // Kết quả test nhanh
  interpretationNote?: string; // Ghi chú diễn giải (VD: test lại sau 1 tuần nếu nghi ngờ)
  p24Antigen?: number; // Kháng nguyên P24 (dương tính nếu có)
  hivAntibody?: number; // Kháng thể HIV (dương tính nếu có)
}
