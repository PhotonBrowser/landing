import { Animated } from '../motion';
import { BuiltByChip } from './BuiltByChip';
import { SiteNav } from './SiteNav';
import { WaitlistSurface } from './WaitlistSurface';

export function HeroPanel() {
  return (
    <div className="grid flex-1 overflow-hidden rounded-squircle bg-linear-to-b from-photon-iris-soft via-photon-sky-soft to-photon-mist-soft ring-1 ring-hairline ring-inset">
      <div aria-hidden="true" className="col-start-1 row-start-1 grid">
        <img
          src="/clouds-low.webp"
          alt=""
          className="col-start-1 row-start-1 h-full w-full object-cover"
        />
        <div className="col-start-1 row-start-1 bg-page/25" />
      </div>
      <div className="col-start-1 row-start-1 flex flex-col">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center p-4">
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
              className="size-7"
            />
          </Animated>
          <Animated as="div" preset="fade" delay={0.1}>
            <SiteNav />
          </Animated>
          <div aria-hidden="true" />
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
            <Animated preset="blurUp" delay={0.1}>
              <BuiltByChip />
            </Animated>
            <Animated
              as="h1"
              preset="blurUp"
              delay={0.2}
              className="font-heading text-4xl font-normal tracking-tight text-balance text-on-overlay sm:text-6xl"
            >
              A better
              <br />
              browsing experience.
            </Animated>
            <Animated
              as="p"
              preset="blurUp"
              delay={0.3}
              className="max-w-xl text-lg text-on-overlay/80"
            >
              Photon is an independent browser built on Ladybird. Fast, private,
              and focused on a better web.
            </Animated>
            <div className="w-full">
              <WaitlistSurface />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
