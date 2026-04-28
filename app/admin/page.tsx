import Link from "next/link";
import { db, schema } from "@/db/client";
import { auth, signOut } from "@/auth";
import { desc, eq, sql } from "drizzle-orm";
import { ApproveButton, RejectButton, UnapproveButton, DeleteButton } from "./buttons";

export const metadata = { title: "Admin — BuyEOD" };
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const tab = sp.tab === "approved" || sp.tab === "rejected" ? sp.tab : "pending";

  // Fetch businesses for the current tab + counts for all tabs
  const [list, counts] = await Promise.all([
    db
      .select()
      .from(schema.businesses)
      .where(eq(schema.businesses.status, tab))
      .orderBy(desc(schema.businesses.submittedAt)),
    db
      .select({
        status: schema.businesses.status,
        n: sql<number>`count(*)::int`,
      })
      .from(schema.businesses)
      .groupBy(schema.businesses.status),
  ]);

  const countOf = (s: string) => counts.find((c) => c.status === s)?.n ?? 0;

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
            Admin
          </div>
          <h1 className="display-2 mt-3 text-ink">Approval queue.</h1>
          <p className="mt-3 text-[14px] text-ink-muted">
            Signed in as <span className="text-ink">{session?.user?.email}</span>
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-full border border-ink-line bg-white px-4 text-[13px] font-medium text-ink-muted transition-colors hover:border-ink/40 hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap gap-2">
        <Tab label="Pending" count={countOf("pending")} active={tab === "pending"} href="/admin?tab=pending" emphasize />
        <Tab label="Approved" count={countOf("approved")} active={tab === "approved"} href="/admin?tab=approved" />
        <Tab label="Rejected" count={countOf("rejected")} active={tab === "rejected"} href="/admin?tab=rejected" />
      </div>

      {/* List */}
      <div className="mt-8 space-y-4">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-ink-line/70 bg-ink-surface px-8 py-12 text-center">
            <div className="text-[15px] text-ink-muted">
              No {tab} businesses.
            </div>
          </div>
        ) : (
          list.map((b) => <Row key={b.id} b={b} tab={tab} />)
        )}
      </div>
    </section>
  );
}

function Tab({
  label,
  count,
  active,
  href,
  emphasize,
}: {
  label: string;
  count: number;
  active: boolean;
  href: string;
  emphasize?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors " +
        (active
          ? "bg-ink text-white"
          : "border border-ink-line bg-white text-ink hover:border-ink/40")
      }
    >
      {label}
      <span
        className={
          "rounded-full px-2 py-0.5 text-[11px] font-semibold " +
          (active
            ? "bg-white/15 text-white"
            : emphasize && count > 0
              ? "bg-crab text-white"
              : "bg-ink-surface text-ink-muted")
        }
      >
        {count}
      </span>
    </Link>
  );
}

function Row({
  b,
  tab,
}: {
  b: typeof schema.businesses.$inferSelect;
  tab: "pending" | "approved" | "rejected";
}) {
  return (
    <div className="rounded-2xl border border-ink-line/70 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {b.industry || "Business"}
            {b.state && <span className="ml-2 text-ink/60">· {b.state}</span>}
          </div>
          <div className="mt-1 text-[20px] font-semibold tracking-tight text-ink">
            {b.name}
          </div>
          <div className="mt-1 text-[13px] text-ink-muted">
            {b.location} · {b.ownerName}
            {b.phone && <span className="ml-2 text-ink/60">{b.phone}</span>}
            {b.website && (
              <a
                href={b.website}
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-crab hover:text-crab-deep"
              >
                {b.website.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </div>
          {b.description && (
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink/80">
              {b.description}
            </p>
          )}
          <div className="mt-3 text-[12px] text-ink-muted">
            Submitted {new Date(b.submittedAt).toLocaleString()}
            {b.submitterEmail && <span> · {b.submitterEmail}</span>}
            {b.approvedAt && (
              <span>
                {" · "}
                Approved {new Date(b.approvedAt).toLocaleString()}
                {b.approvedBy && b.approvedBy !== "seed" && ` by ${b.approvedBy}`}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {tab === "pending" && (
            <>
              <ApproveButton id={b.id} />
              <RejectButton id={b.id} />
            </>
          )}
          {tab === "approved" && (
            <>
              <Link
                href={`/businesses/${b.slug}`}
                target="_blank"
                className="inline-flex h-9 items-center rounded-full border border-ink-line bg-white px-4 text-[13px] font-medium text-ink-muted transition-colors hover:border-ink/40 hover:text-ink"
              >
                View ↗
              </Link>
              <UnapproveButton id={b.id} />
            </>
          )}
          {tab === "rejected" && (
            <>
              <ApproveButton id={b.id} />
              <DeleteButton id={b.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
