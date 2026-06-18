import { DateRange } from "react-day-picker";
import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const twoDaysLater = new Date();
twoDaysLater.setDate(twoDaysLater.getDate() + 3);

export type FilterState = {
  dateRange: DateRange | null; // bug could appears
  destination: string;
};

export type FilterActions = {
  setdestination: (name: string) => void;
  setDateRange: (range: DateRange) => void;
  //   commitFilters: () => void;
};

export type FilterStore = FilterState & FilterActions;

export const defaultInitState: FilterState = {
  dateRange: { from: tomorrow, to: twoDaysLater },
  destination: "Tehran",
};

export const createSearchFilterStore = (
  initState: FilterState = defaultInitState,
) => {
  return createStore<FilterStore>()(
    devtools(
      (set) => ({
        ...initState,
        setdestination: (name) => set({ destination: name }),
        setDateRange: (range) => set({ dateRange: range }),
      }),
      { name: "SearchFilterStore" },
    ),
  );
};
