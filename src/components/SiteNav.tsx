import { motion, useReducedMotion } from 'motion/react';
import { githubLink, siteLinks, xLink } from '../config/site';
import { WAITLIST_MORPH_SPRING } from '../constants/waitlist';

function SiteNavLink({
  label,
  href,
  external,
  icon,
  transition,
  active,
  shouldReduceMotion,
}: {
  label: string;
  href: string;
  external?: boolean;
  icon?: 'x';
  transition: typeof WAITLIST_MORPH_SPRING | { duration: number };
  active: boolean;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.a
      layout
      transition={transition}
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      aria-current={active ? 'page' : undefined}
      aria-label={icon ? label : undefined}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-inner text-[11px] leading-4 text-on-overlay transition-colors duration-300 hover:bg-overlay-hover sm:text-xs ${active ? 'bg-overlay-hover' : ''} ${icon ? 'size-7 p-0' : 'px-1.5 py-1.5 sm:px-4'}`}
    >
      {icon === 'x' ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="relative z-10 size-3.5 fill-current"
        >
          <path d="M18.901 1.153h3.68L14.54 10.12 24 22.847h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zm-1.291 19.46h2.039L6.486 3.27H4.298z" />
        </svg>
      ) : (
        <span className="relative z-10">{label}</span>
      )}
    </motion.a>
  );
}

export function SiteNav({
  showHomeLink = false,
  currentPath,
}: {
  showHomeLink?: boolean;
  currentPath: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : WAITLIST_MORPH_SPRING;

  return (
    <motion.nav
      aria-label="Primary"
      className="flex w-max items-center gap-0 rounded-outer bg-overlay p-1 backdrop-blur-md sm:gap-0.5"
      transition={transition}
    >
      <motion.div
        initial={false}
        animate={{ width: showHomeLink ? 'auto' : 0 }}
        transition={transition}
        aria-hidden={!showHomeLink}
        className="shrink-0 overflow-hidden"
      >
        <motion.a
          href="/"
          aria-label="Home"
          tabIndex={showHomeLink ? undefined : -1}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1, filter: 'blur(0px)', x: 0 }
              : showHomeLink
                ? { opacity: 1, filter: 'blur(0px)', x: 0 }
                : { opacity: 0, filter: 'blur(8px)', x: -8 }
          }
          transition={transition}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-inner px-3 py-1.5 text-xs leading-4 text-on-overlay transition-colors duration-500 hover:bg-overlay-hover"
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
      </motion.div>
      {siteLinks.map((link) => (
        <SiteNavLink
          key={link.label}
          {...link}
          transition={transition}
          shouldReduceMotion={shouldReduceMotion}
          active={
            !('external' in link && link.external) &&
            (currentPath === link.href ||
              (link.href === '/privacy' && currentPath === '/privacy-policy'))
          }
        />
      ))}
    </motion.nav>
  );
}

export function XIconButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={xLink.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Photon on ${xLink.label}`}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={shouldReduceMotion ? { duration: 0 } : WAITLIST_MORPH_SPRING}
      className="inline-flex size-8 items-center justify-center justify-self-end rounded-inner bg-overlay text-on-overlay backdrop-blur-md transition-colors duration-300 hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <img src="/icons/x.svg" alt="" className="size-4 brightness-0 invert" />
      <span className="sr-only">Photon on {xLink.label}</span>
    </motion.a>
  );
}

export function GitHubIconButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={githubLink.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Photon on ${githubLink.label}`}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={shouldReduceMotion ? { duration: 0 } : WAITLIST_MORPH_SPRING}
      className="inline-flex size-8 items-center justify-center justify-self-end rounded-inner bg-overlay text-on-overlay backdrop-blur-md transition-colors duration-300 hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <img
        src="/icons/github.svg"
        alt=""
        className="size-4.5 brightness-0 invert"
      />
      <span className="sr-only">Photon on {githubLink.label}</span>
    </motion.a>
  );
}
