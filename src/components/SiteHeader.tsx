import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-slate-950"
        >
          スライダー
        </Link>
        <p className="hidden text-sm text-slate-500 md:block">
          世界を、触って理解する。
        </p>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-600 transition-colors hover:text-teal-800"
          >
            テーマ
          </Link>
          <Link
            href="/eras"
            className="text-slate-600 transition-colors hover:text-teal-800"
          >
            時代
          </Link>
        </nav>
      </div>
    </header>
  );
}
