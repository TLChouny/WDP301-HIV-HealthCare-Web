import React, { createContext, useContext } from 'react';
import {
  getAllBookings,
  getBookingsByUserId,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDoctorName,
} from '../api/bookingApi';
import type { Booking } from '../types/booking';

interface BookingContextProps {
  getAll: () => Promise<Booking[]>;
  getByUserId: (userId: string) => Promise<Booking[]>;
  getById: (id: string) => Promise<Booking>;
  getByDoctorName: (doctorName: string) => Promise<Booking[]>; // Thêm dòng này
  create: (data: Partial<Booking>) => Promise<Booking>;
  update: (id: string, data: Partial<Booking>) => Promise<Booking>;
  remove: (id: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getAll = async () => await getAllBookings();
  const getByUserId = async (userId: string) => await getBookingsByUserId(userId);
  const getById = async (id: string) => await getBookingById(id);
  const getByDoctorName = async (doctorName: string) => await getBookingsByDoctorName(doctorName); // Thêm dòng này
  const create = async (data: Partial<Booking>) => await createBooking(data);
  const update = async (id: string, data: Partial<Booking>) => await updateBooking(id, data);
  const remove = async (id: string) => await deleteBooking(id);

  return (
    <BookingContext.Provider value={{ getAll, getByUserId, getById, getByDoctorName, create, update, remove }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextProps => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};