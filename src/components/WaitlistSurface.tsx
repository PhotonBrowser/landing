import { BorderBeam } from 'border-beam';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type CSSProperties, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { xLink } from '../config/site';
import {
  WAITLIST_COPY,
  WAITLIST_MORPH_SPRING,
  WAITLIST_SURFACE,
} from '../constants/waitlist';
import { useWaitlist, type WaitlistState } from '../hooks/useWaitlist';

const MotionBorderBeam = motion.create(BorderBeam);

function SurfaceContent({
  state,
  shouldReduceMotion,
  hasEntered,
  onSubmit,
  validationError,
  onEmailChange,
}: {
  state: WaitlistState;
  shouldReduceMotion: boolean | null;
  hasEntered: boolean;
  onSubmit: ReturnType<typeof useWaitlist>['submit'];
  validationError: string | null;
  onEmailChange: () => void;
}) {
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.16,
        ease: 'easeOut' as const,
        delay: hasEntered ? 0 : 0.4,
      };
  const isComplete = state === 'success' || state === 'duplicate';

  return (
    <AnimatePresence mode="wait">
      {state === 'submitting' ? (
        <motion.div
          key="submitting"
          initial={
            shouldReduceMotion ? false : { opacity: 0, filter: 'blur(5px)' }
          }
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          className="flex h-9 w-full items-center justify-center gap-2 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          <Spinner
            className="size-5 motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span>{WAITLIST_COPY.submitting}</span>
        </motion.div>
      ) : isComplete ? (
        <motion.div
          key="complete"
          initial={
            shouldReduceMotion ? false : { opacity: 0, filter: 'blur(5px)' }
          }
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          className="relative flex w-full flex-col items-center gap-1 text-center"
          role="status"
          aria-live="polite"
        >
          <h2 className="font-heading text-lg font-medium tracking-tight text-balance">
            {state === 'duplicate'
              ? WAITLIST_COPY.duplicate
              : WAITLIST_COPY.ready}
          </h2>
          {state === 'success' ? (
            <>
              <p className="text-sm text-on-overlay/85 sm:text-base">
                We’ll let you know when Photon is ready.
              </p>
              <a
                href={xLink.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-on-overlay/85 underline decoration-on-overlay/50 underline-offset-4 transition-colors hover:decoration-on-overlay sm:text-base"
              >
                Follow @PhotonBrowser on X →
              </a>
            </>
          ) : (
            <p className="text-sm text-on-overlay/85 sm:text-base">
              We’ll email you when Photon is ready. Follow us on{' '}
              <a
                href={xLink.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-on-overlay/50 underline-offset-4 transition-colors hover:decoration-on-overlay"
              >
                X
              </a>{' '}
              for updates.
            </p>
          )}
        </motion.div>
      ) : (
        <motion.form
          key="form"
          aria-label="Join the Photon waitlist"
          onSubmit={onSubmit}
          noValidate
          initial={
            shouldReduceMotion ? false : { opacity: 0, filter: 'blur(5px)' }
          }
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          className="flex w-full flex-col gap-1 sm:flex-row sm:items-center"
        >
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <div className="relative min-w-0 flex-1">
            <Input
              id="waitlist-email"
              name="email"
              type="email"
              required
              autoComplete="off"
              data-protonpass-ignore="true"
              data-1p-ignore="true"
              data-lpignore="true"
              data-bwignore="true"
              placeholder="Enter your email"
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ? 'waitlist-email-error' : undefined
              }
              onChange={onEmailChange}
              className="h-9 min-w-0 w-full !rounded-[calc(var(--surface-radius)-4px)] border-transparent bg-transparent px-4 py-2 text-xs text-on-overlay shadow-none placeholder:text-on-overlay-muted focus-visible:border-transparent focus-visible:ring-0 aria-invalid:border-transparent aria-invalid:ring-0"
            />
            {validationError && (
              <span
                id="waitlist-email-error"
                role="alert"
                className="t-built-by-tooltip t-validation-tooltip"
              >
                {validationError}
              </span>
            )}
          </div>
          <Button
            type="submit"
            className="h-9 !rounded-[10px] bg-paper px-4 py-2 text-xs text-foreground shadow-sm transition-colors duration-500 hover:bg-white/90"
          >
            Join waitlist
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export function WaitlistSurface() {
  const shouldReduceMotion = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const { state, submit, validationError, clearValidationError } =
    useWaitlist();
  const dimensions =
    state === 'submitting'
      ? WAITLIST_SURFACE.submitting
      : state === 'success' || state === 'duplicate'
        ? WAITLIST_SURFACE.complete
        : WAITLIST_SURFACE.idle;

  return (
    <>
      <MotionBorderBeam
        size="md"
        colorVariant="colorful"
        strength={state === 'success' || state === 'duplicate' ? 0 : 1}
        active={
          state !== 'success' &&
          state !== 'duplicate' &&
          shouldReduceMotion === false
        }
        theme="dark"
        initial={
          shouldReduceMotion
            ? false
            : {
                borderRadius: `${dimensions.radius}px`,
                height: `${dimensions.height}px`,
                padding: dimensions.padding,
                width: `${dimensions.width}px`,
                opacity: 0,
                y: 16,
              }
        }
        animate={{
          borderRadius: `${dimensions.radius}px`,
          height: `${dimensions.height}px`,
          padding: dimensions.padding,
          width: `${dimensions.width}px`,
          opacity: 1,
          y: 0,
        }}
        style={
          {
            '--surface-radius': `${dimensions.radius}px`,
            backdropFilter: 'blur(5px) saturate(150%)',
            WebkitBackdropFilter: 'blur(5px) saturate(150%)',
          } as CSSProperties
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                ...WAITLIST_MORPH_SPRING,
                delay: hasEntered ? 0 : 0.4,
                opacity: {
                  duration: 0.32,
                  ease: 'easeOut',
                  delay: hasEntered ? 0 : 0.4,
                },
              }
        }
        onAnimationComplete={() => setHasEntered(true)}
        className={`mx-auto mt-4 flex w-fit max-w-full items-center bg-overlay text-on-overlay ${
          validationError ? '!overflow-visible' : 'overflow-hidden'
        }`}
      >
        <SurfaceContent
          state={state}
          shouldReduceMotion={shouldReduceMotion}
          hasEntered={hasEntered}
          onSubmit={submit}
          validationError={validationError}
          onEmailChange={clearValidationError}
        />
      </MotionBorderBeam>
      {state === 'error' && (
        <p className="text-xs text-on-overlay" role="alert">
          {WAITLIST_COPY.error}
        </p>
      )}
      {/*<p className="mt-2 text-xs leading-relaxed text-on-overlay/75">
        By joining the waitlist, you agree to receive Photon-related updates.{' '}
        <a
          href="/privacy"
          className="underline decoration-on-overlay/50 underline-offset-4 transition-colors hover:text-on-overlay hover:decoration-on-overlay focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Privacy Policy
        </a>
      </p>*/}
    </>
  );
}
