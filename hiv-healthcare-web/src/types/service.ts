export interface Service {
  _id: string;
  serviceName: string;
  serviceDescription?: string;
  categoryId: string;
  serviceImage?: string;
  timeSlot?: string;
  duration?: number;
  price?: string;
  doctorName?: string;
}
