import React, { createContext, useContext, useEffect, useState } from "react";
import type { Category } from "../types/category";
import { getAllCategories } from "../api/categoryApi";

// Declare interface for context
interface CategoryContextType {
  categories: Category[];
  refreshCategories: () => void;
}

// Create context with default value
const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  refreshCategories: () => {},
});

// Hook to use context
export const useCategoryContext = () => useContext(CategoryContext);

// Provider to wrap app/component and provide context
export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
