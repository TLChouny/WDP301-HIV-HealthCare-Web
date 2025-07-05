import { Booking } from "./booking";
import { ARVRegimen } from "./arvRegimen";
export interface Result {
  _id: string;
  resultName: string;
  resultDescription?: string;
  reExaminationDate: Date;
  bookingId: Booking;
  arvregimenId: ARVRegimen;
  createdAt: Date;
  updatedAt: Date;
}