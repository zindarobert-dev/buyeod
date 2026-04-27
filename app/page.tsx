import Link from "next/link";
import { Map } from "@/components/Map";
import { BusinessCard } from "@/components/BusinessCard";
import { getAllBusinesses, getActiveStates } from "@/lib/businesses";
import { STATE_NAMES } from "@/lib/states";

export default function Home() {
  const businesses = getAllBusinesses();
  const states = getActiveStates();
  const featured = businesses.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(1100px 520px at 12% -10%, rgba(168,67,29,0.18), transparent 60%), radial-gradient(900px 480px at 95% 0%, rgba(184,128,31,0.16), transparent 60%), radial-gradient(700px 400px at 50% 110%, rgba(29,58,95,0.10), transparent 65%)",
          }}
        />
        <div className="container-page pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-4xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-crab">
            Explosive Ordnance Disposal
          </div>
          <h1 className="display-1 mt-4 text-ink">
            Businesses owned by EOD techs.
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-muted sm:text-[20px]">
            A directory of companies built and run by people who once made bombs safe.
            Find them, hire them, and buy from them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/businesses"
              className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-medium text-white transition-colors hover:bg-ink/85"
            >
              Browse the directory
            </Link>
            <a
              href="https://www.facebook.com/groups/3602986686487583"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-ink-line px-6 text-[14px] font-medium text-ink transition-colors hover:border-ink/40"
            >
              Submit your business
            </a>
          </div>
        </div>
        </div>
      </section>

      {/* Map */}
      <section className="container-page">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              On the map
            </div>
            <h2 className="display-2 mt-3 text-ink">Find what's near you.</h2>
          </div>
          <div className="hidden text-[13px] text-ink-muted sm:block">
            {businesses.length} businesses · {states.length} states
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-ink-line/70 bg-ink-surface">
          <div className="h-[520px] w-full">
            <Map businesses={businesses} />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page mt-24">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              Featured
            </div>
            <h2 className="display-2 mt-3 text-ink">Recently added.</h2>
          </div>
          <Link
            href="/businesses"
            className="hidden text-[14px] font-medium text-ink-muted hover:text-ink sm:inline-block"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => (
            <BusinessCard key={b.slug} business={b} />
          ))}
        </div>
      </section>

      {/* Browse by state */}
      <section className="container-page mt-24">
        <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          By location
        </div>
        <h2 className="display-2 mt-3 text-ink">Browse by state.</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {states.map((s) => (
            <Link
              key={s}
              href={`/state/${s.toLowerCase()}`}
              className="rounded-full border border-ink-line bg-white px-4 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-ink-surface"
            >
              {STATE_NAMES[s]}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-28">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-white sm:px-16 sm:py-20"
          style={{
            backgroundImage:
              "radial-gradient(900px 600px at 0% 0%, #c2502a, transparent 60%), radial-gradient(700px 500px at 100% 100%, #5d2a18, transparent 65%), linear-gradient(135deg, #8a2f17 0%, #3a1408 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(600px 300px at 80% 0%, rgba(255,255,255,0.15), transparent 60%)",
            }}
          />
          <div className="relative max-w-2xl">
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
              For business owners
            </div>
            <h2 className="display-2 mt-3 text-white">Are you EOD? Get listed.</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-white/80">
              If you're an EOD tech with a business — coffee, consulting, construction,
              code, anything — submit it and we'll add you to the directory.
            </p>
            <a
              href="https://www.facebook.com/groups/3602986686487583"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-colors hover:bg-white/90"
            >
              Submit your business
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
