import type { Business, StateCode } from "./types";

export const STATE_NAMES: Record<StateCode, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
};

/** Geographic centers for state-level pin placement when only a state is known. */
export const STATE_CENTERS: Record<StateCode, [number, number]> = {
  AL: [32.806671, -86.791130], AK: [61.370716, -152.404419], AZ: [33.729759, -111.431221],
  AR: [34.969704, -92.373123], CA: [36.116203, -119.681564], CO: [39.059811, -105.311104],
  CT: [41.597782, -72.755371], DE: [39.318523, -75.507141], FL: [27.766279, -81.686783],
  GA: [33.040619, -83.643074], HI: [21.094318, -157.498337], ID: [44.240459, -114.478828],
  IL: [40.349457, -88.986137], IN: [39.849426, -86.258278], IA: [42.011539, -93.210526],
  KS: [38.526600, -96.726486], KY: [37.668140, -84.670067], LA: [31.169546, -91.867805],
  ME: [44.693947, -69.381927], MD: [39.063946, -76.802101], MA: [42.230171, -71.530106],
  MI: [43.326618, -84.536095], MN: [45.694454, -93.900192], MS: [32.741646, -89.678696],
  MO: [38.456085, -92.288368], MT: [46.921925, -110.454353], NE: [41.125370, -98.268082],
  NV: [38.313515, -117.055374], NH: [43.452492, -71.563896], NJ: [40.298904, -74.521011],
  NM: [34.840515, -106.248482], NY: [42.165726, -74.948051], NC: [35.630066, -79.806419],
  ND: [47.528912, -99.784012], OH: [40.388783, -82.764915], OK: [35.565342, -96.928917],
  OR: [44.572021, -122.070938], PA: [40.590752, -77.209755], RI: [41.680893, -71.511780],
  SC: [33.856892, -80.945007], SD: [44.299782, -99.438828], TN: [35.747845, -86.692345],
  TX: [31.054487, -97.563461], UT: [40.150032, -111.862434], VT: [44.045876, -72.710686],
  VA: [37.769337, -78.169968], WA: [47.400902, -121.490494], WV: [38.491226, -80.954453],
  WI: [44.268543, -89.616508], WY: [42.755966, -107.302490], DC: [38.897438, -77.026817],
};

const STATE_BY_NAME: Record<string, StateCode> = Object.fromEntries(
  (Object.entries(STATE_NAMES) as [StateCode, string][])
    .map(([code, name]) => [name.toLowerCase(), code]),
) as Record<string, StateCode>;

const STATE_BY_CODE: Record<string, StateCode> = Object.fromEntries(
  (Object.keys(STATE_NAMES) as StateCode[]).map((c) => [c.toLowerCase(), c]),
) as Record<string, StateCode>;

/**
 * Pull a state code out of a free-form location string.
 * Examples: "Austin, TX" → "TX"; "Texas" → "TX"; "Brooklyn, New York" → "NY".
 */
export function parseState(location: string): StateCode | null {
  if (!location) return null;
  const cleaned = location.trim();

  // Try trailing 2-letter code: "..., TX" or "..., TX 78701"
  const codeMatch = cleaned.match(/\b([A-Za-z]{2})\b(?:\s+\d{5})?\s*$/);
  if (codeMatch) {
    const code = STATE_BY_CODE[codeMatch[1].toLowerCase()];
    if (code) return code;
  }

  // Try full state name appearing anywhere
  const lower = cleaned.toLowerCase();
  for (const name of Object.keys(STATE_BY_NAME)) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) return STATE_BY_NAME[name];
  }

  return null;
}

export const ALL_STATES: StateCode[] = Object.keys(STATE_NAMES) as StateCode[];

/** Coordinates to render a pin for a business, falling back to the state centroid.
 *  Lives here (and not in lib/businesses.ts) so client components can import it
 *  without pulling the DB client into the browser bundle. */
export function pinFor(b: Business): [number, number] | null {
  if (b.coordinates) return [b.coordinates.lat, b.coordinates.lng];
  if (b.state) return STATE_CENTERS[b.state];
  return null;
}
