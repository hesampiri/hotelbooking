"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useFilterStore } from "@/providers/filter-store-provider";

export function DatePickerRange() {
  const dateRange = useFilterStore((state) => state.dateRange);
  const setDateRange = useFilterStore((state) => state.setDateRange);

  const date: DateRange | undefined = dateRange?.from
    ? {
        from: dateRange.from,
        to: dateRange.to,
      }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange({
      from: range?.from,
      to: range?.to,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col md:flex-row cursor-pointer gap-1 w-full md:w-80">
          <Field className="relative rounded-md border p-3 *:w-auto">
            <span className=" absolute w-40 -top-2 left-3 bg-background px-1 text-xs text-muted-foreground">
              Check-in
            </span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {date?.from ? format(date.from, "MMM dd, yyyy") : "Select date"}
              </span>
            </div>
          </Field>

          <Field className="relative rounded-md border p-3 *:w-auto">
            <span className="absolute -top-2 left-3  bg-background w-[2px] px-1 text-xs text-muted-foreground">
              Check-out
            </span>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {date?.to ? format(date.to, "MMM dd, yyyy") : "Select date"}
              </span>
            </div>
          </Field>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date?.from}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
