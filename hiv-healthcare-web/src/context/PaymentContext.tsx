import React, { createContext, useContext, useEffect, useState } from "react";
import type { Payment, PaymentStatus } from "../types/payment";
import {
  createPaymentLink,
  getAllPayments,
  getPaymentByOrderCode,
  updatePaymentStatus,
} from "../api/paymentApi";

interface PaymentContextType {
  payments: Payment[];
  refreshPayments: () => void;
  createPayment: (data: Omit<Payment, "_id" | "createdAt" | "updatedAt">) => Promise<Payment>;
  getPaymentByOrderCode: (orderCode: string | number) => Promise<Payment>;
  updatePaymentStatus: (orderCode: string | number, status: PaymentStatus) => Promise<Payment>;
}

const PaymentContext = createContext<PaymentContextType>({
  payments: [],
  refreshPayments: () => {},
  createPayment: async () => {
    throw new Error("createPayment not implemented");
  },
  getPaymentByOrderCode: async () => {
    throw new Error("getPaymentByOrderCode not implemented");
  },
  updatePaymentStatus: async () => {
    throw new Error("updatePaymentStatus not implemented");
  },
});

export const usePaymentContext = () => useContext(PaymentContext);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const refreshPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  const handleCreatePayment = async (
    data: Omit<Payment, "_id" | "createdAt" | "updatedAt">
  ): Promise<Payment> => {
    const newPayment = await createPaymentLink(data);
    await refreshPayments(); // Optional: tự cập nhật danh sách
    return newPayment;
  };

  const handleGetByOrderCode = async (orderCode: string | number): Promise<Payment> => {
    return await getPaymentByOrderCode(orderCode);
  };

  const handleUpdateStatus = async (
    orderCode: string | number,
    status: PaymentStatus
  ): Promise<Payment> => {
    const updated = await updatePaymentStatus(orderCode, status);
    await refreshPayments(); // Optional: tự cập nhật danh sách
    return updated;
  };

  useEffect(() => {
    refreshPayments();
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        refreshPayments,
        createPayment: handleCreatePayment,
        getPaymentByOrderCode: handleGetByOrderCode,
        updatePaymentStatus: handleUpdateStatus,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
