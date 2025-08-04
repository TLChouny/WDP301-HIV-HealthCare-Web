// File types/payment.ts
import type { Booking } from './booking';

export type PaymentStatus = "pending" | "success" | "failed" | "cancelled";

export interface Payment {
  _id?: string;
  paymentID: string;
  orderCode: number;
  orderName: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  paymentMethod?: string; // Bổ sung
  paymentBank?: string; // Bổ sung
  paymentTime?: string; // Bổ sung
  returnUrl?: string;
  cancelUrl?: string;
  checkoutUrl?: string;
  qrCode?: string;
  bookingIds: string[] | Booking[]; // Hỗ trợ cả unpopulated và populated
  createdAt?: string;
  updatedAt?: string;
}