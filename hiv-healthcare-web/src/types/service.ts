// types/service.ts

export interface Service {
  _id: string;
  serviceName: string;
  serviceDescription?: string;
  categoryId: string | { _id: string; categoryName?: string }; // Tuỳ response
  serviceImage?: string;
  timeSlot?: string;
  duration?: number;
  price?: string;
  doctorName?: string;
}
