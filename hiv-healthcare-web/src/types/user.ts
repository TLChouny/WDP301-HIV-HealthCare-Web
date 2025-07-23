// types/User.ts

export type Gender = "male" | "female" | "other";
export type Role = "user" | "admin" | "doctor" | "staff";

export interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  description: string;
  fileUrl: string;
  status?: "pending" | "approved" | "rejected";
}

export interface Experience {
  _id?: string;
  hospital: string;
  position: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional
  description?: string;
  status?: "pending" | "approved" | "rejected";

}

export interface User {
  _id: string;
  userName: string;
  email?: string;
  phone_number?: string;
  gender?: Gender;
  address?: string;
  dateOfBirth?: string;
  role: Role;
  avatar?: string;
  userDescription?: string;
  categoryId?: string;
  isVerified: boolean;

  // 🔥 Field mới cho lịch làm
  dayOfWeek?: string[]; // VD: ["Monday", "Wednesday"]
  startTimeInDay?: string; // VD: "08:00"
  endTimeInDay?: string; // VD: "16:00"
  startDay?: string; // VD: "2025-07-01"
  endDay?: string; // VD: "2025-07-31"

  // 🔥 Field mới cho doctor
  certifications?: Certification[];
  experiences?: Experience[];

  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  tokenExpiresAt?: string;
}
