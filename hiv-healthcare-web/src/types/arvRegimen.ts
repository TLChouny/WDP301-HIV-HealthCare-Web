import { User } from "./user";

export interface ARVRegimen {
  _id?: string;
  arvName: string;
  arvDescription?: string;
  regimenCode?: string; // Mã phác đồ theo guideline MOH/WHO
  treatmentLine?: 'First-line' | 'Second-line' | 'Third-line'; // Tuyến điều trị
  recommendedFor?: string; // Đối tượng khuyến cáo
  drugs: string[]; // Danh sách thuốc
  dosages: string[]; // Liều dùng
  frequency?: string; // Tần suất uống thuốc
  contraindications: string[]; // Chống chỉ định
  sideEffects: string[]; // Tác dụng phụ
  userId?: User; // Populate nếu cần

  createdAt?: string; // ISO date string
  updatedAt?: string;
}
