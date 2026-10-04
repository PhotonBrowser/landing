import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import GradualBlur from './components/GradualBlur';
import { HeroPanel } from './components/HeroPanel';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage })),
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({
    default: module.AboutPage,
  })),
);
const RoadmapPage = lazy(() =>
  import('./pages/RoadmapPage').then((module) => ({
    default: module.RoadmapPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((module) => ({
    default: module.PrivacyPolicyPage,
  })),
);

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const shouldReduceMotion = useReducedMotion();
  const route =
    pathname === '/'
      ? 'home'
      : pathname === '/privacy' || pathname === '/privacy-policy'
        ? 'privacy'
        : pathname === '/about'
          ? 'about'
          : pathname === '/roadmap'
            ? 'roadmap'
            : 'not-found';

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      const destination = new URL(anchor.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, '', destination.href);
      setPathname(destination.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <main className="flex min-h-svh bg-page p-4">
      <GradualBlur
        target="parent"
        position="bottom"
        height="4rem"
        strength={1}
        divCount={3}
        curve="bezier"
        exponential
        opacity={1}
        animated="scroll"
      />
      <HeroPanel showHomeLink={route !== 'home'} currentPath={pathname}>
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, x: 8, filter: 'blur(3px)' }
            }
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            transition={transition}
            className="flex w-full flex-col items-center gap-5"
          >
            <Suspense fallback={null}>
              {route === 'home' ? (
                <HomePage />
              ) : route === 'about' ? (
                <AboutPage />
              ) : route === 'roadmap' ? (
                <RoadmapPage />
              ) : route === 'privacy' ? (
                <PrivacyPolicyPage />
              ) : (
                <NotFoundPage />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </HeroPanel>
    </main>
  );
}

export default App;
