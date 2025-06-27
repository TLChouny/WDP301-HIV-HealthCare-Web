import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Payment } from "../types/payment";

/**
 * Tạo link thanh toán mới (ZaloPay/QR)
 */
export const createPaymentLink = async (
  paymentData: Omit<Payment, "_id" | "createdAt" | "updatedAt">
): Promise<Payment> => {
  const res = await axios.post(`${BASE_URL}${API_ENDPOINTS.CREATE_PAYMENT_LINK}`, paymentData);

  if (res.data.error === 0) {
    return {
      ...paymentData,
      checkoutUrl: res.data.data.checkoutUrl,
      qrCode: res.data.data.qrCode,
      orderCode: res.data.data.orderCode,
      status: "pending",
    };
  } else {
    throw new Error(res.data.message || "Tạo thanh toán thất bại");
  }
};

/**
 * Lấy thông tin đơn hàng theo mã đơn hàng (orderCode)
 */
export const getPaymentByOrderCode = async (orderCode: string | number): Promise<Payment> => {
  const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_PAYMENT_BY_ORDER_CODE(orderCode)}`);
  return res.data;
};

/**
 * Cập nhật trạng thái đơn hàng (status)
 */
export const updatePaymentStatus = async (
  orderCode: string | number,
  status: Payment["status"]
): Promise<Payment> => {
  const res = await axios.put(`${BASE_URL}${API_ENDPOINTS.UPDATE_PAYMENT_STATUS(orderCode)}`, { status });
  return res.data;
};

/**
 * Lấy toàn bộ danh sách đơn hàng thanh toán
 */
export const getAllPayments = async (): Promise<Payment[]> => {
  const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_ALL_PAYMENTS}`);
  return res.data;
};
