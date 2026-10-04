import { AnimatePresence, motion } from 'motion/react';
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
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-3.5 fill-current"
        >
          <path d="M18.901 1.153h3.68L14.54 10.12 24 22.847h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zm-1.291 19.46h2.039L6.486 3.27H4.298z" />
        </svg>
      ) : (
        label
      )}
    </a>
  );
}

export function SiteNav({ showHomeLink = false }: { showHomeLink?: boolean }) {
  return (
    <motion.nav
      layout
      aria-label="Primary"
      className="flex items-center gap-0.5 rounded-outer bg-overlay p-1 backdrop-blur-md"
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {showHomeLink && (
          <motion.a
            key="home-link"
            href="/"
            aria-label="Home"
            initial={{
              opacity: 0,
              maxWidth: 0,
              paddingLeft: 0,
              paddingRight: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              maxWidth: 120,
              paddingLeft: 16,
              paddingRight: 16,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              maxWidth: 0,
              paddingLeft: 0,
              paddingRight: 0,
              scale: 0.96,
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-inner px-4 py-1.5 text-xs text-on-overlay transition-colors duration-500 hover:bg-overlay-hover"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 shrink-0 fill-none stroke-current stroke-2"
            >
              <path
                d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Home</span>
          </motion.a>
        )}
      </AnimatePresence>
      {siteLinks.map((link) => (
        <SiteNavLink key={link.label} {...link} />
      ))}
    </motion.nav>
  );
}
