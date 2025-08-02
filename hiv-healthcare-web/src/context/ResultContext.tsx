import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getAllResults,
  getResultById,
  createResult,
  editResult,
  getResultsByUserId,
  getResultsByDoctorName,
} from "../api/resultApi";
import type { Result } from "../types/result";

// Định nghĩa kiểu dữ liệu cho payload tạo mới kết quả
export interface NewResultPayload {
  resultName: string;
  resultDescription?: string;
  bookingId: string;
  arvregimenId?: string; // Thay đổi từ arvregimenId: string thành arvregimenId?: string
  reExaminationDate: string;
  medicationTime?: string;
  medicationSlot?: string;
  symptoms?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  sampleType?: string;
  testMethod?: string;
  resultType?: 'positive-negative' | 'quantitative' | 'other';
  testResult?: string;
  testValue?: number;
  unit?: string;
  referenceRange?: string;
  testerName?: string; // tên người thực hiện test
}

interface ResultContextProps {
  results: Result[];
  loading: boolean;
  fetchResults: () => Promise<void>;
  getResult: (id: string) => Promise<Result | null>;
  addResult: (data: NewResultPayload) => Promise<Result | null>;
  updateResult: (id: string, data: Result) => Promise<Result | null>;
  getByUserId: (userId: string) => Promise<Result[]>;
  getByDoctorName: (doctorName: string) => Promise<Result[]>;
}

const ResultContext = createContext<ResultContextProps | undefined>(undefined);

export const ResultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await getAllResults();
      setResults(data);
    } catch (err: any) {
      console.error("Failed to fetch results:", err);
    } finally {
      setLoading(false);
    }
  };

  const getResult = async (id: string): Promise<Result | null> => {
    try {
      return await getResultById(id);
    } catch (err: any) {
      console.error(`Failed to get result with id ${id}:`, err);
      return null;
    }
  };

  const addResult = async (data: NewResultPayload): Promise<Result | null> => {
    try {
      const newResult = await createResult(data);
      setResults((prev) => [...prev, newResult]);
      return newResult;
    } catch (err: any) {
      console.error("Failed to create result:", err);
      return null;
    }
  };

  const updateResult = async (
    id: string,
    data: Result
  ): Promise<Result | null> => {
    try {
      const updated = await editResult(id, data);
      setResults((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
      return updated;
    } catch (err: any) {
      console.error("Failed to update result:", err);
      return null;
    }
  };

  const getByUserId = useCallback(async (userId: string): Promise<Result[]> => {
    setLoading(true);
    try {
      const userResults = await getResultsByUserId(userId);
      setResults(userResults);
      return userResults;
    } catch (err: any) {
      console.error(`Failed to get results for user with id ${userId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getByDoctorName = useCallback(
    async (doctorName: string): Promise<Result[]> => {
      setLoading(true);
      try {
        const doctorResults = await getResultsByDoctorName(doctorName);
        setResults(doctorResults);
        return doctorResults;
      } catch (err: any) {
        console.error(`Failed to get results for doctor ${doctorName}:`, err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <ResultContext.Provider
      value={{
        results,
        loading,
        fetchResults,
        getResult,
        addResult,
        updateResult,
        getByUserId,
        getByDoctorName,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = (): ResultContextProps => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};