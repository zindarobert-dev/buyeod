import raw from "@/data/businesses.json";
import type { Business, StateCode } from "./types";
import { STATE_CENTERS, parseState } from "./states";
import { slugify } from "./slug";

interface RawBusiness {
  name: string;
  ownerName: string;
  industry: string;
  location: string;
  website?: string;
  phone?: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
}

const businesses: Business[] = (raw as RawBusiness[]).map((b) => {
  const state = parseState(b.location);
  return {
    ...b,
    slug: slugify(b.name),
    state,
  };
});

export function getAllBusinesses(): Business[] {
  return businesses.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function getBusinessBySlug(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug);
}

export function getBusinessesByState(state: StateCode): Business[] {
  return businesses.filter((b) => b.state === state);
}

/** States that currently have at least one business, sorted alphabetically by code. */
export function getActiveStates(): StateCode[] {
  const set = new Set<StateCode>();
  for (const b of businesses) if (b.state) set.add(b.state);
  return [...set].sort();
}

/** Coordinates to render a pin for a business, falling back to the state centroid. */
export function pinFor(b: Business): [number, number] | null {
  if (b.coordinates) return [b.coordinates.lat, b.coordinates.lng];
  if (b.state) return STATE_CENTERS[b.state];
  return null;
}

export function getIndustries(): string[] {
  return [...new Set(businesses.map((b) => b.industry).filter(Boolean))].sort();
}
