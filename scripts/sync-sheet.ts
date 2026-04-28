/**
 * Pulls Google Form responses from a public Google Sheet and writes them to
 * data/businesses.json.
 *
 * Setup (one-time):
 *   1) Open the form's responses sheet → Share → "Anyone with the link" → Viewer
 *   2) Copy the sheet ID and the responses-tab GID from the URL
 *   3) Set GOOGLE_SHEET_ID (and optionally GOOGLE_SHEET_GID) in .env or env
 *
 * Then: `npm run sync-sheet`
 *
 * The script maps columns by header name (case-insensitive, partial match OK).
 * Email Address and Timestamp are intentionally not pulled — they're not part of
 * the public listing.
 *
 * Approval gate (recommended):
 *   Add a column to the sheet named "Approved" (or "Approve" / "Verified").
 *   Rows are only synced to the public site if that cell is truthy
 *   (TRUE, yes, y, 1, x, ✓, ✔, approved — case-insensitive). Empty / FALSE / no
 *   keeps the row out of the directory until you flip it.
 *   If no Approved column exists, ALL rows sync (legacy behavior).
 */
import fs from "node:fs";
import path from "node:path";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GID = process.env.GOOGLE_SHEET_GID ?? "0";

if (!SHEET_ID) {
  console.error(
    "Missing GOOGLE_SHEET_ID. Set it in .env or pass it on the command line:\n" +
      "  GOOGLE_SHEET_ID=... GOOGLE_SHEET_GID=... npm run sync-sheet",
  );
  process.exit(1);
}

interface RawRow {
  name: string;
  ownerName: string;
  industry: string;
  location: string;
  website?: string;
  phone?: string;
  description?: string;
}

/** RFC 4180-ish CSV parser. Handles quoted fields, embedded commas, escaped quotes, CRLF. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function pickColumn(headers: string[], candidates: string[]): number {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const cand of candidates) {
    const c = cand.toLowerCase();
    const exact = lower.findIndex((h) => h === c);
    if (exact >= 0) return exact;
    const partial = lower.findIndex((h) => h.includes(c));
    if (partial >= 0) return partial;
  }
  return -1;
}

function normalizeWebsite(input: string): string | undefined {
  const v = input.trim();
  if (!v) return undefined;
  // Reject URLs with internal whitespace — they're typos, not navigable.
  if (/\s/.test(v.replace(/^https?:\/\//i, ""))) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\./i.test(v)) return `https://${v}`;
  // Plain domain like "example.com"
  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(v)) return `https://${v}`;
  return v;
}

async function main() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.error(`Failed to fetch sheet (HTTP ${res.status}). Make sure it's shared as "Anyone with the link → Viewer".`);
    process.exit(1);
  }
  const text = await res.text();
  const rows = parseCsv(text).filter((r) => r.some((c) => c.trim().length));
  if (rows.length < 2) {
    console.error("Sheet has no data rows.");
    process.exit(1);
  }

  const headers = rows[0];
  const cols = {
    name: pickColumn(headers, ["business legal name", "business name", "name of business", "business"]),
    location: pickColumn(headers, ["business location", "location", "city, state"]),
    industry: pickColumn(headers, ["business industry", "industry", "category"]),
    ownerName: pickColumn(headers, ["contact person full name", "owner name", "owner", "contact person"]),
    website: pickColumn(headers, ["business website", "website", "url"]),
    phone: pickColumn(headers, ["contact person phone", "phone number", "phone"]),
    description: pickColumn(headers, ["brief description", "description", "about"]),
    approved: pickColumn(headers, ["approved", "approve", "verified"]),
  };

  if (cols.name < 0) {
    console.error("Couldn't find a 'Business Name' column. Headers:", headers);
    process.exit(1);
  }

  const APPROVED_RE = /^(true|yes|y|1|x|✓|✔|approved|live)$/i;
  const gated = cols.approved >= 0;

  const data: RawRow[] = [];
  const pending: Array<{ name: string; location: string }> = [];

  for (const row of rows.slice(1)) {
    const get = (i: number) => (i >= 0 ? String(row[i] ?? "").trim() : "");
    const name = get(cols.name);
    if (!name) continue;

    if (gated) {
      const approval = get(cols.approved);
      if (!APPROVED_RE.test(approval)) {
        pending.push({ name, location: get(cols.location) });
        continue;
      }
    }

    data.push({
      name,
      ownerName: get(cols.ownerName),
      industry: get(cols.industry),
      location: get(cols.location),
      website: normalizeWebsite(get(cols.website)),
      phone: get(cols.phone) || undefined,
      description: get(cols.description) || undefined,
    });
  }

  const outPath = path.join(process.cwd(), "data", "businesses.json");
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${data.length} businesses → data/businesses.json`);

  if (!gated) {
    console.log(
      "\n⚠️  No 'Approved' column found. Every row was synced. Add a column to the\n" +
        "    sheet titled 'Approved' (TRUE/yes/checkbox-checked = publish) to gate\n" +
        "    new submissions before they appear on the live site.",
    );
  } else if (pending.length) {
    console.log(`\nPending approval (${pending.length}):`);
    for (const p of pending) {
      console.log(`  · ${p.name}${p.location ? ` — ${p.location}` : ""}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
