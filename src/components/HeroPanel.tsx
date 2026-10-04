import type { ReactNode } from 'react';
import { contributors } from '../config/site';
import { Animated } from '../motion';
import { GitHubIconButton, SiteNav, XIconButton } from './SiteNav';

function TheoCredit() {
  const visibleContributors = contributors.filter(
    (contributor) => contributor.avatar,
  );
  if (visibleContributors.length === 0) return null;

  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap text-on-overlay/65">
      <span>Built with</span>
      <span aria-label="love" role="img" className="text-rose-500">
        ♥
      </span>
      <span>by:</span>
      <span className="max-w-24">
        <ul
          aria-label="Contributors"
          className="inline-flex list-none items-center -space-x-1.5 pr-1"
        >
          {visibleContributors.map((contributor) => (
            <li key={contributor.name} className="t-avatar-item rounded-full">
              <a
                href={contributor.href}
                target="_blank"
                rel="noreferrer"
                className="t-avatar inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={`Built by ${contributor.displayName}`}
              >
                <img
                  src={contributor.avatar}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-5 rounded-full object-cover"
                />
              </a>
              <span
                aria-hidden="true"
                className="t-built-by-tooltip t-contributor-tooltip"
              >
                {contributor.name}
              </span>
            </li>
          ))}
        </ul>
      </span>
    </span>
  );
}

type HeroPanelProps = {
  children: ReactNode;
  contentClassName?: string;
  showHomeLink?: boolean;
  currentPath: string;
};

export function HeroPanel({
  children,
  contentClassName,
  showHomeLink = false,
  currentPath,
}: HeroPanelProps) {
  return (
    <div className="relative isolate grid flex-1 overflow-hidden rounded-squircle bg-linear-to-b from-photon-iris-soft via-photon-sky-soft to-photon-mist-soft ring-1 ring-hairline ring-inset">
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        {/* Cloud image */}
        <img
          src="/clouds-low.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Colour/tint overlay */}
        <div className="absolute inset-0 z-20 bg-page/25" />
      </div>

      {/* UI */}
      <div className="relative z-30 col-start-1 row-start-1 flex flex-col">
        <header className="grid w-full grid-cols-[1fr_auto_1fr] items-center px-2 py-3 sm:px-4 sm:py-4">
          <Animated
            as="a"
            href="/"
            preset="fade"
            delay={0.05}
            className="flex items-center justify-self-start"
          >
            <img
              src="/brand-kit/logo/logo-color.svg"
              alt="Photon"
              className="size-8 drop-shadow-[0_2px_5px_rgba(20,35,90,0.35)] sm:size-9"
            />
          </Animated>

          <Animated
            as="div"
            preset="fade"
            delay={0.1}
            className="justify-self-center"
          >
            <SiteNav showHomeLink={showHomeLink} currentPath={currentPath} />
          </Animated>

          <div className="flex items-center justify-self-end gap-1.5">
            <XIconButton />
            <GitHubIconButton />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div
            className={`flex w-full min-w-0 max-w-3xl flex-col items-center gap-5 px-6 text-center ${
              contentClassName ?? ''
            }`}
          >
            {children}
          </div>
        </div>

        <footer className="flex items-center justify-between px-4 pb-2 text-xs text-on-overlay/75">
          <span>© 2026 Photon Browser. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <TheoCredit />
            <a
              href="/privacy"
              className="underline decoration-on-overlay/40 underline-offset-4 transition-colors hover:text-on-overlay hover:decoration-on-overlay focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
