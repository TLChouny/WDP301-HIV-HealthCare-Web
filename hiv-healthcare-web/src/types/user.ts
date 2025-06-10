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
  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  tokenExpiresAt?: string;
}
