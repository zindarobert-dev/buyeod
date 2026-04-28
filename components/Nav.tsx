import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-line/60 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between text-[13px]">
        <Link href="/" aria-label="BuyEOD home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-ink-muted">
          <Link href="/businesses" className="hover:text-ink transition-colors">
            Directory
          </Link>
          <Link href="/about" className="hover:text-ink transition-colors hidden sm:inline">
            About
          </Link>
          <a
            href="https://www.facebook.com/groups/3602986686487583"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors hidden sm:inline"
          >
            Community
          </a>
          <Link
            href="/submit"
            className="inline-flex h-8 items-center rounded-full bg-crab px-4 text-[13px] font-semibold text-white transition-colors hover:bg-crab-deep"
          >
            Submit
          </Link>
        </nav>
      </div>
    </header>
  );
}
