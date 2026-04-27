import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-line/60 bg-ink-surface/60">
      <div className="container-page py-12 text-[13px] text-ink-muted">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo size="lg" />
            <div className="mt-1 max-w-md">
              A directory of businesses owned by Explosive Ordnance Disposal techs.
              Built by the community, for the community.
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/businesses" className="hover:text-ink">Directory</Link>
            <Link href="/about" className="hover:text-ink">About</Link>
            <a
              href="https://www.facebook.com/groups/3602986686487583"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              Community
            </a>
          </div>
        </div>
        <div className="mt-10 text-xs">
          © {new Date().getFullYear()} BuyEOD
        </div>
      </div>
    </footer>
  );
}
