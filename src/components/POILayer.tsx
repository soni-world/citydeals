"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export interface POIType {
  key: string;
  label: string;
  query: string; // Overpass tag query
  color: string;
  emoji: string;
}

export const POI_TYPES: POIType[] = [
  {
    key: "restaurant",
    label: "Restaurants",
    query: '["amenity"="restaurant"]',
    color: "#ef4444",
    emoji: "\uD83C\uDF7D\uFE0F",
  },
  {
    key: "cafe",
    label: "Cafes",
    query: '["amenity"="cafe"]',
    color: "#92400e",
    emoji: "\u2615",
  },
  {
    key: "shop",
    label: "Shops",
    query: '["shop"]',
    color: "#8b5cf6",
    emoji: "\uD83D\uDED2",
  },
  {
    key: "hospital",
    label: "Hospitals",
    query: '["amenity"="hospital"]',
    color: "#dc2626",
    emoji: "\uD83C\uDFE5",
  },
  {
    key: "pharmacy",
    label: "Pharmacies",
    query: '["amenity"="pharmacy"]',
    color: "#16a34a",
    emoji: "\uD83D\uDC8A",
  },
  {
    key: "atm",
    label: "ATMs & Banks",
    query: '["amenity"~"atm|bank"]',
    color: "#0284c7",
    emoji: "\uD83C\uDFE7",
  },
  {
    key: "fuel",
    label: "Petrol Pumps",
    query: '["amenity"="fuel"]',
    color: "#ea580c",
    emoji: "\u26FD",
  },
  {
    key: "school",
    label: "Schools",
    query: '["amenity"~"school|college|university"]',
    color: "#ca8a04",
    emoji: "\uD83C\uDFEB",
  },
];

function createPOIIcon(emoji: string, color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: default;
    ">${emoji}</div>`,
    className: "poi-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  });
}

interface POILayerProps {
  enabledTypes: string[];
}

interface POINode {
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export default function POILayer({ enabledTypes }: POILayerProps) {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const cacheRef = useRef<Record<string, POINode[]>>({});
  const fetchingRef = useRef<Set<string>>(new Set());
  const lastBoundsRef = useRef<string>("");

  const fetchPOIs = useCallback(async (poiType: POIType, bounds: L.LatLngBounds) => {
    const boundsKey = `${poiType.key}-${bounds.toBBoxString()}`;
    if (cacheRef.current[boundsKey] || fetchingRef.current.has(poiType.key)) {
      return cacheRef.current[boundsKey] || [];
    }

    fetchingRef.current.add(poiType.key);

    const s = bounds.getSouth();
    const w = bounds.getWest();
    const n = bounds.getNorth();
    const e = bounds.getEast();

    const query = `
      [out:json][timeout:10];
      (
        node${poiType.query}(${s},${w},${n},${e});
      );
      out body 50;
    `;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (!res.ok) return [];

      const data = await res.json();
      const nodes: POINode[] = data.elements || [];
      cacheRef.current[boundsKey] = nodes;
      return nodes;
    } catch {
      return [];
    } finally {
      fetchingRef.current.delete(poiType.key);
    }
  }, []);

  const updateMarkers = useCallback(async () => {
    const bounds = map.getBounds();
    const boundsKey = bounds.toBBoxString();

    // Don't re-fetch if bounds haven't changed meaningfully
    if (boundsKey === lastBoundsRef.current) return;
    lastBoundsRef.current = boundsKey;

    const group = layerGroupRef.current;
    group.clearLayers();

    if (enabledTypes.length === 0) return;

    // Only fetch POIs when zoomed in enough (zoom >= 14) to avoid huge queries
    if (map.getZoom() < 14) return;

    const activePOITypes = POI_TYPES.filter((p) => enabledTypes.includes(p.key));

    const results = await Promise.all(
      activePOITypes.map(async (poiType) => {
        const nodes = await fetchPOIs(poiType, bounds);
        return { poiType, nodes };
      })
    );

    // Clear again in case another update started
    group.clearLayers();

    for (const { poiType, nodes } of results) {
      const icon = createPOIIcon(poiType.emoji, poiType.color);
      for (const node of nodes) {
        const marker = L.marker([node.lat, node.lon], { icon, interactive: true });
        const name = node.tags?.name || poiType.label.replace(/s$/, "");
        const cuisine = node.tags?.cuisine ? ` (${node.tags.cuisine})` : "";
        const phone = node.tags?.phone || node.tags?.["contact:phone"] || "";
        const website = node.tags?.website || "";

        let popupHtml = `
          <div style="min-width: 150px; font-family: inherit;">
            <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${name}${cuisine}</div>
            <div style="display: inline-block; background: ${poiType.color}20; color: ${poiType.color}; font-size: 11px; padding: 2px 8px; border-radius: 99px; font-weight: 500; margin-bottom: 6px;">
              ${poiType.emoji} ${poiType.label.replace(/s$/, "")}
            </div>
        `;

        if (node.tags?.["addr:full"] || node.tags?.["addr:street"]) {
          popupHtml += `<div style="font-size: 11px; color: #6b7280; margin-top: 4px;">${node.tags["addr:full"] || node.tags["addr:street"]}</div>`;
        }

        if (phone) {
          popupHtml += `<div style="font-size: 11px; margin-top: 4px;"><a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a></div>`;
        }

        if (website) {
          popupHtml += `<div style="font-size: 11px; margin-top: 2px;"><a href="${website}" target="_blank" rel="noopener" style="color: #4f46e5; text-decoration: none;">Visit website</a></div>`;
        }

        popupHtml += `</div>`;
        marker.bindPopup(popupHtml);
        group.addLayer(marker);
      }
    }
  }, [map, enabledTypes, fetchPOIs]);

  // Add layer group to map
  useEffect(() => {
    const group = layerGroupRef.current;
    group.addTo(map);
    return () => {
      group.remove();
    };
  }, [map]);

  // Fetch POIs on bounds change or enabled types change
  useEffect(() => {
    // Reset so next update actually runs
    lastBoundsRef.current = "";
    updateMarkers();

    const handler = () => {
      updateMarkers();
    };

    map.on("moveend", handler);
    return () => {
      map.off("moveend", handler);
    };
  }, [map, updateMarkers]);

  return null;
}
