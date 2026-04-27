export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY"
  | "DC";

export interface Business {
  slug: string;
  name: string;
  ownerName: string;
  industry: string;
  website?: string;
  /** Free-form location string as submitted (e.g. "Austin, TX" or "Texas"). */
  location: string;
  /** Parsed state code derived from `location`. */
  state: StateCode | null;
  /** Optional precise coordinates if we ever geocode the location. */
  coordinates?: { lat: number; lng: number };
  /** Short blurb shown on cards/detail. */
  description?: string;
  /** Public contact phone for the business. Submitter email is intentionally omitted. */
  phone?: string;
}
