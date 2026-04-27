"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { Business } from "@/lib/types";
import { pinFor } from "@/lib/businesses";
import { industryColor } from "@/lib/industry-colors";

function pinIconFor(color: string) {
  return L.divIcon({
    className: "",
    html: `<div class="eod-pin" style="background:${color};color:${color}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

interface MarkerEntry {
  business: Business;
  position: [number, number];
}

function FitToMarkers({ markers }: { markers: MarkerEntry[] }) {
  const map = useMap();
  useEffect(() => {
    if (!markers.length) return;
    const bounds = L.latLngBounds(markers.map((m) => m.position));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
  }, [map, markers]);
  return null;
}

export default function MapClient({ businesses }: { businesses: Business[] }) {
  const markers = useMemo<MarkerEntry[]>(() => {
    const out: MarkerEntry[] = [];
    const groups = new Map<string, Business[]>();
    for (const b of businesses) {
      const p = pinFor(b);
      if (!p) continue;
      const key = p.join(",");
      const arr = groups.get(key) ?? [];
      arr.push(b);
      groups.set(key, arr);
    }
    for (const [key, arr] of groups) {
      const [lat, lng] = key.split(",").map(Number);
      arr.forEach((b, i) => {
        const angle = (i / Math.max(arr.length, 1)) * Math.PI * 2;
        const r = arr.length > 1 ? 0.35 : 0;
        out.push({
          business: b,
          position: [lat + Math.sin(angle) * r, lng + Math.cos(angle) * r],
        });
      });
    }
    return out;
  }, [businesses]);

  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
      />
      {markers.map(({ business, position }) => {
        const color = industryColor(business.industry).pin;
        return (
          <Marker key={business.slug} position={position} icon={pinIconFor(color)}>
            <Popup>
              <div className="font-semibold tracking-tight text-[14px] text-[#1d1d1f]">
                {business.name}
              </div>
              <div className="mt-0.5 text-[12px] text-[#6e6e73]">
                {business.industry} · {business.location}
              </div>
              <Link
                href={`/businesses/${business.slug}`}
                className="mt-2 inline-block text-[12px] font-medium text-[#1d1d1f] underline underline-offset-2"
              >
                View business →
              </Link>
            </Popup>
          </Marker>
        );
      })}
      <FitToMarkers markers={markers} />
    </MapContainer>
  );
}
