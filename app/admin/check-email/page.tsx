export const metadata = { title: "Check your inbox — BuyEOD" };

export default function CheckEmailPage() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
          Sent
        </div>
        <h1 className="display-2 mt-3 text-ink">Check your inbox.</h1>
        <p className="mt-5 text-[16px] leading-relaxed text-ink/80">
          We just emailed you a one-time link. Click it to sign in. The link is
          good for 24 hours and only works once.
        </p>
        <p className="mt-3 text-[14px] text-ink-muted">
          Not seeing it? Check spam, then check that you typed an admin email.
        </p>
      </div>
    </section>
  );
}
