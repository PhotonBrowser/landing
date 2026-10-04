import { lazy, Suspense, useEffect, useState } from 'react';
import GradualBlur from './components/GradualBlur';
import { HeroPanel } from './components/HeroPanel';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage })),
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

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      <HeroPanel>
        <Suspense fallback={null}>
          {pathname === '/' ? (
            <HomePage />
          ) : pathname === '/privacy' || pathname === '/privacy-policy' ? (
            <PrivacyPolicyPage />
          ) : (
            <NotFoundPage />
          )}
        </Suspense>
      </HeroPanel>
    </main>
  );
}

export default App;
