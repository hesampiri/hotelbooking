"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import {
  type FilterStore,
  createSearchFilterStore,
} from "@/stores/searchFilters";

export type FilterStoreApi = ReturnType<typeof createSearchFilterStore>;

export const FilterStoreContext = createContext<FilterStoreApi | undefined>(
  undefined,
);

export interface FilterStoreProviderProps {
  children: ReactNode;
}

export const FilterStoreProvider = ({ children }: FilterStoreProviderProps) => {
  const [store] = useState(() => createSearchFilterStore());
  return (
    <FilterStoreContext.Provider value={store}>
      {children}
    </FilterStoreContext.Provider>
  );
};

export const useFilterStore = <T,>(selector: (store: FilterStore) => T): T => {
  const filterStoreContext = useContext(FilterStoreContext);
  if (!filterStoreContext) {
    throw new Error(`useFilterStore must be used within FilterStoreProvider`);
  }

  return useStore(filterStoreContext, selector);
};
