import { NextResponse } from "next/server";
import { db, schema } from "@/db/client";
import { parseState } from "@/lib/states";
import { slugify } from "@/lib/slug";
import { eq } from "drizzle-orm";

interface SubmitBody {
  name?: string;
  industry?: string;
  website?: string;
  ownerName?: string;
  phone?: string;
  location?: string;
  description?: string;
  email?: string;
  /** Honeypot — must be empty. Anything else means it's a bot. */
  hp?: string;
}

function sanitize(s: unknown, max = 1000): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

function normalizeWebsite(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (/\s/.test(v.replace(/^https?:\/\//i, ""))) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\./i.test(v)) return `https://${v}`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(v)) return `https://${v}`;
  return v;
}

/**
 * Find a slug that isn't already taken — most submissions will be unique on
 * first try; a duplicate name (e.g. "EOD Home Loans" twice) gets -2, -3, etc.
 */
async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await db
      .select({ id: schema.businesses.id })
      .from(schema.businesses)
      .where(eq(schema.businesses.slug, slug))
      .limit(1);
    if (existing.length === 0) return slug;
    n++;
    slug = `${base}-${n}`;
    if (n > 50) return `${base}-${Date.now()}`; // pathological guard
  }
}

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (body.hp && body.hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const fields = {
    name: sanitize(body.name, 200),
    industry: sanitize(body.industry, 200),
    website: sanitize(body.website, 500),
    ownerName: sanitize(body.ownerName, 200),
    phone: sanitize(body.phone, 50),
    location: sanitize(body.location, 200),
    description: sanitize(body.description, 2000),
    email: sanitize(body.email, 200),
  };

  if (!fields.name || !fields.ownerName || !fields.location || !fields.industry) {
    return NextResponse.json(
      { ok: false, error: "missing_required" },
      { status: 400 },
    );
  }

  const baseSlug = slugify(fields.name);
  if (!baseSlug) {
    return NextResponse.json(
      { ok: false, error: "invalid_name" },
      { status: 400 },
    );
  }
  const slug = await uniqueSlug(baseSlug);

  try {
    await db.insert(schema.businesses).values({
      slug,
      name: fields.name,
      ownerName: fields.ownerName,
      industry: fields.industry,
      location: fields.location,
      state: parseState(fields.location),
      website: normalizeWebsite(fields.website),
      phone: fields.phone || null,
      description: fields.description || null,
      submitterEmail: fields.email || null,
      status: "pending",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "db_write_failed", detail: String(err) },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
