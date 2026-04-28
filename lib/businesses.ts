import { cache } from "react";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import type { Business, StateCode } from "./types";
import { STATE_CENTERS } from "./states";

/**
 * One DB read per request (cached via React.cache). All public pages share
 * the same approved-business set, so we fetch once and filter in memory.
 */
export const getApprovedBusinesses = cache(async (): Promise<Business[]> => {
  const rows = await db
    .select()
    .from(schema.businesses)
    .where(eq(schema.businesses.status, "approved"));
  return rows
    .map(rowToBusiness)
    .sort((a, b) => a.name.localeCompare(b.name));
});

function rowToBusiness(r: typeof schema.businesses.$inferSelect): Business {
  return {
    slug: r.slug,
    name: r.name,
    ownerName: r.ownerName,
    industry: r.industry,
    location: r.location,
    state: (r.state ?? null) as StateCode | null,
    website: r.website ?? undefined,
    phone: r.phone ?? undefined,
    description: r.description ?? undefined,
  };
}

export async function getAllBusinesses(): Promise<Business[]> {
  return getApprovedBusinesses();
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  const all = await getApprovedBusinesses();
  return all.find((b) => b.slug === slug);
}

export async function getBusinessesByState(state: StateCode): Promise<Business[]> {
  const all = await getApprovedBusinesses();
  return all.filter((b) => b.state === state);
}

export async function getActiveStates(): Promise<StateCode[]> {
  const all = await getApprovedBusinesses();
  const set = new Set<StateCode>();
  for (const b of all) if (b.state) set.add(b.state);
  return [...set].sort();
}

/** Coordinates to render a pin for a business, falling back to the state centroid. */
export function pinFor(b: Business): [number, number] | null {
  if (b.coordinates) return [b.coordinates.lat, b.coordinates.lng];
  if (b.state) return STATE_CENTERS[b.state];
  return null;
}

export async function getIndustries(): Promise<string[]> {
  const all = await getApprovedBusinesses();
  return [...new Set(all.map((b) => b.industry).filter(Boolean))].sort();
}
