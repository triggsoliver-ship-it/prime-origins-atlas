import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-forest-100 bg-white">
      <div className="container-narrow grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-sand-50 text-sm font-bold">PO</span>
            <span className="text-sm font-semibold text-forest-900">Prime Origins Atlas</span>
          </div>
          <p className="mt-3 text-sm text-forest-700/80">
            High-integrity carbon credits, vetted and traceable to source.
          </p>
        </div>
        <FooterCol title="Marketplace" links={[
          { label: 'Browse credits', href: '/browse' },
          { label: 'List a project', href: '/sell' },
          { label: 'Pricing & fees', href: '/how-it-works' }
        ]} />
        <FooterCol title="Resources" links={[
          { label: 'How it works', href: '/how-it-works' },
          { label: 'FAQ', href: '/faq' },
          { label: 'Quality framework', href: '/about#quality' }
        ]} />
        <FooterCol title="Company" links={[
          { label: 'About', href: '/about' },
          { label: 'Parent company', href: 'https://www.primeorigins.org', external: true },
          { label: 'Contact', href: 'mailto:hello@primeorigins.com' }
        ]} />
      </div>
      <div className="border-t border-forest-100 py-5">
        <div className="container-narrow flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-xs text-forest-700/70">
          <span>© {new Date().getFullYear()} Prime Origins. All rights reserved.</span>
          <span>Listings shown are illustrative — final transactions are settled with the underlying registry.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.18em] text-forest-600 font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-forest-800">
        {links.map((l) => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-forest-600">{l.label}</a>
            ) : (
              <Link href={l.href} className="hover:text-forest-600">{l.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
