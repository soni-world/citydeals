"use client";

import { useState } from "react";
import { POI_TYPES } from "./POILayer";

interface POIControlsProps {
  enabledTypes: string[];
  onToggle: (key: string) => void;
  zoom: number;
}

export default function POIControls({ enabledTypes, onToggle, zoom }: POIControlsProps) {
  const [expanded, setExpanded] = useState(false);

  const activeCount = enabledTypes.length;

  return (
    <div className="absolute top-3 right-3 z-[1000]">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border text-sm font-medium transition-all ${
          expanded
            ? "bg-white border-gray-200 text-gray-900"
            : activeCount > 0
              ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Nearby Places</span>
        {activeCount > 0 && !expanded && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            expanded ? "bg-indigo-100 text-indigo-700" : "bg-white/20 text-white"
          }`}>
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {expanded && (
        <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-200 w-[220px] overflow-hidden">
          {zoom < 14 && (
            <div className="px-3 py-2 bg-amber-50 border-b border-amber-100 text-[11px] text-amber-700 flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Zoom in more to see nearby places
            </div>
          )}
          <div className="p-2 space-y-0.5 max-h-[320px] overflow-y-auto">
            {POI_TYPES.map((poi) => {
              const isOn = enabledTypes.includes(poi.key);
              return (
                <button
                  key={poi.key}
                  onClick={() => onToggle(poi.key)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-colors ${
                    isOn
                      ? "bg-indigo-50 text-indigo-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{
                      background: isOn ? poi.color : "#f3f4f6",
                      border: isOn ? "2px solid white" : "2px solid #e5e7eb",
                      boxShadow: isOn ? `0 2px 8px ${poi.color}40` : "none",
                    }}
                  >
                    {poi.emoji}
                  </span>
                  <span className={`flex-1 ${isOn ? "font-medium" : ""}`}>
                    {poi.label}
                  </span>
                  <div className={`w-8 h-[18px] rounded-full transition-colors relative ${
                    isOn ? "bg-indigo-600" : "bg-gray-300"
                  }`}>
                    <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform ${
                      isOn ? "left-[16px]" : "left-[2px]"
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
          {activeCount > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => {
                  enabledTypes.forEach((key) => onToggle(key));
                }}
                className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
