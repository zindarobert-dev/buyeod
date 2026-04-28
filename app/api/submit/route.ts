import { NextResponse } from "next/server";

/**
 * Forwards a submission to the BuyEOD Google Form's public formResponse
 * endpoint. We do this server-side so the browser doesn't need to deal with
 * CORS, and so we can apply spam protection.
 */

const FORM_ID = "1FAIpQLSdngpzxXVwovTiVPi7mTWz0cMtsXfPpgAwb45hHQPhf2dyQsw";
const FORM_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

const ENTRY = {
  name: "entry.1717153368",
  industry: "entry.1870016159",
  website: "entry.896889341",
  ownerName: "entry.12157114",
  phone: "entry.960332084",
  location: "entry.2004430707",
  description: "entry.1323138764",
} as const;

interface SubmitBody {
  name?: string;
  industry?: string;
  website?: string;
  ownerName?: string;
  phone?: string;
  location?: string;
  description?: string;
  /** Honeypot — must be empty. Anything else means it's a bot. */
  hp?: string;
}

function sanitize(s: unknown, max = 1000): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot: real users won't fill this. Bots usually do.
  if (body.hp && body.hp.length > 0) {
    return NextResponse.json({ ok: true }); // pretend success, don't forward
  }

  const fields = {
    name: sanitize(body.name, 200),
    industry: sanitize(body.industry, 200),
    website: sanitize(body.website, 500),
    ownerName: sanitize(body.ownerName, 200),
    phone: sanitize(body.phone, 50),
    location: sanitize(body.location, 200),
    description: sanitize(body.description, 2000),
  };

  // Minimum viable submission: name + owner + location.
  if (!fields.name || !fields.ownerName || !fields.location) {
    return NextResponse.json(
      { ok: false, error: "missing_required" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (value) params.set(ENTRY[key as keyof typeof ENTRY], value);
  }

  let res: Response;
  try {
    res = await fetch(FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      // Don't follow redirects — Google returns a 302 to the confirm page
      // on success, and that's enough for us to know it worked.
      redirect: "manual",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "network", detail: String(err) },
      { status: 502 },
    );
  }

  // Google Forms returns 200 (or 302/303 redirect) on a successful submission.
  const ok = res.status === 200 || res.status === 302 || res.status === 303;
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "form_rejected", status: res.status },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
