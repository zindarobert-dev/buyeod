"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { StateCode } from "@/lib/types";
import { STATE_NAMES } from "@/lib/states";

export function StateFilter({
  activeStates,
  selected,
}: {
  activeStates: StateCode[];
  selected: StateCode | null;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function setState(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set("state", value);
    else next.delete("state");
    startTransition(() => {
      router.replace(`/businesses${next.toString() ? `?${next}` : ""}`, { scroll: false });
    });
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Filter by state</span>
      <select
        value={selected ?? ""}
        onChange={(e) => setState(e.target.value)}
        className="appearance-none rounded-full border border-ink-line bg-white py-2 pl-4 pr-10 text-[13px] font-medium text-ink transition-colors hover:border-ink/40 focus:border-ink focus:outline-none"
      >
        <option value="">All states</option>
        {activeStates.map((s) => (
          <option key={s} value={s}>
            {STATE_NAMES[s]}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 h-3 w-3 text-ink-muted"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
