import { Category } from "./category";

export interface Service {
  _id: string;
  serviceName: string;
  serviceDescription?: string;
  categoryId: Category; // populate tuỳ API
  serviceImage?: string;

  duration: number; // default 30 nếu không truyền
  price: number; // kiểu number theo schema

  isLabTest?: boolean;
  isArvTest?: boolean;

  // ⚠️ Những field dưới đây không có trong schema nhưng mày đang xài FE
  timeSlot?: string;
  doctorName?: string;

  createdAt: string; // ISO date string
  updatedAt: string;
}
