"use client";

import { useState, useRef, useEffect } from "react";
import { CITIES, getCitiesByState, type City } from "@/lib/cities";

interface CityPickerProps {
  selectedCity: City;
  onChange: (city: City) => void;
}

export default function CityPicker({ selectedCity, onChange }: CityPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const query = search.toLowerCase().trim();
  const citiesByState = getCitiesByState();

  // Filter cities and states based on search
  const filteredStates = Object.entries(citiesByState)
    .map(([state, cities]) => {
      const stateMatch = state.toLowerCase().includes(query);
      const filteredCities = stateMatch
        ? cities
        : cities.filter((c) => c.name.toLowerCase().includes(query));
      return { state, cities: filteredCities };
    })
    .filter((g) => g.cities.length > 0);

  // Flat search results for quick pick
  const flatResults = query
    ? CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.state.toLowerCase().includes(query)
      )
    : [];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          setSearch("");
        }}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors min-w-[180px]"
      >
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">
          {selectedCity.name}
          <span className="text-gray-400 ml-1 text-xs">{selectedCity.state}</span>
        </span>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[340px] bg-white rounded-xl shadow-xl border border-gray-200 z-[1000] overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city or state..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto">
            {query ? (
              // Flat search results
              flatResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-400">
                  No cities found for &quot;{search}&quot;
                </div>
              ) : (
                <div className="p-1">
                  {flatResults.map((city) => (
                    <button
                      key={`${city.state}-${city.name}`}
                      onClick={() => {
                        onChange(city);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                        selectedCity.name === city.name && selectedCity.state === city.state
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="font-medium">{city.name}</span>
                      <span className="text-xs text-gray-400">{city.state}</span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              // Grouped by state
              filteredStates.map(({ state, cities }) => (
                <div key={state}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
                    {state}
                  </div>
                  <div className="p-1">
                    {cities.map((city) => (
                      <button
                        key={`${city.state}-${city.name}`}
                        onClick={() => {
                          onChange(city);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedCity.name === city.name && selectedCity.state === city.state
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
