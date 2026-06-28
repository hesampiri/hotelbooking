"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface HotelMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  city?: string;
  country?: string;
  pricePerNight?: number;
  imageUrl?: string;
}

interface HotelMapProps {
  hotels: HotelMarker[];
  className?: string;
  onMarkerClick?: (hotel: HotelMarker) => void;
}

// Fix Leaflet's broken default icon paths in Next.js
const createHotelIcon = () =>
  L.divIcon({
    className: "leaflet-hotel-icon",
    html: `
      <div style="position: relative; width: 40px; height: 52px;">
        <svg viewBox="0 0 40 52" width="40" height="52">
          <path
            d="M20 2 C10.6 2 3 9.6 3 19 C3 34 20 50 20 50 C20 50 37 34 37 19 C37 9.6 29.4 2 20 2 Z"
            fill="oklch(0.553 0.195 38.402)"
            stroke="oklch(0.45 0.195 38.402)"
            stroke-width="1.5"
          />
          <circle cx="20" cy="19" r="6" fill="white" opacity="0.4"/>
        </svg>
      </div>
    `,
    iconSize: [40, 52],
    iconAnchor: [20, 50],
  });

const createPopupContent = (hotel: HotelMarker) => `
  <div style="min-width:180px; font-family: inherit;">
    ${
      hotel.imageUrl
        ? `<img src="${hotel.imageUrl}" alt="${hotel.name}"
            style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />`
        : ""
    }
    <div style="font-weight:700;font-size:14px;color:#111827;margin-bottom:2px;">
      ${hotel.name}
    </div>
    ${
      hotel.city || hotel.country
        ? `<div style="font-size:12px;color:#6B7280;margin-bottom:4px;">
            ${[hotel.city, hotel.country].filter(Boolean).join(", ")}
           </div>`
        : ""
    }
    <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
      ${
        hotel.rating != null
          ? `<span style="font-size:12px;font-weight:600;background:#F3F4F6;
               padding:2px 7px;border-radius:999px;">
               ★ ${hotel.rating.toFixed(1)}
             </span>`
          : ""
      }
      ${
        hotel.pricePerNight != null
          ? `<span style="font-size:12px;color:#111827;">
               <b>$${hotel.pricePerNight}</b> / night
             </span>`
          : ""
      }
    </div>
  </div>
`;

export default function HotelMap({
  hotels,
  className = "w-full h-125",
  onMarkerClick,
}: HotelMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Init map
    const map = L.map(containerRef.current, {
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

    // Custom zoom control position
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when hotels change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (hotels.length === 0) return;

    const icon = createHotelIcon();
    const bounds: [number, number][] = [];

    hotels.forEach((hotel) => {
      const marker = L.marker([hotel.lat, hotel.lng], { icon })
        .addTo(map)
        .bindPopup(createPopupContent(hotel), {
          maxWidth: 220,
          className: "hotel-popup",
        });

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(hotel));
      }

      markersRef.current.push(marker);
      bounds.push([hotel.lat, hotel.lng]);
    });

    // Fit all markers in view
    if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    } else {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [hotels, onMarkerClick]);

  return (
    <>
      <style>{`
        .hotel-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          padding: 0;
          overflow: hidden;
        }
        .hotel-popup .leaflet-popup-content {
          margin: 12px;
        }
        .hotel-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      <div ref={containerRef} className={className} />
    </>
  );
}
