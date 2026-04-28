import { SubmitForm } from "@/components/SubmitForm";

export const metadata = {
  title: "Submit your business — BuyEOD",
  description:
    "If you're an EOD tech with a business, add it to the BuyEOD directory.",
};

export default function SubmitPage() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="max-w-2xl">
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
          Submit
        </div>
        <h1 className="display-1 mt-3 text-ink">Get listed.</h1>
        <p className="mt-6 text-[18px] leading-relaxed text-ink/80">
          If you're an EOD tech with a business, fill this out. We'll add you to
          the directory. Takes about a minute.
        </p>

        <div className="mt-12">
          <SubmitForm />
        </div>
      </div>
    </section>
  );
}
