import { BuiltByChip } from '../components/BuiltByChip';
import { WaitlistSurface } from '../components/WaitlistSurface';
import { Animated } from '../motion';

export function HomePage() {
  return (
    <div className="home-hero-content -translate-y-6 flex w-full flex-col items-center gap-5">
      <Animated preset="blurUp" delay={0.1}>
        <BuiltByChip />
      </Animated>
      <Animated
        as="h1"
        preset="blurUp"
        delay={0.2}
        className="home-title w-full min-w-0 font-heading text-4xl font-normal tracking-tight text-balance text-on-overlay sm:text-6xl"
      >
        Meet Photon
      </Animated>
      <Animated
        as="p"
        preset="blurUp"
        delay={0.3}
        className="home-description w-full max-w-xl text-lg text-on-overlay/80"
      >
        Photon is an independent browser built on Ladybird. Fast, private, and
        focused on a better web.
      </Animated>
      <div className="w-full">
        <WaitlistSurface />
      </div>
    </div>
  );
}
