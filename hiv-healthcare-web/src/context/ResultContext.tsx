import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAllResults,
  getResultById,
  createResult,
  editResult,
  getResultsByUserId, // Đảm bảo API này đã được định nghĩa trong resultApi
} from "../api/resultApi";
import type { Result } from "../types/result";

interface ResultContextProps {
  results: Result[];
  loading: boolean;
  fetchResults: () => Promise<void>;
  getResult: (id: string) => Promise<Result | null>;
  addResult: (data: Result) => Promise<Result | null>;
  updateResult: (id: string, data: Result) => Promise<Result | null>;
  getResultsByUserId: (userId: string) => Promise<Result[]>;
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

  const addResult = async (data: Result): Promise<Result | null> => {
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

  const getResultsByUserId = async (userId: string): Promise<Result[]> => {
    setLoading(true);
    try {
      const userResults = await getResultsByUserId(userId); // Gọi API đúng
      setResults(userResults); // Cập nhật state với kết quả
      return userResults;
    } catch (err: any) {
      console.error(`Failed to get results for user with id ${userId}:`, err);
      setResults([]); // Đặt về mảng rỗng khi lỗi
      return [];
    } finally {
      setLoading(false);
    }
  };

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
        getResultsByUserId,
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