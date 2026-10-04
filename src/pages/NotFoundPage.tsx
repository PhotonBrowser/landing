import { Animated } from '../motion';

export function NotFoundPage() {
  return (
    <>
      <Animated
        as="p"
        preset="blurUp"
        delay={0.1}
        className="text-sm font-medium tracking-[0.2em] text-on-overlay/75"
      >
        404
      </Animated>
      <Animated
        as="h1"
        preset="blurUp"
        delay={0.2}
        className="font-heading text-4xl font-normal tracking-tight text-balance text-on-overlay sm:text-6xl"
      >
        Page not found
      </Animated>
      <Animated
        as="p"
        preset="blurUp"
        delay={0.3}
        className="max-w-xl text-lg text-on-overlay/80"
      >
        This page isn’t part of the Photon experience.
      </Animated>
      <Animated
        as="a"
        href="/"
        preset="fadeUp"
        delay={0.4}
        className="pressable rounded-[12px] border border-white/30 bg-white/15 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Back to home
      </Animated>
    </>
  );
}
