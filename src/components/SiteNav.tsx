import { siteLinks } from '../config/site';

function SiteNavLink({
  label,
  href,
  external,
  icon,
}: {
  label: string;
  href: string;
  external?: boolean;
  icon?: 'x';
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      aria-label={icon ? label : undefined}
      className={`inline-flex items-center justify-center rounded-inner py-1.5 text-xs text-on-overlay transition-colors duration-500 hover:bg-overlay-hover ${icon ? 'px-3' : 'px-4'}`}
    >
      {icon === 'x' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 fill-current">
          <path d="M18.901 1.153h3.68L14.54 10.12 24 22.847h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zm-1.291 19.46h2.039L6.486 3.27H4.298z" />
        </svg>
      ) : (
        label
      )}
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
