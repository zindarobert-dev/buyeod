import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBusinesses, getBusinessBySlug } from "@/lib/businesses";
import { STATE_NAMES } from "@/lib/states";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBusinesses().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = getBusinessBySlug(slug);
  if (!b) return { title: "Business — BuyEOD" };
  return {
    title: `${b.name} — BuyEOD`,
    description: b.description ?? `${b.industry} — owned by ${b.ownerName}.`,
  };
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <article className="container-page py-16 sm:py-24">
      <Link
        href="/businesses"
        className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
      >
        ← Directory
      </Link>

      <div className="mt-8 max-w-3xl">
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
          {business.industry || "Business"}
        </div>
        <h1 className="display-1 mt-4 text-ink">{business.name}</h1>
        <div className="mt-6 text-[17px] text-ink-muted">
          {business.location}
          {business.state && (
            <>
              {" · "}
              <Link
                href={`/state/${business.state.toLowerCase()}`}
                className="text-ink underline-offset-4 hover:underline"
              >
                {STATE_NAMES[business.state]}
              </Link>
            </>
          )}
        </div>
      </div>

      {business.description && (
        <p className="mt-12 max-w-2xl text-[19px] leading-relaxed text-ink">
          {business.description}
        </p>
      )}

      <div className="mt-14 grid grid-cols-1 gap-10 border-t border-ink-line/70 pt-10 sm:grid-cols-3">
        <Field label="Owner" value={business.ownerName} />
        <Field label="Industry" value={business.industry || "—"} />
        <Field label="Location" value={business.location || "—"} />
        {business.phone && (
          <Field
            label="Phone"
            value={
              <a
                href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}
                className="hover:underline underline-offset-4"
              >
                {business.phone}
              </a>
            }
          />
        )}
      </div>

      {business.website && (
        <div className="mt-12">
          <a
            href={business.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-crab px-7 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(208,74,23,0.55)] transition-all hover:bg-crab-deep hover:shadow-[0_10px_28px_-8px_rgba(208,74,23,0.7)]"
          >
            Visit website ↗
          </a>
        </div>
      )}
    </article>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
      <div className="mt-2 text-[15px] text-ink">{value}</div>
    </div>
  );
}
