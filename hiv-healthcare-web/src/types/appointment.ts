export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  isAnonymous: boolean;
}