import Link from "next/link";
import type { Business } from "@/lib/types";
import { STATE_NAMES } from "@/lib/states";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="group block rounded-2xl border border-ink-line/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
          {business.industry || "Business"}
        </div>
        {business.state && (
          <div className="text-[11px] font-medium text-ink-muted">
            {business.state}
          </div>
        )}
      </div>
      <div className="mt-3 text-[19px] font-semibold tracking-tight leading-snug text-ink">
        {business.name}
      </div>
      <div className="mt-1 text-[13px] text-ink-muted">
        {business.location || (business.state ? STATE_NAMES[business.state] : "")}
      </div>
      {business.description && (
        <div className="mt-4 line-clamp-3 text-[14px] leading-relaxed text-ink/80">
          {business.description}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between text-[13px]">
        <span className="text-ink-muted">{business.ownerName}</span>
        <span className="text-ink/70 transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
}
