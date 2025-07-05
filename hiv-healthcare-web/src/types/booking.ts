// types/booking.ts
import type { Service } from './service';
import { User } from './user';

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
  meetLink?: string;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 're-examination' | 'checked-in' | 'checked-out';
  isAnonymous: boolean;
  userId: User; // BE muốn full object
  serviceId: Service; // BE muốn full object
  createdAt?: string;
  updatedAt?: string;
}
