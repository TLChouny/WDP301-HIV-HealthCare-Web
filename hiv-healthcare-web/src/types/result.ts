import { Booking } from "./booking";
import { ARVRegimen } from "./arvRegimen";

export interface Result {
  _id: string;
  resultName: string;
  resultDescription?: string;

  // 🩺 Thông tin khám
  symptoms?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;

  // 🧪 Nếu là lab test
  sampleType?: string;
  testMethod?: string;
  resultType?: 'positive-negative' | 'quantitative' | 'other';
  testResult?: string;
  testValue?: number;
  unit?: string;
  referenceRange?: string;

  // 💊 Nếu là khám ARV
  reExaminationDate?: Date;
  medicationTime?: string;
  medicationSlot?: string;
  arvregimenId?: ARVRegimen;

  // 🔗 Liên kết Booking
  bookingId: Booking;

  createdAt: Date;
  updatedAt: Date;
}
