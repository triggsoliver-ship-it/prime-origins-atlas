import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-sand-50/85 backdrop-blur supports-[backdrop-filter]:bg-sand-50/70">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50">
          <Image src="/logo.png" alt="Prime Origins" width={40} height={40} priority className="h-10 w-auto object-contain" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-forest-900">Prime Origins</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-forest-600">Atlas</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-forest-800">
          <Link href="/browse" className="relative transition-colors hover:text-forest-600 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-forest-500 after:transition-all after:duration-300 hover:after:w-full">Browse credits</Link>
          <Link href="/how-it-works" className="relative transition-colors hover:text-forest-600 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-forest-500 after:transition-all after:duration-300 hover:after:w-full">How it works</Link>
          <Link href="/sell" className="relative transition-colors hover:text-forest-600 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-forest-500 after:transition-all after:duration-300 hover:after:w-full">List your project</Link>
          <Link href="/about" className="relative transition-colors hover:text-forest-600 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-forest-500 after:transition-all after:duration-300 hover:after:w-full">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sell" className="hidden sm:inline-flex btn-secondary !py-2">For sellers</Link>
          <Link href="/browse" className="btn-primary !py-2">Buy credits</Link>
        </div>
      </div>
    </header>
  );
}
