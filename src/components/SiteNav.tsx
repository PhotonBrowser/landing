import { siteLinks } from '../config/site';

function SiteNavLink({
  label,
  href,
  external,
}: {
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="rounded-inner px-4 py-1.5 text-xs text-on-overlay transition-colors duration-500 hover:bg-overlay-hover"
    >
      {label}
    </a>
  );
}

export function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="flex items-center gap-0.5 rounded-outer bg-overlay p-1 backdrop-blur-md"
    >
      {siteLinks.map((link) => (
        <SiteNavLink key={link.label} {...link} />
      ))}
    </nav>
  );
}
