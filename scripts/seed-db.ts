/**
 * One-shot import: copies data/businesses.json into the Postgres `businesses`
 * table with status='approved'. Idempotent — re-running won't create duplicates
 * because slug is unique and we use ON CONFLICT DO NOTHING.
 */
import fs from "node:fs";
import path from "node:path";
import { db, schema } from "@/db/client";
import { parseState } from "@/lib/states";
import { slugify } from "@/lib/slug";

interface RawBusiness {
  name: string;
  ownerName: string;
  industry: string;
  location: string;
  website?: string;
  phone?: string;
  description?: string;
}

async function main() {
  const file = path.join(process.cwd(), "data", "businesses.json");
  const raw: RawBusiness[] = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Seeding ${raw.length} businesses…`);

  let inserted = 0;
  for (const b of raw) {
    const slug = slugify(b.name);
    const state = parseState(b.location);
    const result = await db
      .insert(schema.businesses)
      .values({
        slug,
        name: b.name,
        ownerName: b.ownerName,
        industry: b.industry,
        location: b.location,
        state,
        website: b.website,
        phone: b.phone,
        description: b.description,
        status: "approved",
        approvedAt: new Date(),
        approvedBy: "seed",
      })
      .onConflictDoNothing({ target: schema.businesses.slug })
      .returning({ id: schema.businesses.id });
    if (result.length) inserted++;
  }
  console.log(`Inserted ${inserted} new rows (others already existed).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit(0));
