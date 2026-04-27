"use client";

import dynamic from "next/dynamic";
import type { Business } from "@/lib/types";

// Leaflet touches `window` at import time, so we render the map only on the client.
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-surface text-[13px] text-ink-muted">
      Loading map…
    </div>
  ),
});

export function Map({ businesses }: { businesses: Business[] }) {
  return <MapClient businesses={businesses} />;
}
