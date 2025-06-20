import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { Booking } from '../types/booking';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await apiClient.get(API_ENDPOINTS.BOOKINGS);
  return res.data;
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  const res = await apiClient.get(`${API_ENDPOINTS.BOOKINGS}/user/${userId}`);
  return res.data;
};

export const createBooking = async (booking: Partial<Booking>): Promise<Booking> => {
  const res = await apiClient.post(API_ENDPOINTS.BOOKINGS, booking);
  return res.data;
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const res = await apiClient.get(API_ENDPOINTS.BOOKING_BY_ID(id));
  return res.data;
};

export const updateBooking = async (
  id: string,
  data: Partial<Booking>
): Promise<Booking> => {
  const res = await apiClient.put(API_ENDPOINTS.BOOKING_BY_ID(id), data);
  return res.data;
};

export const deleteBooking = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  await apiClient.delete(API_ENDPOINTS.BOOKING_BY_ID(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};