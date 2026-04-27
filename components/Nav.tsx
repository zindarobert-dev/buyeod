import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-line/60 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between text-[13px]">
        <Link href="/" aria-label="BuyEOD home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-7 text-ink-muted">
          <Link href="/businesses" className="hover:text-ink transition-colors">
            Directory
          </Link>
          <Link href="/about" className="hover:text-ink transition-colors">
            About
          </Link>
          <a
            href="https://www.facebook.com/groups/3602986686487583"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            Community
          </a>
        </nav>
      </div>
    </header>
  );
}
