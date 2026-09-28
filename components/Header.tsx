import Link from 'next/link';
import Image from 'next/image';
import EcosystemMenu from './EcosystemMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest-900/95 backdrop-blur supports-[backdrop-filter]:bg-forest-900/85">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900">
          <Image src="/logo.png" alt="Prime Origins" width={40} height={40} priority className="h-10 w-auto object-contain" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sand-50">Prime Origins</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold-400">Atlas</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-sand-100/80">
          <Link href="/browse" className="relative transition-colors hover:text-gold-400 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">Browse projects</Link>
          <Link href="/how-it-works" className="relative transition-colors hover:text-gold-400 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">How it works</Link>
          <Link href="/sell" className="relative transition-colors hover:text-gold-400 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">List your project</Link>
          <Link href="/about" className="relative transition-colors hover:text-gold-400 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">About</Link>
          <EcosystemMenu />
        </nav>
        <div className="flex items-center gap-3">
          {/* btn-secondary sets display:inline-flex in a later layer than the
              `hidden` utility, so the class alone never hid this below sm and
              the two buttons wrapped their own labels on a phone. */}
          <span className="hidden sm:block">
            <Link href="/sell" className="btn-secondary !border-sand-50/40 !text-sand-50 hover:!bg-white/10 !py-2 whitespace-nowrap">For sellers</Link>
          </span>
          <Link href="/browse" className="btn-primary !py-2 whitespace-nowrap">Get a quote</Link>
        </div>
      </div>
    </header>
  );
}
