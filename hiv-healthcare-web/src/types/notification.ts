// notification.ts

import { Result } from "./result";
import { Booking } from "./booking";

export interface Notification {
  _id?: string;
  notiName: string;
  notiDescription?: string;
  bookingId: Booking;
  resultId: Result; // Assuming resultId is a string, adjust if it's an object
  createdAt: Date;
  updatedAt: Date;
}