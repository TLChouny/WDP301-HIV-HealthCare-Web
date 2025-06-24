// notification.ts

import { Booking } from "./booking";

export interface Notification {
  _id?: string;
  notiName: string;
  notiDescription?: string;
  bookingId: Booking;
  createdAt: Date;
  updatedAt: Date;
}