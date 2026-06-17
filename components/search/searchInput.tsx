"use client";
import { useState } from "react";
import { useFilterStore } from "@/providers/filter-store-provider";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/features/hotel/queries/hotelApi";
import { MapPin } from "lucide-react";

const SearchInput = () => {
  const destination = useFilterStore((state) => state.destination);
  const setdestination = useFilterStore((state) => state.setdestination);
  const [inputError, setinputError] = useState("");

  const {
    data: locations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setdestination(value);
    setinputError(value.trim() === "" ? "Destination cannot be empty" : "");
  };
  return (
    <div className="grow-3">
      <Combobox items={locations}>
        <ComboboxInput
          className={"h-12"}
          type="text"
          placeholder="Search for your destination"
          value={destination}
          onChange={handleChange}
          autoComplete="off"
          aria-invalid={inputError ? true : false}
        />
        <ComboboxContent>
          {locations?.length === 0 ? (
            <ComboboxEmpty>No destinations found.</ComboboxEmpty>
          ) : (
            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  key={`${item.city}-${item.country}`}
                  value={item.city}
                  onClick={() => {
                    setdestination(item.city);
                    setinputError("");
                  }}
                >
                  <MapPin className="text-muted-foreground size-5" />
                  <div>
                    <p>{item.city}</p>
                    <p className="text-muted-foreground">{item.country}</p>
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
          )}
        </ComboboxContent>
      </Combobox>
      {inputError && <p className="text-red-500 text-xs mt-1">{inputError}</p>}
    </div>
  );
};

export default SearchInput;
