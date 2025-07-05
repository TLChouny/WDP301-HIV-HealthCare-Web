import React, { createContext, useContext } from "react";
import {
  getAllARVRRegimens,
  getARVRRegimenById,
  createARVRRegimen,
  updateARVRRegimen,
  deleteARVRRegimen,
} from "../api/arvApi";
import type { ARVRegimen } from "../types/arvRegimen";

interface ArvContextProps {
  getAll: () => Promise<ARVRegimen[]>;
  getById: (id: string) => Promise<ARVRegimen>;
  create: (data: Partial<ARVRegimen>) => Promise<ARVRegimen>;
  update: (id: string, data: Partial<ARVRegimen>) => Promise<ARVRegimen>;
  remove: (id: string) => Promise<void>;
}

const ArvContext = createContext<ArvContextProps | undefined>(undefined);

export const ArvProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getAll = async () => await getAllARVRRegimens();
  const getById = async (id: string) => await getARVRRegimenById(id);
  const create = async (data: Partial<ARVRegimen>) => await createARVRRegimen(data);
  const update = async (id: string, data: Partial<ARVRegimen>) => await updateARVRRegimen(id, data);
  const remove = async (id: string) => await deleteARVRRegimen(id);

  return (
    <ArvContext.Provider value={{ getAll, getById, create, update, remove }}>
      {children}
    </ArvContext.Provider>
  );
};

export const useArv = (): ArvContextProps => {
  const context = useContext(ArvContext);
  if (!context) throw new Error("useArv must be used within an ArvProvider");
  return context;
};