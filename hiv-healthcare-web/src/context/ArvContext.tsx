import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllARVRRegimens,
  getARVRRegimenById,
  createARVRRegimen,
  updateARVRRegimen,
  deleteARVRRegimen,
} from "../api/arvApi";
import type { ARVRegimen } from "../types/arvRegimen";

interface ArvContextProps {
  regimens: ARVRegimen[];
  loading: boolean;
  error: string | null;
  getAll: () => Promise<ARVRegimen[]>;
  getById: (id: string) => Promise<ARVRegimen | null>;
  create: (data: Omit<ARVRegimen, '_id'>) => Promise<ARVRegimen | null>;
  update: (id: string, data: Partial<ARVRegimen>) => Promise<ARVRegimen | null>;
  remove: (id: string) => Promise<void>;
}

const ArvContext = createContext<ArvContextProps | undefined>(undefined);

export const ArvProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regimens, setRegimens] = useState<ARVRegimen[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllARVRRegimens();
      setRegimens(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Không thể tải danh sách phác đồ ARV";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getARVRRegimenById(id);
    } catch (err: any) {
      console.error(`Failed to get ARV regimen with id ${id}:`, err);
      return null;
    }
  };

  const create = async (data: Omit<ARVRegimen, '_id'>) => {
    try {
      const newRegimen = await createARVRRegimen(data);
      setRegimens((prev) => [...prev, newRegimen]);
      return newRegimen;
    } catch (err: any) {
      console.error("Failed to create ARV regimen:", err);
      return null;
    }
  };

  const update = async (id: string, data: Partial<ARVRegimen>) => {
    try {
      const updatedRegimen = await updateARVRRegimen(id, data);
      setRegimens((prev) => prev.map((r) => (r._id === id ? updatedRegimen : r)));
      return updatedRegimen;
    } catch (err: any) {
      console.error(`Failed to update ARV regimen with id ${id}:`, err);
      return null;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteARVRRegimen(id);
      setRegimens((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      console.error(`Failed to delete ARV regimen with id ${id}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <ArvContext.Provider value={{ regimens, loading, error, getAll, getById, create, update, remove }}>
      {children}
    </ArvContext.Provider>
  );
};

export const useArv = (): ArvContextProps => {
  const context = useContext(ArvContext);
  if (!context) throw new Error("useArv must be used within an ArvProvider");
  return context;
};