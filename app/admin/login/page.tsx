import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in — BuyEOD admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("resend", {
      email,
      redirectTo: "/admin",
    });
  }

  return (
    <section className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
          Admin
        </div>
        <h1 className="display-2 mt-3 text-ink">Sign in.</h1>
        <p className="mt-5 text-[16px] leading-relaxed text-ink/80">
          Enter your email — we'll send a one-time link. Only allow-listed admin
          addresses can complete sign-in.
        </p>

        {sp.error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            That sign-in didn't go through. Make sure you're using your
            admin email and try again.
          </div>
        )}

        <form action={login} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-ink-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-crab focus:outline-none focus:ring-4 focus:ring-crab/15"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-full bg-crab px-7 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(208,74,23,0.55)] transition-all hover:bg-crab-deep hover:shadow-[0_10px_28px_-8px_rgba(208,74,23,0.7)]"
          >
            Send sign-in link
          </button>
        </form>
      </div>
    </section>
  );
}
