import type { ReactNode } from 'react';
import { Animated } from '../motion';
import { SiteNav, XIconButton } from './SiteNav';

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

          <XIconButton />
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
          <a
            href="/privacy"
            className="underline decoration-on-overlay/40 underline-offset-4 transition-colors hover:text-on-overlay hover:decoration-on-overlay focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Privacy Policy
          </a>
        </footer>
      </div>
    </div>
  );
}
