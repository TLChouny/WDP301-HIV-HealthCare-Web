// File types/payment.ts
export type PaymentStatus = "pending" | "success" | "failed" | "cancelled";

export interface Booking {
  _id: string;
  bookingCode: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  customerID: string;
  customerName: string; // Bổ sung
  customerEmail?: string; // Bổ sung
  customerPhone?: string; // Bổ sung
  notes: string;
  status: "pending" | "confirmed" | "canceled";
  isAnonymous: boolean;
}

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
  bookingIds: Booking[]; // Cập nhật kiểu dữ liệu để chứa Booking object đầy đủ
  createdAt?: string;
  updatedAt?: string;
}