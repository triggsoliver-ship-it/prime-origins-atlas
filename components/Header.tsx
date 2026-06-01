import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-sand-50/85 backdrop-blur">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Prime Origins" className="h-10 w-auto object-contain" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-forest-900">Prime Origins</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-forest-600">Atlas</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-forest-800">
          <Link href="/browse" className="hover:text-forest-600">Browse credits</Link>
          <Link href="/how-it-works" className="hover:text-forest-600">How it works</Link>
          <Link href="/sell" className="hover:text-forest-600">List your project</Link>
          <Link href="/about" className="hover:text-forest-600">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sell" className="hidden sm:inline-flex btn-secondary !py-2">For sellers</Link>
          <Link href="/browse" className="btn-primary !py-2">Buy credits</Link>
        </div>
      </div>
    </header>
  );
}
