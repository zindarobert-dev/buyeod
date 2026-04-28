import Link from "next/link";
import { Map } from "@/components/Map";
import { BusinessCard } from "@/components/BusinessCard";
import { getAllBusinesses, getActiveStates } from "@/lib/businesses";
import { STATE_NAMES } from "@/lib/states";

export default async function Home() {
  const [businesses, states] = await Promise.all([
    getAllBusinesses(),
    getActiveStates(),
  ]);
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
              "radial-gradient(1200px 600px at 8% -10%, rgba(208,74,23,0.32), transparent 55%), radial-gradient(900px 500px at 95% 5%, rgba(212,146,15,0.22), transparent 60%), radial-gradient(700px 420px at 50% 110%, rgba(29,74,133,0.12), transparent 65%)",
          }}
        />
        <div className="container-page pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-crab ring-1 ring-crab/20 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-crab" />
              Explosive Ordnance Disposal
            </div>
            <h1 className="display-1 mt-5 text-ink">
              Businesses owned by EOD techs.
            </h1>
            <p className="mt-6 max-w-2xl text-[20px] leading-relaxed text-ink/80 sm:text-[22px]">
              <span className="font-semibold text-ink">Support one of our own.</span>{" "}
              The community is open for business.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/businesses"
                className="inline-flex h-12 items-center rounded-full bg-crab px-7 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(208,74,23,0.55)] transition-all hover:bg-crab-deep hover:shadow-[0_10px_28px_-8px_rgba(208,74,23,0.7)]"
              >
                Browse the directory
              </Link>
              <Link
                href="/submit"
                className="inline-flex h-12 items-center rounded-full border border-ink/15 bg-white/70 px-7 text-[14px] font-semibold text-ink backdrop-blur transition-colors hover:border-ink/40 hover:bg-white"
              >
                Submit your business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="container-page">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
              On the map
            </div>
            <h2 className="display-2 mt-3 text-ink">Find what's near you.</h2>
          </div>
          <div className="hidden items-end gap-8 sm:flex">
            <div>
              <div className="text-[28px] font-semibold tracking-tight text-ink leading-none">
                {businesses.length}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Businesses
              </div>
            </div>
            <div>
              <div className="text-[28px] font-semibold tracking-tight text-ink leading-none">
                {states.length}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                States
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-ink-line/70 bg-ink-surface shadow-[0_18px_50px_-24px_rgba(0,0,0,0.18)]">
          <div className="h-[560px] w-full">
            <Map businesses={businesses} />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page mt-24">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
              Featured
            </div>
            <h2 className="display-2 mt-3 text-ink">Recently added.</h2>
          </div>
          <Link
            href="/businesses"
            className="hidden text-[14px] font-semibold text-crab hover:text-crab-deep sm:inline-block"
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
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
          By location
        </div>
        <h2 className="display-2 mt-3 text-ink">Browse by state.</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {states.map((s) => (
            <Link
              key={s}
              href={`/state/${s.toLowerCase()}`}
              className="group rounded-full border border-ink-line bg-white px-4 py-1.5 text-[13px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-crab/40 hover:bg-crab/5 hover:text-crab-deep"
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
            <Link
              href="/submit"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-[14px] font-semibold text-ink transition-colors hover:bg-white/90"
            >
              Submit your business
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
