import Link from "next/link";
import type { Business } from "@/lib/types";
import { STATE_NAMES } from "@/lib/states";
import { industryColor } from "@/lib/industry-colors";

export function BusinessCard({ business }: { business: Business }) {
  const color = industryColor(business.industry);
  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-ink-line/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_18px_44px_-18px_rgba(0,0,0,0.22)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color.pin }}
      />
      <div className="flex items-start justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color.pin }}
          />
          <span style={{ color: color.fg }}>
            {business.industry || "Business"}
          </span>
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
        <span
          className="transition-transform group-hover:translate-x-0.5"
          style={{ color: color.pin }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
