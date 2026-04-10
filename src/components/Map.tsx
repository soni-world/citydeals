"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Deal } from "@/lib/db";
import POILayer from "./POILayer";
import POIControls from "./POIControls";

// Fix default marker icons for Leaflet in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const newDealIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "hue-rotate-marker",
});

L.Marker.prototype.options.icon = defaultIcon;

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  useEffect(() => {
    onZoomChange(map.getZoom());
    const handler = () => onZoomChange(map.getZoom());
    map.on("zoomend", handler);
    return () => { map.off("zoomend", handler); };
  }, [map, onZoomChange]);
  return null;
}

// Only fire onMapClick for clicks on empty map area, not on markers/popups
function ClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onClick) return;

    const handler = (e: L.LeafletMouseEvent) => {
      // originalEvent.target is the actual DOM element clicked
      // If it's inside a marker or popup, skip
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest(".leaflet-marker-icon, .leaflet-popup, .poi-marker")) {
        return;
      }
      onClick(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map, onClick]);

  return null;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

interface MapProps {
  center: [number, number];
  zoom: number;
  deals: Deal[];
  onDealClick?: (deal: Deal) => void;
  onMapClick?: (lat: number, lng: number) => void;
  newMarker?: { lat: number; lng: number } | null;
}

export default function Map({ center, zoom, deals, onDealClick, onMapClick, newMarker }: MapProps) {
  const [enabledPOIs, setEnabledPOIs] = useState<string[]>([]);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  // Track if a marker was just clicked so we can suppress the map click
  const markerClickedRef = useRef(false);

  function togglePOI(key: string) {
    setEnabledPOIs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const handleZoomChange = useCallback((z: number) => {
    setCurrentZoom(z);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    // Skip if a marker was just clicked
    if (markerClickedRef.current) {
      markerClickedRef.current = false;
      return;
    }
    onMapClick?.(lat, lng);
  }, [onMapClick]);

  const handleMarkerClick = useCallback((deal: Deal) => {
    markerClickedRef.current = true;
    onDealClick?.(deal);
  }, [onDealClick]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-xl"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        <ZoomTracker onZoomChange={handleZoomChange} />
        <ClickHandler onClick={handleMapClick} />

        {/* POI overlay */}
        <POILayer enabledTypes={enabledPOIs} />

        {/* Deal markers */}
        {deals.map((deal) => (
          <Marker
            key={deal.id}
            position={[deal.lat, deal.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => { markerClickedRef.current = true; },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -42]}
              className="deal-tooltip"
            >
              <div className="max-w-[220px]">
                <p className="font-semibold text-gray-900 text-xs leading-tight truncate">{deal.title}</p>
                <p className="text-green-700 font-bold text-xs mt-0.5">{formatPrice(deal.price)}</p>
                <p className="text-gray-500 text-[10px] mt-1 line-clamp-2 leading-snug">{deal.description}</p>
                <span className="inline-block bg-blue-50 text-blue-700 text-[9px] px-1.5 py-0.5 rounded-full mt-1.5 font-medium">
                  {deal.category}
                </span>
              </div>
            </Tooltip>
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-base mb-1">{deal.title}</h3>
                <p className="text-green-700 font-semibold text-sm mb-1">{formatPrice(deal.price)}</p>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{deal.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mb-2">
                  {deal.category}
                </span>
                <div className="border-t pt-2 mt-1 space-y-1">
                  {deal.contact_phone && (
                    <p className="text-xs">
                      <span className="font-medium">Phone:</span>{" "}
                      <a href={`tel:${deal.contact_phone}`} className="text-blue-600 underline">
                        {deal.contact_phone}
                      </a>
                    </p>
                  )}
                  {deal.contact_email && (
                    <p className="text-xs">
                      <span className="font-medium">Email:</span>{" "}
                      <a href={`mailto:${deal.contact_email}`} className="text-blue-600 underline">
                        {deal.contact_email}
                      </a>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleMarkerClick(deal)}
                  className="mt-2 w-full text-xs bg-indigo-600 text-white py-1.5 px-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* New deal placement marker */}
        {newMarker && (
          <Marker
            position={[newMarker.lat, newMarker.lng]}
            icon={newDealIcon}
            eventHandlers={{
              click: () => { markerClickedRef.current = true; },
            }}
          >
            <Popup>
              <span className="text-sm font-medium text-orange-600">New deal location</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* POI controls overlay */}
      <POIControls
        enabledTypes={enabledPOIs}
        onToggle={togglePOI}
        zoom={currentZoom}
      />
    </div>
  );
}
