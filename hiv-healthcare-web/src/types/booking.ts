// types/booking.ts
import type { Service } from './service';

export interface Booking {
  _id?: string;
  bookingCode?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string; // ISO date string: "2025-06-19"
  startTime: string;
  endTime?: string;
  duration?: number;
  doctorName: string;
  notes?: string;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  isAnonymous: boolean;
  userId: string | null;
  serviceId: Service; // BE muốn full object
  createdAt?: string;
  updatedAt?: string;
}
