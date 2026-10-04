import { Animated } from '../motion';

export function RoadmapPage() {
  return (
    <>
      <Animated
        as="h1"
        preset="blurUp"
        delay={0.1}
        className="font-heading text-4xl font-normal tracking-tight text-balance text-on-overlay sm:text-6xl"
      >
        Photon’s roadmap
      </Animated>
      <Animated
        as="p"
        preset="blurUp"
        delay={0.2}
        className="max-w-xl text-lg text-on-overlay/80"
      >
        Photon is in development. We’re working toward a fast, private browser
        built on Ladybird, and we’ll share milestones as they take shape.
      </Animated>
      <Animated
        as="a"
        href="https://github.com/PhotonBrowser/landing"
        target="_blank"
        rel="noreferrer"
        preset="fadeUp"
        delay={0.3}
        className="text-sm text-on-overlay underline decoration-on-overlay/50 underline-offset-4 transition-colors hover:decoration-on-overlay"
      >
        Follow development on GitHub
      </Animated>
    </>
  );
}
