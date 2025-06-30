// types/User.ts

export type Gender = "male" | "female" | "other";
export type Role = "user" | "admin" | "doctor" | "staff";

export interface User {
  _id: string;
  userName: string;
  email?: string;
  phone_number?: string;
  gender?: Gender;
  address?: string;
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

  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  tokenExpiresAt?: string;
}
