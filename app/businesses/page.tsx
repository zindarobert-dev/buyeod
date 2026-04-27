import { Suspense } from "react";
import { BusinessCard } from "@/components/BusinessCard";
import { StateFilter } from "@/components/StateFilter";
import { getAllBusinesses, getActiveStates } from "@/lib/businesses";
import { STATE_NAMES } from "@/lib/states";
import type { StateCode } from "@/lib/types";

export const metadata = {
  title: "Directory — BuyEOD",
  description: "Browse every EOD-owned business in the directory.",
};

interface PageProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function BusinessesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const all = getAllBusinesses();
  const activeStates = getActiveStates();

  const selectedRaw = sp.state?.toUpperCase();
  const selected: StateCode | null =
    selectedRaw && activeStates.includes(selectedRaw as StateCode)
      ? (selectedRaw as StateCode)
      : null;

  const list = selected ? all.filter((b) => b.state === selected) : all;

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
        Directory
      </div>
      <h1 className="display-2 mt-3 text-ink">
        {selected ? `${STATE_NAMES[selected]}.` : "Every business."}
      </h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
        {list.length} {list.length === 1 ? "business" : "businesses"}
        {selected ? ` in ${STATE_NAMES[selected]}` : " across the country"}.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Suspense fallback={null}>
          <StateFilter activeStates={activeStates} selected={selected} />
        </Suspense>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => (
          <BusinessCard key={b.slug} business={b} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-16 rounded-2xl border border-ink-line/70 bg-ink-surface px-8 py-12 text-center">
          <div className="text-[15px] text-ink-muted">
            No businesses listed{selected ? ` in ${STATE_NAMES[selected]}` : ""} yet.
          </div>
        </div>
      )}
    </section>
  );
}
