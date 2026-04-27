import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/BusinessCard";
import { getActiveStates, getBusinessesByState } from "@/lib/businesses";
import { STATE_NAMES } from "@/lib/states";
import type { StateCode } from "@/lib/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return getActiveStates().map((s) => ({ code: s.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const upper = code.toUpperCase() as StateCode;
  const name = STATE_NAMES[upper];
  if (!name) return { title: "State — BuyEOD" };
  return {
    title: `EOD-owned businesses in ${name} — BuyEOD`,
    description: `Find every EOD-owned business in ${name}.`,
  };
}

export default async function StatePage({ params }: PageProps) {
  const { code } = await params;
  const upper = code.toUpperCase() as StateCode;
  if (!STATE_NAMES[upper]) notFound();
  const businesses = getBusinessesByState(upper);

  return (
    <section className="container-page py-16 sm:py-20">
      <Link
        href="/businesses"
        className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
      >
        ← Directory
      </Link>
      <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
        {upper}
      </div>
      <h1 className="display-1 mt-3 text-ink">{STATE_NAMES[upper]}.</h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
        {businesses.length} EOD-owned {businesses.length === 1 ? "business" : "businesses"}{" "}
        based here.
      </p>

      {businesses.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <BusinessCard key={b.slug} business={b} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-ink-line/70 bg-ink-surface px-8 py-12">
          <div className="text-[15px] text-ink-muted">
            No businesses in {STATE_NAMES[upper]} yet. Know someone? Tell them to submit.
          </div>
        </div>
      )}
    </section>
  );
}
