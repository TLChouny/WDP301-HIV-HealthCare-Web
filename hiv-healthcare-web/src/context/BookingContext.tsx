import React, { createContext, useContext } from 'react';
import {
  getAllBookings,
  getBookingsByUserId,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDoctorName,
  checkExistingBookings as checkBookingsApi, // Đổi tên import để tránh xung đột
} from '../api/bookingApi';
import type { Booking } from '../types/booking';

interface BookingContextProps {
  getAll: () => Promise<Booking[]>;
  getByUserId: (userId: string) => Promise<Booking[]>;
  getById: (id: string) => Promise<Booking>;
  getByDoctorName: (doctorName: string) => Promise<Booking[]>;
  checkExistingBookings: (doctorName: string, bookingDate: string) => Promise<string[]>;
  create: (data: Partial<Booking>) => Promise<Booking>;
  update: (id: string, data: Partial<Booking>) => Promise<Booking>;
  remove: (id: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getAll = async (): Promise<Booking[]> => await getAllBookings();
  const getByUserId = async (userId: string): Promise<Booking[]> => await getBookingsByUserId(userId);
  const getById = async (id: string): Promise<Booking> => await getBookingById(id);
  const getByDoctorName = async (doctorName: string): Promise<Booking[]> => await getBookingsByDoctorName(doctorName);
  const checkExistingBookings = async (doctorName: string, bookingDate: string): Promise<string[]> => 
    await checkBookingsApi(doctorName, bookingDate); // Gọi hàm từ bookingApi.ts
  const create = async (data: Partial<Booking>): Promise<Booking> => await createBooking(data);
  const update = async (id: string, data: Partial<Booking>): Promise<Booking> => await updateBooking(id, data);
  const remove = async (id: string): Promise<void> => await deleteBooking(id);

  return (
    <BookingContext.Provider 
      value={{ getAll, getByUserId, getById, getByDoctorName, checkExistingBookings, create, update, remove }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextProps => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};