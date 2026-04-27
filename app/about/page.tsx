export const metadata = {
  title: "About — BuyEOD",
  description: "Why BuyEOD exists.",
};

export default function AboutPage() {
  return (
    <article className="container-page py-20 sm:py-28">
      <div className="max-w-2xl">
        <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          About
        </div>
        <h1 className="display-1 mt-4 text-ink">For the community.</h1>
        <div className="mt-12 space-y-7 text-[18px] leading-relaxed text-ink/85">
          <p>
            BuyEOD is a directory of businesses owned and operated by Explosive
            Ordnance Disposal technicians. The community is small, scattered, and
            fiercely loyal — and we want to make it easier to find and support each
            other's work.
          </p>
          <p>
            Many of the businesses here are hyper-local: a coffee roaster in
            Asheville, a brewery on the Gulf, a knife maker in Bend. The point of
            the map and state filter is to help you stumble onto the people in
            your zip code that you didn't know were on the same team.
          </p>
          <p>
            If you're an EOD tech with a business and you're not on here yet,{" "}
            <a
              href="https://www.facebook.com/groups/3602986686487583"
              target="_blank"
              rel="noreferrer"
              className="text-ink underline underline-offset-4 hover:no-underline"
            >
              submit it through the Facebook group
            </a>
            . We add new listings as they come in.
          </p>
        </div>
      </div>
    </article>
  );
}
